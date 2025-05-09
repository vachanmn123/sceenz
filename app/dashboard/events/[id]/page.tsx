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
  Star,
  Download,
  MessageSquare,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

  const { data: reviews, isLoading: loadingReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Ratings")
        .select("id, stars, review")
        .filter("event", "eq", id);

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });

  const eventUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/events/${event?.id}`
      : "";
  const eventDate = event?.dateTime ? new Date(event.dateTime) : new Date();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error.message} />;
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/events">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 bg-muted/50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {event.title}
          </h1>
          <Badge variant="outline" className={`ml-5 ${getStatusColor(event)}`}>
            {getEventStatus(event)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Link href={`/dashboard/events/${event.id}/edit`}>
            <Button
              variant="outline"
              className="flex items-center gap-1 h-9 rounded-lg"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          </Link>
          <DeleteEventDialog eventId={event.id} eventTitle={event.title} />
          <Button className="flex items-center gap-1 h-9 rounded-lg">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 rounded-lg">
          <TabsTrigger value="details" className="rounded-l-lg">
            Details
          </TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-r-lg">
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="details"
          className="space-y-6 animate-in fade-in-50"
        >
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-b">
              <CardTitle className="text-xl">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-2.5 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Date & Time</h3>
                    <p className="text-muted-foreground">
                      {format(eventDate, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-muted-foreground">
                      {format(eventDate, "h:mm a")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2.5 rounded-full">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Location</h3>
                    <p className="text-muted-foreground">{event.location}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-base mb-1">Ticket Price</h3>
                  <p className="text-2xl font-bold text-primary">
                    {event.ticketPrice
                      ? `$${Number.parseFloat(event.ticketPrice).toFixed(2)}`
                      : "Free"}
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-base mb-1">Participants</h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {event.participants || 0} /{" "}
                      {event.participantLimit ?? "∞"}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-semibold text-base mb-1">Status</h3>
                  <Badge
                    variant="outline"
                    className={`text-sm px-3 py-1 ${getStatusColor(event)}`}
                  >
                    {getEventStatus(event)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="animate-in fade-in-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-b">
                <CardTitle className="text-xl">QR Code</CardTitle>
                <CardDescription>
                  Scan this QR code to access the event
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-8">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <QRCode value={eventUrl} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 border-b">
                <CardTitle className="text-xl">Share Event</CardTitle>
                <CardDescription>Share this event with others</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ShareEvent eventUrl={eventUrl} eventTitle={event.title} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="participants" className="animate-in fade-in-50">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border-b">
              <div>
                <CardTitle className="text-xl">Participants</CardTitle>
                <CardDescription>
                  View and manage participants for this event
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1"
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
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingParticipants ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-primary/50" />
                </div>
              ) : participants?.length ? (
                <div className="rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-muted/50">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Name</div>
                    <div className="col-span-6">Email</div>
                  </div>
                  <div className="divide-y">
                    {participants?.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="grid grid-cols-12 gap-2 p-4 items-center hover:bg-muted/30 transition-colors"
                      >
                        <div className="col-span-1 text-muted-foreground">
                          {index + 1}
                        </div>
                        <div className="col-span-5 font-medium flex items-center gap-2">
                          <Avatar className="h-8 w-8 bg-primary/10">
                            <AvatarFallback className="text-xs text-primary">
                              {getInitials(participant.name)}
                            </AvatarFallback>
                          </Avatar>
                          {participant.name}
                        </div>
                        <div className="col-span-6 text-muted-foreground">
                          {participant.email}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="bg-muted/30 inline-flex p-4 rounded-full mb-4">
                    <Users className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No participants yet
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    No participants have registered for this event yet. Share
                    your event to get people to sign up.
                  </p>
                  <Button variant="default" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="animate-in fade-in-50">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 border-b">
              <CardTitle className="text-xl">Reviews</CardTitle>
              <CardDescription>
                View feedback from event participants
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5">
              {loadingReviews ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin h-8 w-8 text-primary/50" />
                </div>
              ) : reviews?.length ? (
                <div className="divide-y p-5">
                  {reviews?.map((review, index) => (
                    <div
                      key={review.id}
                      className="p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 bg-amber-100">
                            <AvatarFallback className="text-xs text-amber-600">
                              {index + 1}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex items-center">
                            {Array.from({ length: review.stars }).map(
                              (_, i) => (
                                <Star
                                  key={i}
                                  color="oklch(76.9% 0.188 70.08)"
                                  fill="oklch(76.9% 0.188 70.08)"
                                  className="h-4 w-4 text-amber-500 fill-amber-500"
                                />
                              )
                            )}
                          </div>
                        </div>
                        {review.review && (
                          <div className="ml-10 pl-2 border-l-2 border-muted mt-2">
                            <p className="text-muted-foreground italic">
                              &quot;{review.review}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="bg-muted/30 inline-flex p-4 rounded-full mb-4">
                    <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    No reviews have been submitted for this event yet. Reviews
                    will appear here after participants submit their feedback.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: string }) {
  return (
    <div className="container mx-auto py-12 px-4 max-w-md">
      <Card className="border-red-200 shadow-md">
        <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b border-red-200">
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
            <div className="bg-red-100 dark:bg-red-900/40 p-1.5 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-600 dark:text-red-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            Error Loading Event
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/dashboard/events">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Events
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function getEventStatus(event: { dateTime: string }) {
  const now = new Date();
  const eventDate = new Date(event.dateTime);

  if (eventDate < now) {
    return "Completed";
  }

  return "Active";
}

function getStatusColor(event: unknown) {
  // @ts-expect-error - Its fine
  const status = getEventStatus(event);

  switch (status) {
    case "Active":
      return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    case "Completed":
      return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
