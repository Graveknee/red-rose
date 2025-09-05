"use client";

import { ArrowLeft, Award, ChevronDown, Copy, Medal, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLevelsSinceLastFriday } from "@/app/actions/get-levels-since-last-friday";

interface GainData {
  name: string;
  levelsGained: number;
}

export default function GainsPage() {
  const router = useRouter();
  const guildName = "Red Rose";

  const [data, setData] = useState<GainData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    getLevelsSinceLastFriday(guildName).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const sortedData = [...data].sort((a, b) => b.levelsGained - a.levelsGained);

  const groupedByLevels = sortedData.reduce((acc, member) => {
    if (!acc[member.levelsGained]) acc[member.levelsGained] = [];
    acc[member.levelsGained].push(member);
    return acc;
  }, {} as Record<number, GainData[]>);

  const uniqueLevels = Object.keys(groupedByLevels)
    .map(Number)
    .sort((a, b) => b - a);

  const podium = uniqueLevels.slice(0, 3).map((level, idx) => ({
    rank: idx + 1,
    members: groupedByLevels[level],
    level,
  }));

  const allGroups = uniqueLevels.map((level) => ({
    level,
    members: groupedByLevels[level],
  }));

  const getTrophyIcon = (rank: number, size: "small" | "large" = "small") => {
    const sizeClass = size === "small" ? "h-5 w-5" : "h-8 w-8";
    switch (rank) {
      case 1:
        return <Trophy className={`${sizeClass} text-yellow-500`} />;
      case 2:
        return <Medal className={`${sizeClass} text-gray-400`} />;
      case 3:
        return <Award className={`${sizeClass} text-amber-600`} />;
      default:
        return null;
    }
  };

  const getRankFromLevel = (level: number): number | null => {
    const podiumEntry = podium.find(p => p.level === level);
    return podiumEntry ? podiumEntry.rank : null;
  };

  const copyToClipboard = () => {
    let text = "Weekly Experience Leaderboard\n\n";

    // if (podium.length > 0) {
    //   text += "PODIUM FINISHERS\n";
    //   podium.forEach(({ rank, members, level }) => {
    //     const medal =
    //       rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";
    //     text += `${medal} (+${level} levels): ${members
    //       .map((m) => m.name)
    //       .join(", ")}\n`;
    //   });
    //   text += "\n";
    // }

    if (allGroups.length > 0) {
      text += "";
      allGroups.forEach(({ level, members }, groupIndex) => {
        text += `${groupIndex +1}. ${members.map((m) => m.name).join(", ")}: +${level} levels \n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-20 px-4 sm:px-8 py-12">
        {/* Header */}
        <div
          className="max-w-7xl mx-auto mb-8"
          style={{ transform: `translateY(${mousePosition.y * 0.05}px)` }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
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
                  Weekly Gains
                </h1>
                <div className="h-1 w-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-sm"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="appearance-none bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-2xl px-6 py-3 pr-10 shadow-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                >
                  <option value="current">Current Week</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-600 pointer-events-none" />
              </div>

              <button
                type="button"
                onClick={copyToClipboard}
                className="group flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Copy className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">
                  {copySuccess ? "Copied!" : "Copy Results"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-rose-300 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Trophy className="animate-bounce mx-auto h-12 w-12 text-rose-600 relative z-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Calculating Gains
              </h2>
              <p className="text-rose-600/80">
                Tallying up those sweet, sweet levels...
              </p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No Gains Recorded
              </h3>
              <p className="text-gray-500">
                Looks like it's been a quiet week for leveling!
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Compact Podium */}
            {podium.length > 0 && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-rose-100/50">
                <div className="text-center mb-4">
                  <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-1">
                    🏆 Top 3 This Week
                  </h2>
                </div>

                <div className="flex justify-center items-center gap-2 sm:gap-4">
                  {podium.map(({ rank, members, level }) => (
                    <div
                      key={rank}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className={`bg-white rounded-xl p-3 sm:p-4 shadow-md border transform hover:scale-105 transition-all duration-300 ${
                          rank === 1
                            ? "border-yellow-300 border-2"
                            : rank === 2
                            ? "border-gray-200"
                            : "border-amber-200"
                        }`}
                      >
                        <div className="mb-2 flex justify-center">
                          {getTrophyIcon(rank)}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 min-h-[2rem] flex items-center">
                          {members.length === 1 ? (
                            members[0].name
                          ) : (
                            `${members.length} tied`
                          )}
                        </div>
                        <div className="text-xs font-medium text-gray-600">
                          +{level} levels
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main List - All Members */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-100/50">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Weekly Leaderboard
                </h2>
                <p className="text-gray-600">
                  Everyone who leveled up this week
                </p>
              </div>

              <div className="space-y-3">
                {allGroups.map(({ level, members }) => {
                  const rank = getRankFromLevel(level);
                  const isPodium = rank !== null;
                  
                  return (
                    <div
                      key={level}
                      className={`rounded-2xl p-4 sm:p-6 border transition-all duration-200 hover:shadow-md ${
                        isPodium
                          ? rank === 1
                            ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
                            : rank === 2
                            ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                            : "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200"
                          : "bg-rose-50/50 border-rose-100/30"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-shrink-0 flex items-center gap-3">
                          {isPodium && rank !== null && (
                            <div className="flex items-center">
                              {getTrophyIcon(rank, "small")}
                            </div>
                          )}
                          <span className={`inline-block px-4 py-2 font-semibold rounded-full text-sm sm:text-base shadow-sm ${
                            isPodium
                              ? rank === 1
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900"
                                : rank === 2
                                ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
                                : "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900"
                              : "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                          }`}>
                            +{level} levels
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed">
                            {members.map((m) => m.name).join(", ")}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">
                          {members.length} {members.length === 1 ? "member" : "members"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}