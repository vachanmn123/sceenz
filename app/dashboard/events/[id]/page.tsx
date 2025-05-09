"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Loader2,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { QRCode } from "@/components/qr-code";
import { ShareEvent } from "@/components/share-event";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DeleteEventDialog } from "@/components/delete-event-dialog";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "@/utils/supabase/context";
import { use } from "react";

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { supabase } = useSupabase();
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return [];
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

  const { data: participants, isLoading: loadingParticipants } = useQuery({
    queryKey: ["participants", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Tickets")
        .select("id, name, email")
        .filter("event", "eq", id);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  const eventUrl = `${window.location.origin}/events/${event?.id}`;
  const eventDate = new Date(event?.dateTime);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading event: {error.message}</div>;
  }

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
          <TabsTrigger value="participants">Participants</TabsTrigger>
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
                  <p>
                    {event.ticket_price
                      ? `$${event.ticketPrice.toFixed(2)}`
                      : "Free"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Participants</h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.participants} / {event.participantLimit ?? "∞"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Status</h3>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-50"
                  >
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
                <CardDescription>
                  Scan this QR code to access the event
                </CardDescription>
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

        <TabsContent value="participants" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  View and manage participants for this event
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!participants?.length) return;
                    const csvData = participants.map((participant) => ({
                      Name: participant.name,
                      Email: participant.email,
                    }));
                    const csvContent =
                      "data:text/csv;charset=utf-8," +
                      "Name,Email\n" +
                      csvData
                        .map((row) => Object.values(row).join(","))
                        .join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "participants.csv");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingParticipants ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
                </div>
              ) : participants?.length ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted/50">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Name</div>
                    <div className="col-span-5">Email</div>
                  </div>
                  <div className="divide-y">
                    {participants?.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-muted/50"
                      >
                        <div className="col-span-1 text-muted-foreground">
                          {index + 1}
                        </div>
                        <div className="col-span-5 font-medium">
                          {participant.name}
                        </div>
                        <div className="col-span-5 text-muted-foreground">
                          {participant.email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/10">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No participants have registered yet.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Share Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
