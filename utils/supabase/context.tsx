"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "./client";

type SupabaseContext = {
  supabase: SupabaseClient;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export interface SupabaseProviderProps {
  children: ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabase] = useState(() => createClient());

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
}

export function useSupabase() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }
  return context;
}
