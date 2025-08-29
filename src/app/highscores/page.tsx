"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Axe, BowArrow, Fish, Hammer, HandFist, RefreshCw, Shield, Sword, Trophy, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useGuildData } from "@/hooks/use-guild-data";

interface Category {
  key: string;
  label: string;
  icon: LucideIcon;
  color: keyof typeof colors;
}

interface GuildMember {
  name: string;
  level: number;
  vocation: string;
  value?: number; // for skill value, optional
}

interface Vocation {
  name: string;
  color: keyof typeof colors;
  gradient: string;
}

const categories: Category[] = [
  { key: "experience", label: "Experience", icon: Trophy, color: "rose" },
  { key: "magic", label: "Magic Level", icon: Zap, color: "purple" },
  { key: "sword", label: "Sword Fighting", icon: Sword, color: "blue" },
  { key: "axe", label: "Axe Fighting", icon: Axe, color: "green" },
  { key: "club", label: "Club Fighting", icon: Hammer, color: "amber" },
  { key: "distance", label: "Distance Fighting", icon: BowArrow, color: "emerald" },
  { key: "shielding", label: "Shielding", icon: Shield, color: "cyan" },
  { key: "fist", label: "Fist Fighting", icon: HandFist, color: "orange" },
  { key: "fishing", label: "Fishing", icon: Fish, color: "teal" },
  { key: "achievements", label: "Achievements", icon: Trophy, color: "pink" },
];

const vocations: Vocation[] = [
  { name: "Elite Knight", color: "rose", gradient: "from-rose-500 to-pink-600" },
  { name: "Royal Paladin", color: "emerald", gradient: "from-emerald-500 to-green-600" },
  { name: "Master Sorcerer", color: "blue", gradient: "from-blue-500 to-indigo-600" },
  { name: "Elder Druid", color: "amber", gradient: "from-amber-500 to-orange-600" },
  { name: "Exalted Monk", color: "purple", gradient: "from-purple-500 to-violet-600" }
];

type ColorKey =
  | "rose" | "purple" | "blue" | "green" | "yellow" | "orange"
  | "red" | "gray" | "indigo" | "pink" | "cyan" | "teal" | "amber" | "emerald";

const colors: Record<ColorKey, {
  bg: string;
  border: string;
  text: string;
  icon: string;
  iconHover: string;
}> = {
  rose: { bg: 'from-rose-50/80 to-pink-50/80', border: 'border-rose-100/50', text: 'text-rose-600', icon: 'bg-rose-100', iconHover: 'group-hover:bg-rose-200' },
  purple: { bg: 'from-purple-50/80 to-indigo-50/80', border: 'border-purple-100/50', text: 'text-purple-600', icon: 'bg-purple-100', iconHover: 'group-hover:bg-purple-200' },
  blue: { bg: 'from-blue-50/80 to-cyan-50/80', border: 'border-blue-100/50', text: 'text-blue-600', icon: 'bg-blue-100', iconHover: 'group-hover:bg-blue-200' },
  green: { bg: 'from-green-50/80 to-emerald-50/80', border: 'border-green-100/50', text: 'text-green-600', icon: 'bg-green-100', iconHover: 'group-hover:bg-green-200' },
  yellow: { bg: 'from-yellow-50/80 to-amber-50/80', border: 'border-yellow-100/50', text: 'text-yellow-600', icon: 'bg-yellow-100', iconHover: 'group-hover:bg-yellow-200' },
  orange: { bg: 'from-orange-50/80 to-amber-50/80', border: 'border-orange-100/50', text: 'text-orange-600', icon: 'bg-orange-100', iconHover: 'group-hover:bg-orange-200' },
  red: { bg: 'from-red-50/80 to-rose-50/80', border: 'border-red-100/50', text: 'text-red-600', icon: 'bg-red-100', iconHover: 'group-hover:bg-red-200' },
  gray: { bg: 'from-gray-50/80 to-slate-50/80', border: 'border-gray-100/50', text: 'text-gray-600', icon: 'bg-gray-100', iconHover: 'group-hover:bg-gray-200' },
  indigo: { bg: 'from-indigo-50/80 to-violet-50/80', border: 'border-indigo-100/50', text: 'text-indigo-600', icon: 'bg-indigo-100', iconHover: 'group-hover:bg-indigo-200' },
  pink: { bg: 'from-pink-50/80 to-rose-50/80', border: 'border-pink-100/50', text: 'text-pink-600', icon: 'bg-pink-100', iconHover: 'group-hover:bg-pink-200' },
  cyan: { bg: 'from-cyan-50/80 to-sky-50/80', border: 'border-cyan-100/50', text: 'text-cyan-600', icon: 'bg-cyan-100', iconHover: 'group-hover:bg-cyan-200' },
  teal: { bg: 'from-teal-50/80 to-cyan-50/80', border: 'border-teal-100/50', text: 'text-teal-600', icon: 'bg-teal-100', iconHover: 'group-hover:bg-teal-200' },
  amber: { bg: 'from-amber-50/80 to-orange-50/80', border: 'border-amber-100/50', text: 'text-amber-600', icon: 'bg-amber-100', iconHover: 'group-hover:bg-amber-200' },
  emerald: { bg: 'from-emerald-50/80 to-green-50/80', border: 'border-emerald-100/50', text: 'text-emerald-600', icon: 'bg-emerald-100', iconHover: 'group-hover:bg-emerald-200' },
};

function getColorClasses(color: string) {
  return colors[color as ColorKey] || colors.rose;
}

// --- Components ---
interface SkillCardProps {
  category: Category;
  top: GuildMember[];
  index: number;
}

function SkillCard({ category, top, index }: SkillCardProps) {
  const Icon = category.icon;
  const colorClasses = getColorClasses(category.color);

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-lg border border-gray-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg.replace('/80', '/20')} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative p-6 h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-xl ${colorClasses.icon} ${colorClasses.iconHover} transition-colors duration-300`}>
            <Icon className={`h-5 w-5 ${colorClasses.text}`} />
          </div>
          <h3 className="font-bold text-gray-900 text-lg">{category.label}</h3>
        </div>
        <div className="flex-grow">
          {top.length > 0 ? (
            <div className="space-y-3">
              {top.slice(0, 5).map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/80 hover:bg-white/80 transition-colors">
                  <div className="flex items-center space-x-2">
                    <span className={`w-6 h-6 rounded-full ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-300' : 'bg-amber-200'} flex items-center justify-center text-xs font-bold text-white`}>
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-800 text-sm truncate">{entry.name}</span>
                  </div>
                  <span className={`text-xs font-bold ${colorClasses.text}`}>
                    {category.key === "experience" 
                      ? `Lvl ${entry.level}` 
                      : (entry.value ?? 0).toLocaleString()}
                  </span>
                </div>
              ))}
              {top.length < 5 && (
                <div className="text-center text-xs text-gray-500 mt-2">
                  Only {top.length} guild member{top.length !== 1 ? 's' : ''} found
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No guild members found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface VocationCardProps {
  vocation: Vocation;
  top: GuildMember[];
}

function VocationCard({ vocation, top }: VocationCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 to-white/80 backdrop-blur-lg border border-gray-100/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className={`absolute inset-0 bg-gradient-to-br ${vocation.gradient.replace('500', '100').replace('600', '200')}/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative p-6">
        <div className="text-center mb-6">
          <h3 className={`text-xl font-bold bg-gradient-to-r ${vocation.gradient} bg-clip-text text-transparent mb-2`}>
            {vocation.name}
          </h3>
          <div className={`h-1 w-12 bg-gradient-to-r ${vocation.gradient} mx-auto rounded-full`}></div>
        </div>

        {top.length > 0 ? (
          <div className="space-y-3">
            {top.map((char, i) => (
              <div key={char.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 hover:bg-white/80 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className={`w-8 h-8 rounded-full ${i === 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-500' : i === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' : i === 2 ? 'bg-gradient-to-r from-amber-200 to-amber-300' : 'bg-gray-200'} flex items-center justify-center text-sm font-bold text-white shadow-md`}>
                    {i + 1}
                  </span>
                  <span className="font-medium text-gray-800 truncate">{char.name}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold bg-gradient-to-r ${vocation.gradient} bg-clip-text text-transparent`}>
                    Level {char.level}
                  </div>
                </div>
              </div>
            ))}
            {top.length < 5 && (
              <div className="text-center text-xs text-gray-500 mt-2">
                Only {top.length} {vocation.name.toLowerCase()}{top.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No {vocation.name.toLowerCase()}s found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Main Page ---
export default function HighscoresPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const { categoryData, characterInfo, loading, loadingProgress, lastUpdated, refreshData, preloadGuildData } = useGuildData();

  const isDataLoaded = Object.keys(categoryData).length > 0 || characterInfo.length > 0;

  // --- Mouse Parallax ---
  useEffect(() => {
    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setMousePosition({
          x: (e.clientX / window.innerWidth - 0.5) * 20,
          y: (e.clientY / window.innerHeight - 0.5) * 20
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- Load cached data immediately ---
  useEffect(() => {
    preloadGuildData();
  }, [preloadGuildData]);

  const handleRefresh = () => refreshData();

  const skillCards = useMemo(() => categories.map((cat, idx) => (
    <SkillCard key={cat.key} category={cat} top={categoryData[cat.key] || []} index={idx} />
  )), [categoryData]);

  const vocationCards = useMemo(() => {
    const getTopByVocation = (vocation: string): GuildMember[] => {
      return characterInfo
        .filter(char => char.vocation.toLowerCase().includes(vocation.toLowerCase().split(' ').pop() || ''))
        .sort((a, b) => b.level - a.level)
        .slice(0, 5);
    };
    return vocations.map(voc => (
      <VocationCard key={voc.name} vocation={voc} top={getTopByVocation(voc.name)} />
    ));
  }, [characterInfo]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 px-8 py-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12" style={{ transform: `translateY(${mousePosition.y * 0.05}px)` }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <button type="button" onClick={() => router.push('/')} className="group flex items-center gap-2 bg-white/80 hover:bg-white backdrop-blur-sm border border-rose-100/50 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <ArrowLeft className="h-5 w-5 text-rose-600 group-hover:text-rose-700 transition-colors" />
                <span className="text-rose-600 group-hover:text-rose-700 font-medium transition-colors">Back</span>
              </button>

              <div>
                <h1 className="text-4xl md:text-5xl font-serif font-black bg-gradient-to-r from-rose-600 via-rose-800 to-pink-600 bg-clip-text text-transparent mb-6 pb-2 leading-[1.1]">
                  Guild Highscores
                </h1>
                <div className="h-1 w-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <button type="button" onClick={handleRefresh} disabled={loading} className="group flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-rose-300 disabled:to-pink-400 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:hover:translate-y-0">
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                <span className="font-medium">{loading ? 'Updating...' : 'Refresh Data'}</span>
              </button>
              {lastUpdated && <p className="text-sm text-rose-600/70 mt-2 font-medium">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
            </div>
          </div>
        </div>

        {/* Loading Progress */}
        {(loading || (!isDataLoaded && loadingProgress)) && loadingProgress && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100/50">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <RefreshCw className="animate-spin h-5 w-5 text-blue-600" />
                <span className="text-blue-700 font-medium">{loadingProgress}</span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {!isDataLoaded && !loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-rose-300 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <RefreshCw className="animate-spin mx-auto h-12 w-12 text-rose-600 relative z-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Guild Highscores</h2>
              <p className="text-rose-600/80">Gathering the finest warriors of Red Rose...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Skill Categories */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-center mb-2 text-gray-800">Skill Rankings</h2>
              <p className="text-center text-rose-600/80 mb-8">Excellence across all disciplines</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{skillCards}</div>
            </section>

            {/* Vocation Rankings */}
            <section>
              <h2 className="text-3xl font-serif font-bold text-center mb-2 text-gray-800">Vocation Champions</h2>
              <p className="text-center text-rose-600/80 mb-8">The strongest players in each calling</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{vocationCards}</div>
            </section>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%,100%{transform:translateY(0) translateX(0) rotate(0deg);}
          33%{transform:translateY(-20px) translateX(10px) rotate(120deg);}
          66%{transform:translateY(10px) translateX(-15px) rotate(240deg);}
        }
        .animate-float{animation:float 8s ease-in-out infinite;}
      `}</style>
    </main>
  );
}
