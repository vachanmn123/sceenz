# Sceenz

Sceenz is a modern event management platform built with Next.js and React. It allows users to discover, register for, and manage events, while providing hosts with analytics and management tools.

The Client-facing app is built using React Native and available at [Sceenz App](https://github.com/vachanmn123/sceenz-app)

## Features

- **Event Discovery:** Browse and search for upcoming events with detailed info cards.
- **Event Registration:** Register for events (with or without ticket price), including form validation and authentication.
- **Host Dashboard:** Manage your events, view registrations, and edit event details.
- **Event Analytics:** Visualize event stats such as registrations, traffic sources, and attendee locations.
- **Map Integration:** Interactive maps for event locations using Mapbox and Leaflet.
- **Social Sharing:** Share events via email, Twitter, Facebook, or copy a direct link.
- **QR Code Generation:** Downloadable QR codes for event check-in or sharing.
- **Authentication:** Google OAuth login via Supabase.
- **Responsive UI:** Built with custom UI components and Tailwind CSS for a modern look.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, SSR, dynamic imports)
- **UI:** [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **Database & Auth:** [Supabase](https://supabase.com/) (Postgres, Auth)
- **Maps:** [Mapbox](https://www.mapbox.com/), [Leaflet](https://leafletjs.com/)
- **Charts:** Custom canvas-based charts (placeholder for Chart.js or similar)
- **Icons:** [Lucide](https://lucide.dev/)
- **State/Data:** React hooks, [@tanstack/react-query](https://tanstack.com/query/latest)
- **Type Safety:** TypeScript throughout the codebase
- **Linting:** ESLint with Next.js and TypeScript configs

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Set up environment variables:**
   - Configure your Supabase credentials and Mapbox token in `.env.local`.

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) to view the app.**

## Project Structure

- `/app` – Next.js app directory (pages, routes, modals)
- `/components` – Reusable UI and feature components (event cards, tables, stats, etc.)
- `/lib` – Utility functions
- `/database.types.ts` – TypeScript types for Supabase tables

## License

MIT

---

*Built with ❤️ using Next.js, Supabase, and modern React.*