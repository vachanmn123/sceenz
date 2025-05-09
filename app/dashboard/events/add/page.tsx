"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSupabase } from "@/utils/supabase/context";

export default function AddEventPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    dateTime: "",
    participantLimit: "",
    ticketPrice: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log({ name, value });
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("You must be logged in to create an event.");
        return;
      }

      const { error } = await supabase.from("Events").insert([
        {
          ...formData,
          hostId: user.id,
          participantLimit: parseInt(formData.participantLimit) || null,
          ticketPrice: parseFloat(formData.ticketPrice) || null,
        },
      ]);

      if (error) {
        console.error("Error creating event:", error);
        setError("Failed to create event. Please try again.");
        return;
      }

      // Redirect to events page
      router.push("/dashboard/events");
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Add New Event</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Fill in the information below to create a new event
            </CardDescription>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
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
                name="dateTime"
                type="datetime-local"
                // value={formData.dateTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="participant_limit">
                  Participant Limit (Optional)
                </Label>
                <Input
                  id="participant_limit"
                  name="participantLimit"
                  type="number"
                  placeholder="Maximum number of participants"
                  value={formData.participantLimit}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticket_price">Ticket Price (Optional)</Label>
                <Input
                  id="ticket_price"
                  name="ticketPrice"
                  type="number"
                  placeholder="Price per ticket"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/dashboard/events")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
