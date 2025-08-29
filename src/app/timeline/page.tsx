"use client";

import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  details: string;
  image: string;
  category: string;
  type: "major" | "minor";
}

const timelineData: { [year: number]: TimelineEvent[] } = {
  1997: [
    {
      year: 1997,
      title: "Tibia launched",
      description: "Tibia, a massively multiplayer online role-playing game (MMORPG), was launched.",
      details:
        "Tibia was developed by CipSoft and quickly gained popularity for its immersive gameplay and large player community.",
      image: "/",
      category: "Tibia",
      type: "major",
    },
  ],
  1998: [
    {
      year: 1998,
      title: "I was 8 years old",
      description: "Big boy pants",
      details:
        "I remember feeling so grown up when I got my first pair of big boy pants.",
      image: "/public/Red_Rose.gif",
      category: "Red Rose",
      type: "major",
    },
    // ...add other events here
  ],
};

export default function TimelinePage() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const router = useRouter();

  const sortedYears = Object.keys(timelineData).map(Number).sort((a, b) => a - b);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated background elements (same as roster page) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 px-8 py-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="group flex items-center gap-2 bg-white/80 hover:bg-white backdrop-blur-sm border border-rose-100/50 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <ArrowLeft className="h-5 w-5 text-rose-600 group-hover:text-rose-700 transition-colors" />
                <span className="text-rose-600 group-hover:text-rose-700 font-medium transition-colors">
                  Back
                </span>
              </button>

              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-black bg-gradient-to-r from-rose-600 via-rose-800 to-pink-600 bg-clip-text text-transparent mb-6 pb-2 leading-[1.1]">
                  Interactive Timeline
                </h1>
                <div className="h-1 w-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-rose-200"></div>

            {/* Timeline Events */}
            <div className="space-y-16">
              {sortedYears.map((year) => {
                const yearEvents = timelineData[year];
                return (
                  <div key={year} className="relative">
                    {/* Year Header */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="bg-rose-100 text-rose-800 px-6 py-3 rounded-full font-black text-2xl shadow-lg">
                        {year}
                      </div>
                    </div>

                    {/* Events for the year */}
                    <div className="space-y-6">
                      {yearEvents.map((event, index) => (
                        <div
                          key={`${year}-${// biome-ignore lint/suspicious/noArrayIndexKey: <nah>
                          index}`}
                          className={`relative flex items-center ${
                            index % 2 === 0 ? "justify-start" : "justify-end"
                          }`}
                        >
                          {/* Timeline Dot */}
                          <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                            <button
                              type="button"
                              onClick={() => setSelectedEvent(event)}
                              className={`${
                                event.type === "major" ? "w-6 h-6" : "w-4 h-4"
                              } bg-rose-500 hover:bg-rose-600 rounded-full border-2 border-white shadow-md transition-all duration-300 hover:scale-125`}
                            />
                          </div>

                          {/* Event Card */}
                          <div className={`w-5/12 ${index % 2 === 0 ? "mr-auto pr-8" : "ml-auto pl-8"}`}>
                            <Card
                              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white/80 backdrop-blur-sm ${
                                event.type === "minor" ? "opacity-75 hover:opacity-100" : ""
                              }`}
                              onClick={() => setSelectedEvent(event)}
                            >
                              {event.type === "major" && (
                                  <div
                                    className="relative overflow-hidden rounded-t-lg h-48"
                                    style={{
                                      backgroundImage: `url(${event.image || "/placeholder.svg"})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                    }}
                                    role="img"
                                    aria-label={event.title}>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                  <div className="absolute bottom-4 left-4">
                                    <span className="bg-rose-500 text-white px-3 py-1 rounded-full font-medium text-sm">
                                      {event.category}
                                    </span>
                                  </div>
                                </div>
                              )}
                              <CardHeader className={event.type === "minor" ? "py-1" : ""}>
                                {event.type === "minor" && (
                                  <div className="mb-2">
                                    <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                                      {event.category}
                                    </span>
                                  </div>
                                )}
                                <CardTitle className={`font-serif font-bold ${event.type === "major" ? "text-xl" : "text-lg"}`}>
                                  {event.title}
                                </CardTitle>
                                <CardDescription className={`text-gray-700 ${event.type === "minor" ? "text-sm" : ""}`}>
                                  {event.description}
                                </CardDescription>
                              </CardHeader>
                              {event.type === "major" && (
                                <CardContent>
                                  <p className="text-gray-900 leading-relaxed">{event.details}</p>
                                </CardContent>
                              )}
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Event Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <div
                  className="w-full h-64 object-cover rounded-t-lg relative"
                  style={{
                    backgroundImage: `url(${selectedEvent.image || "/placeholder.svg"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  role="img"
                  aria-label={selectedEvent.title}
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {selectedEvent.category}
                  </span>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-2xl font-black">{selectedEvent.title}</CardTitle>
                  <span className="text-3xl font-black text-rose-600">{selectedEvent.year}</span>
                </div>
                <CardDescription className="text-lg">{selectedEvent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 leading-relaxed">{selectedEvent.details}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
