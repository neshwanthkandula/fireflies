import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Message } from "svix/dist/api/message";


export async function  POST(request : Request, 
    {params} : {params : { meetingid : string}}
) {
    try{
      const { userId } =  await auth()
        if(!userId){
            return NextResponse.json({
                error : "user NOt Authenticated"
            }, {status : 401})
        }

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        const { meetingid } = await params
        const { botScheduled } = await request.json()

        if(!user){
            return NextResponse.json({error : "user not found"}, { status : 404})
        }

        const meeting = await prisma.meeting.update({
            where: {
                id : meetingid,
                userId : user.id 
            },
            data : {
                botScheduled : botScheduled
            }
        })

        return NextResponse.json({
            success : true,
            botScheduled : meeting.botScheduled,
            message :  `Bot ${botScheduled? 'enable' : 'disabled'} for meeting`
        })
    }catch(err){
        console.error('Bot toggle error: ', err)
        return NextResponse.json({
            error : "Failed to update bot status"
        }, {status : 500})
    }

    
}