"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/utils/supabase/context";

interface DeleteEventDialogProps {
  eventId: string;
  eventTitle: string;
  variant?: "icon" | "button" | "menu-item";
  onDeleted?: () => void;
}

export function DeleteEventDialog({
  eventId,
  eventTitle,
  variant = "button",
  onDeleted,
}: DeleteEventDialogProps) {
  const { supabase } = useSupabase();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return;
      }
      setIsDeleting(true);

      const { error } = await supabase
        .from("Events")
        .delete()
        .eq("id", eventId)
        .eq("hostId", user.user.id);

      if (error) {
        console.error("Error deleting event:", error);
        return;
      }

      setOpen(false);

      if (onDeleted) {
        onDeleted();
      } else {
        // Navigate back to events list
        router.push("/dashboard/events");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderTrigger = () => {
    switch (variant) {
      case "icon":
        return (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      case "menu-item":
        return (
          <div className="flex items-center text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </div>
        );
      default:
        return (
          <Button variant="destructive" className="flex items-center gap-1">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{renderTrigger()}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{eventTitle}&quot;? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
