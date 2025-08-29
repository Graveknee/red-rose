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
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [copySuccess, setCopySuccess] = useState(false);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    getLevelsSinceLastFriday(guildName).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  // Sort data by levels gained (descending)
  const sortedData = [...data].sort((a, b) => b.levelsGained - a.levelsGained);
  
  // Get top 3 for podium
  const topThree = sortedData.slice(0, 3);
  
  // Group remaining members by level gains
  const remainingMembers = sortedData.slice(3);
  const groupedMembers: { [key: number]: string[] } = {};
  
  remainingMembers.forEach(member => {
    if (member.levelsGained > 0) {
      if (!groupedMembers[member.levelsGained]) {
        groupedMembers[member.levelsGained] = [];
      }
      groupedMembers[member.levelsGained].push(member.name);
    }
  });

  // Sort groups by level gains (descending)
  const sortedGroups = Object.entries(groupedMembers)
    .sort(([a], [b]) => parseInt(b) - parseInt(a));

  const getTrophyIcon = (position: number) => {
    switch (position) {
      case 0: return <Trophy className="h-12 w-12 text-yellow-500" />;
      case 1: return <Medal className="h-10 w-10 text-gray-400" />;
      case 2: return <Award className="h-8 w-8 text-amber-600" />;
      default: return null;
    }
  };

  const getTrophyColor = (position: number) => {
    switch (position) {
      case 0: return "from-yellow-400 to-yellow-600";
      case 1: return "from-gray-300 to-gray-500";
      case 2: return "from-amber-500 to-amber-700";
      default: return "from-gray-300 to-gray-500";
    }
  };

  const copyToClipboard = () => {
    let text = "🏆 Guild Gains This Week 🏆\n\n";
    
    // Add podium winners
    if (topThree.length > 0) {
      text += "🥇 PODIUM FINISHERS 🥇\n";
      topThree.forEach((member, index) => {
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
        text += `${medal} ${member.name}: +${member.levelsGained} levels\n`;
      });
      text += "\n";
    }

    // Add grouped members
    if (sortedGroups.length > 0) {
      text += "OTHER GAMERS \n";
      sortedGroups.forEach(([levels, names]) => {
        text += `+${levels} levels: ${names.join(", ")}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 px-8 py-12">
        {/* Header */}
        <div 
          className="max-w-7xl mx-auto mb-12"
          style={{
            transform: `translateY(${mousePosition.y * 0.05}px)`
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Title section */}
            <div className="flex items-center gap-6">
              <button 
                type="button"
                onClick={() => router.push('/')}
                className="group flex items-center gap-2 bg-white/80 hover:bg-white backdrop-blur-sm border border-rose-100/50 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <ArrowLeft className="h-5 w-5 text-rose-600 group-hover:text-rose-700 transition-colors" />
                <span className="text-rose-600 group-hover:text-rose-700 font-medium transition-colors">Back</span>
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
              {/* Week Selector - Future feature */}
              <div className="relative">
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="appearance-none bg-white/80 backdrop-blur-sm border border-rose-100/50 rounded-2xl px-6 py-3 pr-10 shadow-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                >
                  <option value="current">Current Week</option>
                  {/* Future: Add previous weeks here */}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-rose-600 pointer-events-none" />
              </div>

              {/* Copy Button */}
              <button
                type="button"
                onClick={copyToClipboard}
                className="group flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Copy className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">
                  {copySuccess ? 'Copied!' : 'Copy Results'}
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Calculating Gains</h2>
              <p className="text-rose-600/80">Tallying up those sweet, sweet levels...</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Gains Recorded</h3>
              <p className="text-gray-500">Looks like it's been a quiet week for leveling!</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Trophy Podium for Top 3 */}
            {topThree.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-rose-100/50">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-2">
                    🏆 Champions Podium 🏆
                  </h2>
                  <p className="text-gray-600">This week's top performers</p>
                </div>
                
                <div className="flex justify-center items-end gap-8 mb-8">
                  {/* Rearrange for podium effect: 2nd, 1st, 3rd */}
                  {topThree.length > 1 && topThree[1] && (
                    <div className="flex flex-col items-center">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 transform hover:scale-105 transition-all duration-300">
                        <div className="text-center">
                          <div className="mb-4 flex justify-center">
                            {getTrophyIcon(1)}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{topThree[1].name}</h3>
                          <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${getTrophyColor(1)} shadow-md`}>
                            +{topThree[1].levelsGained} levels
                          </div>
                        </div>
                      </div>
                      <div className="w-24 h-16 bg-gradient-to-t from-gray-300 to-gray-200 mt-4 rounded-t-lg flex items-center justify-center">
                        <span className="font-bold text-gray-700">2nd</span>
                      </div>
                    </div>
                  )}
                  
                  {/* 1st place - tallest */}
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-2xl p-8 shadow-xl border-4 border-yellow-300 transform hover:scale-105 transition-all duration-300">
                      <div className="text-center">
                        <div className="mb-4 flex justify-center relative">
                          {getTrophyIcon(0)}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-800 font-bold text-sm">
                            1
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{topThree[0].name}</h3>
                        <div className={`inline-block px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r ${getTrophyColor(0)} shadow-lg text-lg`}>
                          +{topThree[0].levelsGained} levels
                        </div>
                      </div>
                    </div>
                    <div className="w-24 h-24 bg-gradient-to-t from-yellow-400 to-yellow-300 mt-4 rounded-t-lg flex items-center justify-center">
                      <span className="font-bold text-yellow-800">1st</span>
                    </div>
                  </div>
                  
                  {/* 3rd place */}
                  {topThree.length > 2 && topThree[2] && (
                    <div className="flex flex-col items-center">
                      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-amber-200 transform hover:scale-105 transition-all duration-300">
                        <div className="text-center">
                          <div className="mb-4 flex justify-center">
                            {getTrophyIcon(2)}
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{topThree[2].name}</h3>
                          <div className={`inline-block px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${getTrophyColor(2)} shadow-md`}>
                            +{topThree[2].levelsGained} levels
                          </div>
                        </div>
                      </div>
                      <div className="w-24 h-12 bg-gradient-to-t from-amber-500 to-amber-400 mt-4 rounded-t-lg flex items-center justify-center">
                        <span className="font-bold text-amber-800">3rd</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Grouped Remaining Members */}
            {sortedGroups.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-rose-100/50">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">More Gamers</h2>
                  <p className="text-gray-600">Everyone else who leveled up this week</p>
                </div>
                
                <div className="space-y-4">
                  {sortedGroups.map(([levels, names]) => (
                    <div key={levels} className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100/30">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-shrink-0">
                          <span className="inline-block px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-full text-lg shadow-md">
                            +{levels} levels
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 font-medium text-lg leading-relaxed">
                            {names.join(", ")}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-sm text-gray-500">
                          {names.length} {names.length === 1 ? 'member' : 'members'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-20px) translateX(10px) rotate(120deg); 
          }
          66% { 
            transform: translateY(10px) translateX(-15px) rotate(240deg); 
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}