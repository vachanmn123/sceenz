import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EventCard } from "@/components/event-card"
import { StatsCard } from "@/components/stats-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Mock data for UI demonstration
  const upcomingEvents = [
    {
      id: "1",
      title: "Tech Conference 2024",
      description: "Annual technology conference with industry leaders",
      location: "San Francisco, CA",
      datetime: "2024-08-15T09:00:00",
      participant_limit: 500,
      ticket_price: 99.99,
      participants: 245,
      created_at: "2024-01-15T12:00:00",
    },
    {
      id: "2",
      title: "Product Launch",
      description: "Launching our new product line with demos and networking",
      location: "New York, NY",
      datetime: "2024-07-22T18:30:00",
      participant_limit: 200,
      ticket_price: 0,
      participants: 150,
      created_at: "2024-02-10T15:30:00",
    },
    {
      id: "3",
      title: "Annual Charity Gala",
      description: "Fundraising event with dinner and entertainment",
      location: "Chicago, IL",
      datetime: "2024-09-05T19:00:00",
      participant_limit: 300,
      ticket_price: 150,
      participants: 120,
      created_at: "2024-03-01T09:15:00",
    },
  ]

  const stats = [
    { title: "Total Events", value: "12" },
    { title: "Total Participants", value: "1,234" },
    { title: "Upcoming Events", value: "5" },
    { title: "Revenue", value: "$12,345" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/events/add">
          <Button className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} title={stat.title} value={stat.value} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your next events that are scheduled</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
