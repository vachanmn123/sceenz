"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { EventsTable } from "@/components/events-table";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { useSupabase } from "@/utils/supabase/context";
import { useQuery } from "@tanstack/react-query";

export default function EventsPage() {
  const { supabase } = useSupabase();

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return [];
      }
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .filter("Events.hostId", "eq", user.user?.id)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const success = searchParams.get("success");
    const action = searchParams.get("action");

    if (success === "true" && action) {
      setSuccessMessage(
        action === "create"
          ? "Event created successfully!"
          : action === "delete"
          ? "Event deleted successfully!"
          : "Operation completed successfully!"
      );
      setShowSuccess(true);

      // Hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

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
          <Input
            type="search"
            placeholder="Search events..."
            className="pl-8"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      {events && <EventsTable events={events} />}
    </div>
  );
}
