'use client'

import { useAuth } from "@clerk/nextjs"
import { error } from "console"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"


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

interface UsageData{
    currentPlan : string,
    subscriptionStatus : string,
    MeetingsThisMonth : number ,
    chatMessageToday : number,
    billingPeriodStart : string | null
}

interface UsageContextType{
    usage : UsageData | null
    loading: boolean
    canChat : boolean
    limits : PlanLimits
    canScheduleMeetings : boolean
    incrementChatUsage : () => Promise<void>
    incrementMeetingUsage : ()=> Promise<void>
    refreshUsage : ()=> Promise<void> 
}



const UsageContext = createContext<UsageContextType | undefined>(undefined)

export function UsageProvider({children} : { children : ReactNode}){
    const { userId , isLoaded } = useAuth()
    const [ usage , setusage ] = useState<UsageData | null>(null)
    const [loading , setLoading ]= useState(true)

    const limits = usage? PLAN_LIMITS[usage.currentPlan] || PLAN_LIMITS.free : PLAN_LIMITS.free

    const canchat = usage ? (
        usage.currentPlan !== "free" &&
        usage.subscriptionStatus === "active" &&
        (limits.chatMessages === -1 ||  usage.chatMessageToday < limits.chatMessages)
    ) : false

    const canScheduleMeetings = usage ? (
        usage.currentPlan !== "free" &&
        usage.subscriptionStatus === "active" &&
        (limits.meetings === -1 ||  usage.MeetingsThisMonth < limits.meetings)
    ) : false


    const fetchUsage = async ()=>{
        if(!userId) return 
        try {
            const response = await fetch("/api/user/usage")
            if(response.ok){
                const data = await response.json()
                setusage(data)
            }
        } catch(err){
            console.log("failed to fetch usage",  err)
        }finally{
            setLoading(false)
        }
    }

    const incrementChatUsage = async()=>{
        if(!canchat){
            return 
        }

        try{
            const res  = await fetch("/api/user/increment-chat",{
                method : 'POST',
                headers : { 'Content-Type' : 'application/json'}
            })

            if(res.ok){
                setusage(prev => prev?{
                    ...prev,
                    chatMessageToday: prev.chatMessageToday+1 
                }: null)
            }else{
                const data = await res.json()
                if(data.upgradeRequired){
                    console.log(data.user)
                }
            }

        }catch(err){
            console.error("failed to increment chat ussage", err)
        }
    }


    const incrementMeetingUsage = async() =>{
        if(!canScheduleMeetings){
            return 
        }

        try{
            const res= await fetch('/api/user/increment-meeting', {
                method : 'POST',
                headers : {'Content-Type' : 'application/json'}
            })

            if(res.ok){
                setusage(prev => prev?{
                    ...prev,
                    MeetingsThisMonth: prev.MeetingsThisMonth+1 } : null
                )
            }
        }catch(err){
            console.error("failed to increment meeting usage:" , err)
        }
    }


    const refreshUsage = async()=>{
        await fetchUsage()
    }

    useEffect(()=>{
        if(isLoaded && userId){
            fetchUsage()
        }else if(isLoaded && !userId){
            setLoading(false)
        }
    }, [userId, isLoaded])


    return (
        <UsageContext.Provider value={{
            usage,
            loading,
            canChat: canchat,
            canScheduleMeetings,
            limits,
            incrementChatUsage,
            incrementMeetingUsage,
            refreshUsage

        }}>
            {children}
        </UsageContext.Provider>
    )
}

export function useUsage(){
    const context  = useContext(UsageContext)
    if(context === undefined){
        throw new Error("useUsage must be defined")
    }

    return context
}