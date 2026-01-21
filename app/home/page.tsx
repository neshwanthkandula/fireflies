"use client"

import PastMeetings from "./components/pastMeetings"
import UpcomingMeetings from "./components/Upcomingpage"
import { useMeeting } from "./hooks/useMeetings"
import { useRouter } from "next/navigation"

const Page = () => {
  const {
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
    toggleBot,
    directOAuth,
    getAttendeeList,
    getInitials
  } = useMeeting()

  const router = useRouter()

  const handleMeetingClick = (meetingId: string) => {
    router.push(`/meeting/${meetingId}`)
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        Please sign in
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex gap-6 p-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Past Meetings</h2>

          <PastMeetings
            pastMeetings={pastMeetings}
            pastLoading={pastLoading}
            onMeetingClick={handleMeetingClick}
            getAttendeeList={getAttendeeList}
            getInitials={getInitials}
          />
        </div>

        <div className="w-px bg-border" />

        <div className="w-96">
          <div className="sticky top-6">
            <UpcomingMeetings
              upcomingEvents={upcomingEvents}
              connected={connected}
              error={error}
              loading={loading}
              initialLoading={initialLoading}
              botToggles={botToggles}
              onRefresh={fetchUpcomingEvents}
              onToggleBot={toggleBot}
              onConnectCalendar={directOAuth}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
