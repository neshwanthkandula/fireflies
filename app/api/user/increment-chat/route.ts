import prisma from "@/lib/prisma";
import { canUserChat, incrementChatUsage } from "@/lib/usage";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request : NextRequest){
    try {
        const {userId } = await auth()
        if(!userId){
            return NextResponse.json({error : "not authentated"}, {status : 401})
        }

        const user = await prisma.user.findUnique({
            where : {
                clerkId : userId ,
            },
            select :{
                id : true,
                currentPlan : true,
                subscriptionStatus : true,
                chatMessagesToday : true
            }
        })

        if(!user){
            return NextResponse.json({ error : "User not found"}, {status : 404})
        }


        const chatcheck = await canUserChat(user.id)
        if(!chatcheck.allowed){
            return NextResponse.json({error :  chatcheck.reason, upgradeRequired : true}, {status : 403})
        }

        await incrementChatUsage(user.id)
        return NextResponse.json({ success : true})


    }catch(err){
        console.error(err)
        return NextResponse.json({ error : "failed to increment usage"}, { status : 500})
    }
}