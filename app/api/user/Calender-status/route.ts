import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import { connect } from "http2";
import { NextRequest, NextResponse } from "next/server";

export async function  GET(request : NextRequest) {
    try {
        const { userId }  = await auth()

        if(!userId){
            return NextResponse.json({error : "not authenticated"}, {status : 401})
        }

        const user = await prisma.user.findUnique({
            where : {
                clerkId : userId
            },
            select : {
                calendarConnected : true,
                googleAccessToken : true
            }
        })

        return NextResponse.json({
            connected : user?.calendarConnected && !!user?.googleAccessToken
        })
    }catch(err){
        return NextResponse.json({
            connect : "false"
        })
    }
}