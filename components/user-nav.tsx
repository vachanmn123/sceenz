"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useSupabase } from "@/utils/supabase/context";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export function UserNav() {
  const { supabase } = useSupabase();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    redirect("/");
  };

  if (isLoading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.user.identities?.[0]?.identity_data?.avatar_url}
              alt="User"
            />
            <AvatarFallback>
              {user?.user.user_metadata?.full_name
                ? user.user.user_metadata.full_name[0]
                : "JD"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.user.user_metadata?.full_name || "John Doe"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.user.user_metadata?.email || "john@doe.com"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup></DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
