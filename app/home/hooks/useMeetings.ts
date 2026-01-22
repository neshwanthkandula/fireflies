import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export interface CalendarEvent {
  id: string
  summary: string
  start?: {
    dateTime?: string
    date?: string
  }
  attendees?: Array<{ email: string }>
  location?: string
  hangoutLink?: string
  conferenceData?: Record<string, unknown>
  boolScheduled?: boolean
  meetingId: string
}

export interface PastMeeting {
  id: string
  title: string
  description?: string | null
  meetingUrl: string | null
  startTime: Date
  endTime: Date
  attendees?: string[] | string
  transcriptReady: boolean
  recordingUrl?: string | null
  speakers?: unknown
}

export function useMeeting() {
  const { userId } = useAuth()

  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([])
  const [pastMeetings, setPastMeetings] = useState<PastMeeting[]>([])
  const [loading, setLoading] = useState(false)
  const [pastLoading, setPastLoading] = useState(false)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState("")
  const [botToggles, setBotToggles] = useState<Record<string, boolean>>({})
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchUpcomingEvents()
      fetchPastMeetings()
    }
  }, [userId])

  const fetchUpcomingEvents = async () => {
    setLoading(true)
    setError("")

    try {
      const statusRes = await fetch("/api/user/calender-status")
      const statusData = await statusRes.json()

      if (!statusData.connected) {
        setConnected(false)
        setUpcomingEvents([])
        setError("Calendar is not connected. Connect to enable auto-sync.")
        return
      }

      setConnected(true)

      const res = await fetch("/api/meetings/upcoming")
      const result = await res.json()

      if (!res.ok) {
        setError(result.error || "Failed to fetch meetings")
        return
      }

      const events = result.events as CalendarEvent[]
      setUpcomingEvents(events)

      const toggles: Record<string, boolean> = {}
      events.forEach(event => {
        toggles[event.id] = event.boolScheduled ?? true
      })
      setBotToggles(toggles)
    } catch {
      setError("Failed to fetch calendar events")
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const fetchPastMeetings = async () => {
    setPastLoading(true)
    try {
      const res = await fetch("/api/meetings/past")
      const result = await res.json()

      if (res.ok && !result.error) {
        setPastMeetings(result.meetings as PastMeeting[])
      }
    } catch (err) {
      console.error("Failed to fetch past meetings", err)
    } finally {
      setPastLoading(false)
    }
  }

  const toggleBot = async (eventId: string) => {
    const event = upcomingEvents.find(e => e.id === eventId)
    if (!event) return

    const nextValue = !botToggles[eventId]

    setBotToggles(prev => ({
      ...prev,
      [eventId]: nextValue
    }))

    try {
      const res = await fetch(
        `/api/meetings/${event.meetingId}/bot-toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ botScheduled: nextValue })
        }
      )

      if (!res.ok) {
        throw new Error("Toggle failed")
      }
    } catch {
      setBotToggles(prev => ({
        ...prev,
        [eventId]: !nextValue
      }))
    }
  }

  const directOAuth = () => {
    window.location.href = "/api/auth/google/direct-connect"
  }

  const getAttendeeList = (attendees: unknown): string[] => {
    if (!attendees) return []

    if (Array.isArray(attendees)) {
      return attendees.map(a => String(a).trim())
    }

    return String(attendees)
      .split(",")
      .map(a => a.trim())
      .filter(Boolean)
  }

  const getInitials = (name: string): string =>
    name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return {
    userId,
    upcomingEvents,
    pastMeetings,
    loading,
    pastLoading,
    connected,
    error,
    botToggles,
    initialLoading,
    fetchUpcomingEvents,
    fetchPastMeetings,
    toggleBot,
    directOAuth,
    getAttendeeList,
    getInitials
  }
}
