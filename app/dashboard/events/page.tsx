"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { EventsTable } from "@/components/events-table"
import { Input } from "@/components/ui/input"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function EventsPage() {
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const success = searchParams.get("success")
    const action = searchParams.get("action")

    if (success === "true" && action) {
      setSuccessMessage(
        action === "create"
          ? "Event created successfully!"
          : action === "delete"
            ? "Event deleted successfully!"
            : "Operation completed successfully!",
      )
      setShowSuccess(true)

      // Hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Mock data for UI demonstration
  const events = [
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
    {
      id: "4",
      title: "Workshop: Future of AI",
      description: "Interactive workshop on artificial intelligence trends",
      location: "Austin, TX",
      datetime: "2024-10-12T10:00:00",
      participant_limit: 50,
      ticket_price: 75,
      participants: 35,
      created_at: "2024-03-15T14:20:00",
    },
    {
      id: "5",
      title: "Networking Mixer",
      description: "Casual networking event for professionals",
      location: "Seattle, WA",
      datetime: "2024-07-30T17:00:00",
      participant_limit: 100,
      ticket_price: 25,
      participants: 65,
      created_at: "2024-02-28T11:45:00",
    },
  ]

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Link href="/dashboard/events/add">
          <Button className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Event
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search events..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <EventsTable events={events} />
    </div>
  )
}
