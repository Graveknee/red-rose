"use server";
import { prisma } from "@/lib/prisma";

export async function takeSnapshot(guildName: string) {
  const res = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`);
  if (!res.ok) throw new Error("Failed to fetch guild data");
  const data = await res.json();

  const members = data.guild.members.map((m: any) => ({
    name: m.name,
    level: m.level,
  }));

  return prisma.guildSnapShot.create({
    data: { guildName, members },
  });
}
