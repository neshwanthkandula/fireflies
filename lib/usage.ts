import prisma from "./prisma"


interface PlanLimits{
    meetings : number ,
    chatMessages : number
}

const PLAN_LIMITS : Record<string, PlanLimits> = {
    free : { meetings :0 , chatMessages : 0},
    starter : { meetings : 10, chatMessages  : 30 },
    pro : { meetings : 30, chatMessages  : 100 },
    premium : { meetings : -1, chatMessages  : -1 }, //unlimited plan 
}

export async function  canUserChat(userId : string) {
    const user = await prisma.user.findUnique({
        where : {
            id : userId
        }
    })

    if(!user){
        return {allowed : false , reason : "user NOT Found"}
    }

    if(user.currentPlan === "free" || user.currentPlan === "expired"){
        return {allowed : false , reason : "upgrade the plan to chat with AI bot"}
    }


    const limits = PLAN_LIMITS[user.currentPlan]
    if(!limits){
        return {allowed : false,  reason : "invalid subscription plan"}
    }

    if(limits.chatMessages !== -1 && user.chatMessagesToday >= limits.chatMessages){
        return {allowed : false, reason : `you reached your dialy limit of ${limits.chatMessages}` }
    }


    return {allowed: true}
}

export async function incrementMeetingUsage(userId : string){
    await prisma.user.update({
        where : {
            id : userId
        },
        data : {
            meetingsThisMonth : {
                increment : 1
            }
        }
    })
}

export async function incrementChatUsage(userId : string){
    await prisma.user.update({
        where : {
            id : userId
        },
        data : {
            chatMessagesToday : {
                increment : 1
            }
        }
    })
}


export function getPlanLimits(plan : string){
    return PLAN_LIMITS[plan] || PLAN_LIMITS.free
}