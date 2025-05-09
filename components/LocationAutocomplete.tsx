"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NominatimLocation {
  id: string;
  address: string;
  displayName: string;
  coordinates: [number, number];
  addressDetails: Record<string, string | number>;
}

interface LocationAutocompleteProps {
  onSelect: (location: NominatimLocation) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationAutocomplete({
  onSelect,
  placeholder = "Search for a location...",
  className,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    {
      place_id: string;
      display_name: string;
      lat: string;
      lon: string;
      address: Record<string, string | number>;
      [key: string]: unknown; // Allow other properties
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Use Nominatim API instead of Mapbox
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&addressdetails=1&limit=5`,
        {
          headers: {
            // Add a user agent as per Nominatim usage policy
            "User-Agent": "LocationSearchApp",
          },
        }
      );
      const data = await res.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    // Debounce API calls to avoid hitting rate limits
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = (item: {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
    address: Record<string, string | number>;
  }) => {
    setQuery(item.display_name);
    setSuggestions([]);

    // Map Nominatim response to our expected format
    onSelect({
      id: item.place_id.toString(),
      address: item.display_name,
      displayName: item.display_name,
      coordinates: [Number.parseFloat(item.lat), Number.parseFloat(item.lon)],
      addressDetails: item.address || {},
    });
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setActiveIndex(-1);
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

  // Format the display address for better readability
  const formatAddress = (item: {
    name: string | number;
    place_id: string;
    display_name: string;
    address: Record<string, string | number>;
  }) => {
    const address = item.address || {};

    // Try to create a more readable primary text
    let primaryText =
      item.name ||
      address.road ||
      address.hamlet ||
      address.village ||
      address.town ||
      address.city ||
      address.county ||
      "";

    // If we couldn't extract a good primary text, use the first part of display_name
    if (!primaryText && item.display_name) {
      primaryText = item.display_name.split(",")[0];
    }

    return {
      primary: primaryText,
      secondary: item.display_name,
    };
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
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
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
          {suggestions.map((item, index) => {
            // @ts-expect-error - The types are not perfect
            const { primary, secondary } = formatAddress(item);
            return (
              <li
                key={item.place_id}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={cn(
                  "flex cursor-pointer items-start gap-2 px-4 py-2 text-sm transition-colors hover:bg-muted",
                  index === activeIndex && "bg-muted"
                )}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-medium">{primary}</span>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {secondary}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
