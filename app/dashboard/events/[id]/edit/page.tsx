"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    datetime: "",
    participant_limit: "",
    ticket_price: "",
  })

  useEffect(() => {
    // In a real app, you would fetch the event data from your API
    // For now, we'll use mock data
    const mockEvent = {
      id: params.id,
      title: "Tech Conference 2024",
      description:
        "Annual technology conference with industry leaders. Join us for a day of inspiring talks, workshops, and networking opportunities.",
      location: "San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103",
      datetime: "2024-08-15T09:00:00",
      participant_limit: "500",
      ticket_price: "99.99",
      participants: 245,
      created_at: "2024-01-15T12:00:00",
    }

    // Format the date for the datetime-local input
    const eventDate = new Date(mockEvent.datetime)
    const formattedDate = format(eventDate, "yyyy-MM-dd'T'HH:mm")

    setFormData({
      title: mockEvent.title,
      description: mockEvent.description,
      location: mockEvent.location,
      datetime: formattedDate,
      participant_limit: mockEvent.participant_limit.toString(),
      ticket_price: mockEvent.ticket_price.toString(),
    })

    setLoading(false)
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle form submission here
    console.log("Form submitted:", formData)
    router.push(`/dashboard/events/${params.id}`)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading event data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/events/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Event</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Update the information for your event</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter event title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Event location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="datetime">Date and Time</Label>
              <Input
                id="datetime"
                name="datetime"
                type="datetime-local"
                value={formData.datetime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="participant_limit">Participant Limit (Optional)</Label>
                <Input
                  id="participant_limit"
                  name="participant_limit"
                  type="number"
                  placeholder="Maximum number of participants"
                  value={formData.participant_limit}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket_price">Ticket Price (Optional)</Label>
                <Input
                  id="ticket_price"
                  name="ticket_price"
                  type="number"
                  placeholder="Price per ticket"
                  value={formData.ticket_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.push(`/dashboard/events/${params.id}`)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
