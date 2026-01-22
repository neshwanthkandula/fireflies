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

        const now  = new Date()

        const upComingMeetings = await prisma.meeting.findMany({
            where : {
                userId : user.id, 
                startTime : { gte : now},
                isFromCalendar : true 
            },
            orderBy: {
                startTime : "asc"
            },
            take : 10
        })

        const events = upComingMeetings.map((meeting)=>({
            id  : meeting.calendarEventId || meeting.id,
            summary : meeting.title ,
            start : {
                dateTime : meeting.startTime.toISOString()
            },
            end : {
                dateTime : meeting.startTime.toISOString()
            },
            attendees : meeting.attendees?JSON.parse(meeting.attendees as string) : [],
            hangoutLink : meeting.meetingUrl ,
            conferenceData : meeting.meetingUrl ? { entryPoints : [{uri : meeting.meetingUrl }]} : null, 
            botScheduled : meeting.botScheduled,
            meetingId : meeting.id

        }))

        return NextResponse.json({
            events, 
            connected: user.calendarConnected,
            source : 'database'
        })
    }catch(err){
        console.log("error fetching meetings : " , err)
        return NextResponse.json({
            error : "failed to fetch meetings",
            events : [],
            connected : false
        }, {status : 500})
    }
}