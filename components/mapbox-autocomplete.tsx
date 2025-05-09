"use client";

import type React from "react";
import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidmFjaGFubW4xMjMiLCJhIjoiY21hZ3Rpa3lnMDRrNjJtb2R6c21nNnpqZiJ9.2kMYIjLIHohtuIOOSLP3nw";

interface MapboxLocation {
  id: string;
  address: string;
  coordinates: [number, number];
}

interface MapboxAutocompleteProps {
  onSelect: (location: MapboxLocation) => void;
  placeholder?: string;
  className?: string;
}

export default function MapboxAutocomplete({
  onSelect,
  placeholder = "Search for a location...",
  className,
}: MapboxAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    {
      id: string;
      place_name: string;
      center: [number, number];
      text: string;
      properties: Record<string, unknown>;
      relevance: number;
      type: string;
      place_type: string[];
      context: Array<{
        id: string;
        text: string;
        short_code?: string;
        wikidata?: string;
        language?: string;
        country?: string;
        region?: string;
        city?: string;
        neighborhood?: string;
      }>;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=5`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (feature: {
    id: string;
    place_name: string;
    center: [number, number];
  }) => {
    setQuery(feature.place_name);
    setSuggestions([]);
    onSelect({
      id: feature.id,
      address: feature.place_name,
      coordinates: feature.center,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard navigation
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
          aria-label="Search location"
          aria-autocomplete="list"
          aria-controls={
            suggestions.length > 0 ? "location-suggestions" : undefined
          }
          aria-activedescendant={
            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
          }
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {suggestions.length > 0 && (
        <ul
          id="location-suggestions"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg"
          role="listbox"
        >
          {suggestions.map((feature, index) => (
            <li
              key={feature.id}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                "flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted",
                index === activeIndex && "bg-muted"
              )}
              onClick={() => handleSelect(feature)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">{feature.text}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {feature.place_name}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
