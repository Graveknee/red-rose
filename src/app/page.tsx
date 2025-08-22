"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface HighscoreEntry {
  name: string;
  rank: number;
  value: number;
  level: number;
  vocation: string;
  world: string;
}

interface CategoryData {
  [category: string]: HighscoreEntry[];
}

interface CharacterBasicInfo {
  name: string;
  vocation: string;
  level: number;
}

interface CachedData {
  timestamp: number;
  categoryData: CategoryData;
  characterInfo: CharacterBasicInfo[];
}

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export default function Home() {
  const [guildMembers, setGuildMembers] = useState<Set<string>>(new Set());
  const [categoryData, setCategoryData] = useState<CategoryData>({});
  const [characterInfo, setCharacterInfo] = useState<CharacterBasicInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const categories = [
    { key: "experience", label: "Experience" },
    { key: "magic", label: "Magic Level" },
    { key: "sword", label: "Sword Fighting" },
    { key: "axe", label: "Axe Fighting" },
    { key: "club", label: "Club Fighting" },
    { key: "distance", label: "Distance Fighting" },
    { key: "shielding", label: "Shielding" },
    { key: "fist", label: "Fist Fighting" },
    { key: "fishing", label: "Fishing" },
    { key: "achievements", label: "Achievements" },
  ];

  const vocations = ["Elite Knight", "Royal Paladin", "Master Sorcerer", "Elder Druid"];

  // Check if cache is valid
  const isCacheValid = (cachedData: CachedData) => {
    return Date.now() - cachedData.timestamp < CACHE_DURATION;
  };

  // Load data from localStorage
  const loadFromCache = (): CachedData | null => {
    try {
      const cached = localStorage.getItem('red-rose-highscores');
      if (cached) {
        const data: CachedData = JSON.parse(cached);
        if (isCacheValid(data)) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
    return null;
  };

  // Save data to localStorage
  const saveToCache = (categoryData: CategoryData, characterInfo: CharacterBasicInfo[]) => {
    try {
      const cacheData: CachedData = {
        timestamp: Date.now(),
        categoryData,
        characterInfo
      };
      localStorage.setItem('red-rose-highscores', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  };

  const fetchData = async () => {
    try {
      setIsUpdating(true);

      // First, get guild members
      const guildRes = await fetch("https://api.tibiadata.com/v4/guild/Red%20Rose");
      const guildData = await guildRes.json();
      const members = guildData.guild?.members || [];
      const memberNames = new Set<string>(members.map((m: any) => String(m.name)));
      setGuildMembers(memberNames);

      // Get basic character info for vocation-based highscores
      const charInfoPromises = members.slice(0, 50).map(async (member: any) => {
        try {
          const charRes = await fetch(
            `https://api.tibiadata.com/v4/character/${encodeURIComponent(member.name)}`
          );
          const charData = await charRes.json();
          const charInfo = charData.character?.character;
          
          if (charInfo) {
            return {
              name: charInfo.name,
              vocation: charInfo.vocation,
              level: charInfo.level || 0
            };
          }
        } catch (err) {
          // Silent error handling
        }
        return null;
      });

      const resolvedCharInfo = (await Promise.all(charInfoPromises)).filter(Boolean) as CharacterBasicInfo[];
      setCharacterInfo(resolvedCharInfo);

      // Now fetch highscores for each category
      const newCategoryData: CategoryData = {};
      
      for (const category of categories) {
        try {
          let allHighscores: any[] = [];
          let currentPage = 1;
          let hasMorePages = true;
          let guildMembersFound = 0;
          
          // Fetch pages until we find 5 guild members or reach page limit
          while (hasMorePages && currentPage <= 20 && guildMembersFound < 5) {
            const hsRes = await fetch(
              `https://api.tibiadata.com/v4/highscores/Antica/${category.key}/all/${currentPage}`
            );
            const hsData = await hsRes.json();
            
            if (hsData.highscores?.highscore_list && hsData.highscores.highscore_list.length > 0) {
              allHighscores.push(...hsData.highscores.highscore_list);
              
              // Count guild members found so far
              guildMembersFound = allHighscores.filter(entry => 
                memberNames.has(entry.name)
              ).length;
              
              // Check if we have more pages
              const totalPages = hsData.highscores.highscore_page?.total_pages || 1;
              hasMorePages = currentPage < totalPages;
              currentPage++;
            } else {
              hasMorePages = false;
            }
            
            // Small delay to be nice to the API
            await new Promise(resolve => setTimeout(resolve, 100));
          }
          
          // Filter to only guild members and take top 5
          const guildHighscores = allHighscores
            .filter(entry => memberNames.has(entry.name))
            .slice(0, 5);
          
          newCategoryData[category.key] = guildHighscores;
          
        } catch (err) {
          newCategoryData[category.key] = [];
        }
      }

      setCategoryData(newCategoryData);
      setLastUpdated(new Date());
      
      // Save to cache
      saveToCache(newCategoryData, resolvedCharInfo);
      
    } catch (err) {
      console.error("Error in fetchData:", err);
    } finally {
      setIsUpdating(false);
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const cachedData = loadFromCache();
    if (cachedData) {
      setCategoryData(cachedData.categoryData);
      setCharacterInfo(cachedData.characterInfo);
      setLastUpdated(new Date(cachedData.timestamp));
    } else {
      setLoading(true);
      fetchData();
    }
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  // Get top 5 for each vocation based on character info we fetched
  const getTopByVocation = (vocation: string) => {
    return characterInfo
      .filter(char => {
        const charVoc = char.vocation.toLowerCase();
        const targetVoc = vocation.toLowerCase();
        return charVoc.includes(targetVoc.split(' ').pop()?.toLowerCase() || '') ||
               charVoc === targetVoc;
      })
      .sort((a, b) => b.level - a.level)
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4 h-8 w-8" />
          <p className="text-xl">Loading guild highscores...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100 text-gray-900">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Red Rose Guild Highscores</h1>
        <div className="text-right">
          <button
            onClick={handleRefresh}
            disabled={isUpdating}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
          {lastUpdated && (
            <p className="text-sm text-gray-600 mt-2">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Skill categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => {
          const top = categoryData[cat.key] || [];
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="h-full"
            >
              <Card className="rounded-2xl shadow-lg h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <h2 className="text-xl font-bold mb-4">{cat.label}</h2>
                  {top.length ? (
                    <ul className="space-y-2 w-full">
                      {top.map((entry, i) => (
                        <li
                          key={`${i}-${entry.name}`}
                          className="flex justify-between w-full text-sm border-b border-gray-300 last:border-none pb-1"
                        >
                          <span>#{entry.rank} {entry.name}</span>
                          <span>
                            {cat.key === "experience" 
                              ? `${entry.level} (${entry.vocation})` 
                              : entry.value
                            }
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No data available</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Top experience per vocation */}
      <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Top Experience by Vocation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vocations.map((voc, idx) => {
          const top = getTopByVocation(voc);
          return (
            <motion.div
              key={voc}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="h-full"
            >
              <Card className="rounded-2xl shadow-lg h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold mb-4">{voc}</h3>
                  {top.length ? (
                    <ul className="space-y-2 w-full">
                      {top.map((char, i) => (
                        <li
                          key={`${i}-${char.name}`}
                          className="flex justify-between w-full text-sm border-b border-gray-300 last:border-none pb-1"
                        >
                          <span>#{i + 1} {char.name}</span>
                          <span>{char.level}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No players found</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}