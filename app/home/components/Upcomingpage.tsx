import { CalendarEvent } from "../hooks/useMeetings"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Clock } from "lucide-react"
import { format } from "date-fns"

interface UpcomingMeetingsProps {
  upcomingEvents: CalendarEvent[]
  connected: boolean
  error: string
  loading: boolean
  initialLoading: boolean
  botToggles: Record<string, boolean>
  onRefresh: () => void
  onToggleBot: (eventId: string) => void
  onConnectCalendar: () => void
}

function UpcomingMeetings({
  upcomingEvents,
  connected,
  error,
  loading,
  initialLoading,
  botToggles,
  onRefresh,
  onToggleBot,
  onConnectCalendar
}: UpcomingMeetingsProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Upcoming</h2>
        <span className="text-sm text-muted-foreground">
          ({upcomingEvents.length})
        </span>
      </div>

      {error && (
        <div className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {initialLoading ? (
        <div className="bg-card p-6 border rounded-lg animate-pulse" />
      ) : !connected ? (
        <div className="bg-card p-6 text-center border rounded-lg">
            <div className='w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3'>
                📆
            </div>
          <h3 className="font-semibold mb-2">Connect Calendar</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect Google Calendar to see upcoming meetings
          </p>
          <Button onClick={onConnectCalendar} disabled={loading} className="w-full">
            {loading ? "Connecting..." : "Connect Google Calendar"}
          </Button>
        </div>
      ) : upcomingEvents.length === 0 ? (
        <div className="bg-card p-6 text-center border rounded-lg">
          No upcoming meetings
        </div>
      ) : (
        <div className="space-y-3">
          <Button onClick={onRefresh} disabled={loading} className="w-full">
            {loading ? "Loading..." : "Refresh"}
          </Button>

          {upcomingEvents.map(event => {
            const start =
              event.start?.dateTime || event.start?.date

            return (
              <div
                key={event.id}
                className="bg-card p-3 border rounded-lg relative"
              >
                <div className="absolute top-3 right-3">
                  <Switch
                    checked={!!botToggles[event.id]}
                    onCheckedChange={() => onToggleBot(event.id)}
                  />
                </div>

                <h4 className="font-medium text-sm mb-2 pr-12">
                  {event.summary || "No Title"}
                </h4>

                {start && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {format(new Date(start), "MMM d, h:mm a")}
                  </div>
                )}

                {(event.hangoutLink || event.location) && (
                  <a
                    href={event.hangoutLink || event.location}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="mt-2 w-full h-6 text-xs">
                      Join Meeting
                    </Button>
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default UpcomingMeetings
