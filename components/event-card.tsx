import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    location: string
    datetime: string
    participant_limit?: number
    ticket_price?: number
    participants?: number
    created_at: string
  }
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.datetime)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{format(eventDate, "MMM d, yyyy • h:mm a")}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {event.participant_limit && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>
                {event.participants || 0} / {event.participant_limit}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/dashboard/events/${event.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
