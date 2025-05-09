"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef } from "react"

interface EventStatsProps {
  eventId: string
}

export function EventStats({ eventId }: EventStatsProps) {
  const registrationsChartRef = useRef<HTMLCanvasElement>(null)
  const trafficSourcesChartRef = useRef<HTMLCanvasElement>(null)
  const attendeeLocationChartRef = useRef<HTMLCanvasElement>(null)

  // Mock data for UI demonstration
  const stats = {
    totalViews: 1245,
    registrations: 245,
    conversionRate: "19.7%",
    shareClicks: 87,
  }

  useEffect(() => {
    // In a real app, you would use a charting library like Chart.js
    // This is just a placeholder to show the UI

    // Registrations chart
    if (registrationsChartRef.current) {
      const ctx = registrationsChartRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, 500, 200)

        // Draw axes
        ctx.beginPath()
        ctx.moveTo(40, 20)
        ctx.lineTo(40, 180)
        ctx.lineTo(480, 180)
        ctx.strokeStyle = "#e2e8f0"
        ctx.stroke()

        // Draw data
        const data = [25, 40, 35, 60, 75, 90, 110, 95, 120, 140, 130, 150]
        const maxData = Math.max(...data)
        const dataPoints = data.map((value, index) => ({
          x: 40 + index * 35 + 20,
          y: 180 - (value / maxData) * 150,
        }))

        // Draw line
        ctx.beginPath()
        ctx.moveTo(dataPoints[0].x, dataPoints[0].y)
        for (let i = 1; i < dataPoints.length; i++) {
          ctx.lineTo(dataPoints[i].x, dataPoints[i].y)
        }
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw points
        dataPoints.forEach((point) => {
          ctx.beginPath()
          ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
          ctx.fillStyle = "#3b82f6"
          ctx.fill()
        })

        // Draw area under the line
        ctx.beginPath()
        ctx.moveTo(dataPoints[0].x, dataPoints[0].y)
        for (let i = 1; i < dataPoints.length; i++) {
          ctx.lineTo(dataPoints[i].x, dataPoints[i].y)
        }
        ctx.lineTo(dataPoints[dataPoints.length - 1].x, 180)
        ctx.lineTo(dataPoints[0].x, 180)
        ctx.closePath()
        ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
        ctx.fill()
      }
    }

    // Traffic sources chart
    if (trafficSourcesChartRef.current) {
      const ctx = trafficSourcesChartRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, 300, 300)

        const data = [
          { label: "Direct", value: 45, color: "#3b82f6" },
          { label: "Social", value: 30, color: "#10b981" },
          { label: "Email", value: 15, color: "#f59e0b" },
          { label: "Referral", value: 10, color: "#ef4444" },
        ]

        const total = data.reduce((sum, item) => sum + item.value, 0)
        let startAngle = 0

        data.forEach((item) => {
          const sliceAngle = (item.value / total) * 2 * Math.PI

          ctx.beginPath()
          ctx.moveTo(150, 150)
          ctx.arc(150, 150, 100, startAngle, startAngle + sliceAngle)
          ctx.closePath()
          ctx.fillStyle = item.color
          ctx.fill()

          startAngle += sliceAngle
        })

        // Draw legend
        let legendY = 20
        data.forEach((item) => {
          ctx.fillStyle = item.color
          ctx.fillRect(220, legendY, 15, 15)

          ctx.fillStyle = "#000"
          ctx.font = "12px Arial"
          ctx.fillText(`${item.label} (${item.value}%)`, 240, legendY + 12)

          legendY += 25
        })
      }
    }

    // Attendee location chart
    if (attendeeLocationChartRef.current) {
      const ctx = attendeeLocationChartRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, 500, 200)

        const data = [
          { label: "San Francisco", value: 120 },
          { label: "New York", value: 65 },
          { label: "Los Angeles", value: 40 },
          { label: "Chicago", value: 30 },
          { label: "Other", value: 45 },
        ]

        const maxValue = Math.max(...data.map((item) => item.value))
        const barWidth = 60
        const spacing = 30

        data.forEach((item, index) => {
          const barHeight = (item.value / maxValue) * 150
          const x = 60 + index * (barWidth + spacing)
          const y = 180 - barHeight

          // Draw bar
          ctx.fillStyle = "#3b82f6"
          ctx.fillRect(x, y, barWidth, barHeight)

          // Draw label
          ctx.fillStyle = "#000"
          ctx.font = "12px Arial"
          ctx.textAlign = "center"
          ctx.fillText(item.label, x + barWidth / 2, 195)

          // Draw value
          ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5)
        })
      }
    }
  }, [eventId])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registrations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Share Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shareClicks}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="registrations">
        <TabsList>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="location">Attendee Location</TabsTrigger>
        </TabsList>

        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Registration Trend</CardTitle>
              <CardDescription>Number of registrations over time</CardDescription>
            </CardHeader>
            <CardContent>
              <canvas ref={registrationsChartRef} width="500" height="200" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your attendees are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <canvas ref={trafficSourcesChartRef} width="300" height="300" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Attendee Locations</CardTitle>
              <CardDescription>Geographic distribution of attendees</CardDescription>
            </CardHeader>
            <CardContent>
              <canvas ref={attendeeLocationChartRef} width="500" height="200" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
