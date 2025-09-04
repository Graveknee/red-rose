"use server";
import { prisma } from "@/lib/prisma";

interface GuildMember {
  name: string;
  level: number;
}

export async function getLevelsSinceLastFriday(guildName: string) {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (day >= 5 ? day - 5 : 7 - (5 - day));
  const lastFriday = new Date(now);
  lastFriday.setUTCDate(now.getUTCDate() - diff);
  lastFriday.setUTCHours(10, 0, 0, 0);

  const snapshot = await prisma.guildSnapShot.findFirst({
    where: {
      guildName,
      date: { lte: lastFriday },
    },
    orderBy: { date: "desc" },
  });

  if (!snapshot) throw new Error("No snapshot found for last Friday");
  
  const url = `https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`;
  console.log("Fetching guild data from:", url);

  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    console.error("Guild fetch failed:", res.status, text.slice(0, 200));
    throw new Error(`Failed to fetch current guild data: ${res.status}`);
  }

  const data = await res.json();

  const currentMembers: GuildMember[] = data.guild.members.map((m: GuildMember) => ({
    name: m.name,
    level: m.level,
  }));

  const levelsGained = currentMembers
  .map((member: GuildMember) => {
    const initial = (snapshot.members as unknown as GuildMember[]).find(
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