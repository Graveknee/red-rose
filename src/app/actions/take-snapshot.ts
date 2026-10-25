"use server";
import { prisma } from "@/lib/prisma";

type GuildMember = {
  name: string;
  level: number;
};

export async function takeSnapshot(guildName: string) {
  const res = await fetch(`https://api.tibiadata.com/v5/guild/${encodeURIComponent(guildName)}`);
  if (!res.ok) throw new Error(`Failed to fetch guild data: ${res.status}`);
  const data = await res.json();

  const members: GuildMember[] = data.guild.members.map((m: GuildMember) => ({
    name: m.name,
    level: m.level,
  }));

  return prisma.guildSnapShot.create({
    data: { guildName, members },
  });
}
