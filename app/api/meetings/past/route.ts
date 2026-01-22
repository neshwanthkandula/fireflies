import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest) {
    
    try {
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

        if(!user){
            return NextResponse.json({error : "user not found"}, { status : 404})
        }

        const PastMeetings  = await prisma.meeting.findMany({
            where : {
                userId : user.id ,
                meetingEnded : true
            },
            orderBy : {
                endTime : "desc"
            },
            take : 10
        })

        return NextResponse.json({ meetings :  PastMeetings})
    }catch(err){
        return NextResponse.json({ error : "failed to past meeting's", meetings : []}, {status : 500})
    }
}