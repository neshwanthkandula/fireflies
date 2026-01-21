import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function  GET(request : NextRequest){
    try {
        const { userId} = await auth()
        if(!userId){
            return NextResponse.json(
                { error : "not authentcated"} , {status : 401}
            )
        }

        const user = await prisma.user.findFirst({
            where : {
                clerkId : userId 
            },
            select :{
                currentPlan : true,
                subscriptionStatus : true,
                meetingsThisMonth : true,
                chatMessagesToday : true,
                billingPeriodStart : true
            }
        })


        if(!user){
            return NextResponse.json({error : "user Not found"}, { status : 404 })
        }

        return NextResponse.json(user)

    }catch(err){
        return NextResponse.json({ error : "failed to fetch usaged"}, {status : 500})
    }
}