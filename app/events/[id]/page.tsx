"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RegisterModal } from "./register-modal";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useSupabase } from "@/utils/supabase/context";

// Define the Event type based on the schema
interface Event {
  id: number;
  created_at: string;
  title: string;
  description: string;
  location: string;
  dateTime: string;
  participantLimit: number;
  ticketPrice: number | null;
  hostId: string;
  coordinates: string;
}

// Dynamic import for the map to avoid SSR issues
const Map = dynamic(() => import("./map"), {
  loading: () => (
    <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
      Loading map...
    </div>
  ),
  ssr: false,
});

export default function EventDetailsPage() {
  const { supabase } = useSupabase();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Fetch event data
    const fetchEvent = async () => {
      try {
        const { data: event } = await supabase
          .from("Events")
          .select("*")
          .eq("id", id)
          .single();

        if (!event) {
          setEvent(null);
          return;
        }

        setEvent(event);

        // Parse coordinates if available
        if (event.coordinates) {
          const [lat, lng] = event.coordinates.split(",").map(parseFloat);
          console.log("Parsed coordinates:", lat, lng);
          setCoordinates([lat, lng]);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, supabase]);

  const handleRegister = () => {
    setShowModal(true);
  };

  const handleRegistrationComplete = async (name: string, email: string) => {
    setShowModal(false);

    // If there's a ticket price, redirect to payment
    if (event?.ticketPrice) {
      // This would be replaced with your actual payment redirect
      alert(`Redirecting to payment for ${name} (${email})`);
      // window.location.href = `/payment/${id}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    } else {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        alert("You must be logged in to register for this event.");
        return;
      }

      const { error } = await supabase.from("Tickets").insert({
        buyer: user.user.id,
        event: id,
        name,
        email,
      });

      if (error) {
        console.error("Error registering for event:", error);
        alert("Failed to register for the event. Please try again.");
      }

      alert("Successfully registered for the event!");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-[300px] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
            <CardDescription>
              The event you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">{event.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              {event.dateTime
                ? format(new Date(event.dateTime), "PPP p")
                : "Date not specified"}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 z-10">
          {coordinates ? (
            <Map coordinates={coordinates} location={event.location} />
          ) : (
            <div className="h-[300px] w-full bg-muted rounded-md flex items-center justify-center">
              <MapPin className="h-6 w-6 mr-2" />{" "}
              {event.location || "Location not specified"}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">About this event</h3>
              <p className="text-muted-foreground">{event.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-muted-foreground" />
                <span>
                  {event.participantLimit
                    ? `Limited to ${event.participantLimit} participants`
                    : "Unlimited participants"}
                </span>
              </div>

              {event.ticketPrice !== null && (
                <div className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>
                    {event.ticketPrice > 0
                      ? `INR ${event.ticketPrice}`
                      : "Free"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRegister} className="w-full md:w-auto">
            I&apos;m Interested
          </Button>
        </CardFooter>
      </Card>

      {showModal && (
        <RegisterModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleRegistrationComplete}
          hasTicketPrice={!!event.ticketPrice}
        />
      )}
    </div>
  );
}
