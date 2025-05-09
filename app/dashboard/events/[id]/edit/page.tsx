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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useSupabase } from "@/utils/supabase/context";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { supabase } = useSupabase();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    datetime: "",
    participant_limit: "",
    ticket_price: "",
  });

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return null;
      }
      const { data, error } = await supabase
        .from("Events")
        .select("*")
        .filter("id", "eq", id)
        .filter("hostId", "eq", user.user?.id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        location: event.location,
        datetime: format(new Date(event.dateTime), "yyyy-MM-dd'T'HH:mm"),
        participant_limit: event.participantLimit?.toString() || "",
        ticket_price: event.ticketPrice?.toString() || "",
      });
    }
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return;
      }

      const { error } = await supabase
        .from("Events")
        .update({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          dateTime: new Date(formData.datetime).toISOString(),
          participantLimit: formData.participant_limit
            ? parseInt(formData.participant_limit)
            : null,
          ticketPrice: formData.ticket_price
            ? parseFloat(formData.ticket_price)
            : null,
        })
        .eq("id", id)
        .eq("hostId", user.user.id);

      if (error) {
        throw error;
      }

      router.push(`/dashboard/events/${id}`);
    } catch (error) {
      console.error("Error updating event:", error);
      // Handle error (could add toast notification here)
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading event data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        Error loading event: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/events/${id}`}>
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
            <CardDescription>
              Update the information for your event
            </CardDescription>
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
                <Label htmlFor="participant_limit">
                  Participant Limit (Optional)
                </Label>
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
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push(`/dashboard/events/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
