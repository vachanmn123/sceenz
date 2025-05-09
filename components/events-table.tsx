"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Share2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { DeleteEventDialog } from "@/components/delete-event-dialog"

interface Event {
  id: string
  title: string
  description: string
  location: string
  datetime: string
  participant_limit?: number
  ticket_price?: number
  participants?: number
  created_at: string
}

interface EventsTableProps {
  events: Event[]
}

export function EventsTable({ events }: EventsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden md:table-cell">Participants</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">
                <Link href={`/dashboard/events/${event.id}`} className="hover:underline">
                  {event.title}
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">{format(new Date(event.datetime), "MMM d, yyyy")}</TableCell>
              <TableCell className="hidden md:table-cell">{event.location.split(",")[0]}</TableCell>
              <TableCell className="hidden md:table-cell">
                {event.participants || 0} / {event.participant_limit || "∞"}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {event.ticket_price ? (
                  `$${event.ticket_price.toFixed(2)}`
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Free
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/events/${event.id}`} className="flex w-full items-center">
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/dashboard/events/${event.id}/edit`} className="flex w-full items-center">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <DeleteEventDialog eventId={event.id} eventTitle={event.title} variant="menu-item" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
