// "use server";
// import { prisma } from "@/lib/prisma";

// function calculatePoints(levelDiff: number, initialLevel: number) {
//   const brackets = [
//     { max: 49, points: 1 },
//     { max: 124, points: 5 },
//     { max: 224, points: 15 },
//     { max: 349, points: 25 },
//     { max: 499, points: 40 },
//     { max: 674, points: 55 },
//     { max: 875, points: 75 },
//     { max: Infinity, points: 100 },
//   ];
//   let points = 0;
//   let level = initialLevel + 1;

//   for (let i = 0; i < levelDiff; i++, level++) {
//     const bracket = brackets.find((b) => level <= b.max);
//     points += bracket?.points ?? 0;
//   }
//   return points;
// }

// export async function getLeaderboard(guildName: string) {
//   const snapshot = await prisma.guildSnapshot.findFirst({
//     where: { guildName },
//     orderBy: { date: "desc" },
//   });

//   if (!snapshot) throw new Error("No snapshot found");

//   const res = await fetch(`https://api.tibiadata.com/v4/guild/${encodeURIComponent(guildName)}`);
//   const data = await res.json();
//   const currentMembers = data.guild.members.map((m: any) => ({ name: m.name, level: m.level }));

//   const leaderboard = currentMembers.map((member) => {
//     const initial = snapshot.members.find((m: any) => m.name === member.name);
//     const points = initial ? calculatePoints(member.level - initial.level, initial.level) : 0;
//     return { name: member.name, initialLevel: initial?.level ?? null, levelNow: member.level, points };
//   });

//   leaderboard.sort((a, b) => b.points - a.points);
//   return leaderboard.map((entry, index) => ({ ...entry, placement: index + 1 }));
// }
