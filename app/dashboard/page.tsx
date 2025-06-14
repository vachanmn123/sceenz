import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EventCard } from "@/components/event-card";
import { StatsCard } from "@/components/stats-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  console.log("user", user);
  if (!user.user) {
    return <div>Please log in to view your dashboard.</div>;
  }
  const { data: events, error } = await supabase
    .from("Events")
    .select("*")
    .filter("hostId", "eq", user.user.id)
    .filter("dateTime", "gte", new Date().toISOString())
    .order("dateTime", { ascending: true });

  const { count: totalEvents } = await supabase
    .from("Events")
    .select("id", { count: "exact", head: true })
    .filter("hostId", "eq", user.user.id);

  console.log("totalEvents", totalEvents);

  const { count: totalParticipants } = await supabase
    .from("Tickets")
    .select("*", { count: "exact", head: true })
    .filter("eventId", "in", `(${events?.map((e) => e.id).join(",")})`);

  if (error) {
    console.error("Error fetching events:", error);
    return <div>Error loading events</div>;
  }

  const stats = [
    { title: "Total Events", value: totalEvents ?? 0 },
    {
      title: "Total Participants in upcoming events",
      value: totalParticipants ?? 0,
    },
    { title: "Upcoming Events", value: events.length ?? 0 },
  ];

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
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value.toString()}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>All your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
