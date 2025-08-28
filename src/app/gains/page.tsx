"use client";

import LevelsSinceFriday from "@/components/levels-since-last-friday";

export default function GainsPage() {
  return (
    <div className="p-6">
      <LevelsSinceFriday guildName="Red Rose"/>
    </div>
  );
}