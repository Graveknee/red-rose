"use server";
import { prisma } from "@/lib/prisma";

interface GuildMember {
  name: string;
  level: number;
}

export interface WeekOption {
  value: string;
  label: string;
  startDate: Date;
  endDate: Date;
}

export async function getAvailableWeeks(guildName: string): Promise<WeekOption[]> {
  const snapshots = await prisma.guildSnapShot.findMany({
    where: { guildName },
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (snapshots.length < 2) return [];

  const weeks: WeekOption[] = [];
  
  for (let i = 1; i < snapshots.length; i++) {
    const endSnapshot = snapshots[i - 1];
    const startSnapshot = snapshots[i];
    
    const endFriday = getLastFriday(endSnapshot.date);
    const startFriday = getLastFriday(startSnapshot.date);
    
    const daysDiff = Math.floor((endFriday.getTime() - startFriday.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 6) {
      const weekStart = new Date(startFriday);
      const weekEnd = new Date(startFriday);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekValue = `${startFriday.toISOString().split('T')[0]}`;
      const weekLabel = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
      
      weeks.push({
        value: weekValue,
        label: weekLabel,
        startDate: weekStart,
        endDate: weekEnd,
      });
    }
  }

  return weeks;
}

function getLastFriday(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = (day >= 5 ? day - 5 : 7 - (5 - day));
  d.setUTCDate(d.getUTCDate() - diff);
  d.setUTCHours(10, 0, 0, 0);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

export async function getLevelsSinceLastFriday(guildName: string, weekStartDate?: string) {
  let startFriday: Date;
  let endFriday: Date;

  if (weekStartDate) {
    startFriday = new Date(weekStartDate + 'T10:00:00.000Z');
    endFriday = new Date(startFriday);
    endFriday.setDate(endFriday.getDate() + 7);
  } else {
    const now = new Date();
    const day = now.getUTCDay();
    const diff = (day >= 5 ? day - 5 : 7 - (5 - day));
    startFriday = new Date(now);
    startFriday.setUTCDate(now.getUTCDate() - diff);
    startFriday.setUTCHours(10, 0, 0, 0);
    endFriday = new Date(); 
  }

  const startSnapshot = await prisma.guildSnapShot.findFirst({
    where: {
      guildName,
      date: { lte: startFriday },
    },
    orderBy: { date: "desc" },
  });

  if (!startSnapshot) {
    throw new Error(`No snapshot found for ${startFriday.toISOString()}`);
  }

  let endMembers: GuildMember[];

  if (weekStartDate) {
    // Historical week - use snapshot
    const endSnapshot = await prisma.guildSnapShot.findFirst({
      where: {
        guildName,
        date: {
          gte: startFriday,
          lte: endFriday,
        },
      },
      orderBy: { date: "desc" },
    });

    if (!endSnapshot) {
      throw new Error(`No end snapshot found for week ending ${endFriday.toISOString()}`);
    }

    endMembers = endSnapshot.members as unknown as GuildMember[];
  } else {
    // Current week - fetch live data
    const url = `https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`;
    console.log("Fetching current guild data from:", url);

    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("Guild fetch failed:", res.status, text.slice(0, 200));
      throw new Error(`Failed to fetch current guild data: ${res.status}`);
    }

    const data = await res.json();
    endMembers = data.guild.members.map((m: GuildMember) => ({
      name: m.name,
      level: m.level,
    }));
  }

  const startMembers = startSnapshot.members as unknown as GuildMember[];

  const levelsGained = endMembers
    .map((member: GuildMember) => {
      const initial = startMembers.find(
        (m) => m.name.toLowerCase() === member.name.toLowerCase()
      );

      if (!initial) return null;

      return {
        name: member.name,
        levelsGained: member.level - initial.level,
      };
    })
    .filter((m): m is { name: string; levelsGained: number } => m !== null)
    .filter((m) => m.levelsGained !== 0)
    .sort((a, b) => b.levelsGained - a.levelsGained);

  return levelsGained;
}