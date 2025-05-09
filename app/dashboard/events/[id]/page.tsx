"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, MapPin, Share2, Users } from "lucide-react"
import Link from "next/link"
import { QRCode } from "@/components/qr-code"
import { ShareEvent } from "@/components/share-event"
import { EventStats } from "@/components/event-stats"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { DeleteEventDialog } from "@/components/delete-event-dialog"

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  // Mock data for UI demonstration
  const event = {
    id: params.id,
    title: "Tech Conference 2024",
    description:
      "Annual technology conference with industry leaders. Join us for a day of inspiring talks, workshops, and networking opportunities. Learn about the latest trends in technology and connect with professionals in your field.",
    location: "San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103",
    datetime: "2024-08-15T09:00:00",
    participant_limit: 500,
    ticket_price: 99.99,
    participants: 245,
    created_at: "2024-01-15T12:00:00",
  }

  const eventUrl = `https://eventmanager.app/events/${event.id}`
  const eventDate = new Date(event.datetime)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/events">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{event.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/events/${event.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteEventDialog eventId={event.id} eventTitle={event.title} />
          <Button className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Description</h3>
                <p>{event.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Date & Time</h3>
                    <p>{format(eventDate, "EEEE, MMMM d, yyyy")}</p>
                    <p>{format(eventDate, "h:mm a")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p>{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold">Ticket Price</h3>
                  <p>{event.ticket_price ? `$${event.ticket_price.toFixed(2)}` : "Free"}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Participants</h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.participants} / {event.participant_limit}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Status</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>Scan this QR code to access the event</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <QRCode value={eventUrl} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share Event</CardTitle>
                <CardDescription>Share this event with others</CardDescription>
              </CardHeader>
              <CardContent>
                <ShareEvent eventUrl={eventUrl} eventTitle={event.title} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <EventStats eventId={event.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
