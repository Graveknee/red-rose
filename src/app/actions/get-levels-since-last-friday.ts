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
      (m) => m.name === member.name
    );
    const gained = initial ? member.level - initial.level : member.level;
    return { name: member.name, levelsGained: gained };
  })
  .filter((m) => m.levelsGained !== 0)
    .sort((a, b) => {
    if (a.levelsGained > 0 && b.levelsGained > 0) return b.levelsGained - a.levelsGained;
    if (a.levelsGained > 0) return -1;
    if (b.levelsGained > 0) return 1;
    return a.levelsGained - b.levelsGained;
  });

  return levelsGained;
}