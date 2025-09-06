/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <bad loop> */
"use client";

import { useCallback, useState } from "react";

interface HighscoreEntry {
  name: string;
  rank: number;
  value: number;
  level: number;
  vocation: string;
  world: string;
}

interface GuildMember {
  name: string;
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

const CACHE_KEY = "red-rose-highscores";
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; 
const GUILD_MEMBER_LIMIT = 200;
const HIGHSCORE_MEMBER_LIMIT = 5;

export function useGuildData() {
  const [categoryData, setCategoryData] = useState<CategoryData>({});
  const [characterInfo, setCharacterInfo] = useState<CharacterBasicInfo[]>([]);
  const [guildMembers, setGuildMembers] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
    { key: "charmpoints", label: "Charm Points" },
    { key: "bosspoints", label: "Boss Points" }
  ];

  function isCacheValid(cachedData: CachedData) {
    return Date.now() - cachedData.timestamp < CACHE_DURATION;
  }

  const loadFromCache = useCallback((): CachedData | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
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
  }, []);

  const saveToCache = useCallback((categoryData: CategoryData, characterInfo: CharacterBasicInfo[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData: CachedData = {
        timestamp: Date.now(),
        categoryData,
        characterInfo
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }, []);

  const preloadGuildData = useCallback(async () => {
    const cachedData = loadFromCache();
    if (cachedData) {
      setCategoryData(cachedData.categoryData);
      setCharacterInfo(cachedData.characterInfo);
      setLastUpdated(new Date(cachedData.timestamp));
      return;
    }

    setLoading(true);
    setLoadingProgress('Starting data fetch...');

    try {
      setLoadingProgress('Fetching guild members...');
      const guildRes = await fetch("https://api.tibiadata.com/v4/guild/Red%20Rose");
      const guildData = await guildRes.json();

      const members: GuildMember[] = guildData.guild?.members || [];
      const memberNames = new Set<string>(members.map((m: GuildMember) => String(m.name)));
      
      setGuildMembers(memberNames);
      setLoadingProgress('Fetching character info...');

      const charInfoPromises = members.slice(0, GUILD_MEMBER_LIMIT).map(async (member: GuildMember) => {
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
        } catch {
          console.log(`Failed to fetch character: ${member.name}`);
        }
        return null;
      });

      const resolvedCharInfo = (await Promise.all(charInfoPromises)).filter(Boolean) as CharacterBasicInfo[];
      setCharacterInfo(resolvedCharInfo);

      const newCategoryData: CategoryData = {};
      
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        setLoadingProgress(`Fetching ${category.label} highscores... (${i + 1}/${categories.length})`);
        
        try {
          const allHighscores: HighscoreEntry[] = [];
          let currentPage = 1;
          let hasMorePages = true;
          let guildMembersFound = 0;
          
          while (hasMorePages && currentPage <= 20 && guildMembersFound < HIGHSCORE_MEMBER_LIMIT) {
            const hsRes = await fetch(
              `https://api.tibiadata.com/v4/highscores/Antica/${category.key}/all/${currentPage}`
            );
            const hsData = await hsRes.json();
            
            if (hsData.highscores?.highscore_list && hsData.highscores.highscore_list.length > 0) {
              allHighscores.push(...hsData.highscores.highscore_list);
              
              guildMembersFound = allHighscores.filter(entry => 
                memberNames.has(entry.name)
              ).length;
              
              const totalPages = hsData.highscores.highscore_page?.total_pages || 1;
              hasMorePages = currentPage < totalPages;
              currentPage++;
            } else {
              hasMorePages = false;
            }
            
            await new Promise(resolve => setTimeout(resolve, 25));
          }
          
          const guildHighscores = allHighscores
            .filter(entry => memberNames.has(entry.name))
            .slice(0, HIGHSCORE_MEMBER_LIMIT);
          
          newCategoryData[category.key] = guildHighscores;          
        } catch (err) {
          console.error(`Error fetching ${category.label}:`, err);
          newCategoryData[category.key] = [];
        }
      }

      setCategoryData(newCategoryData);
      setLastUpdated(new Date());
      
      saveToCache(newCategoryData, resolvedCharInfo);      
    } catch (err) {
      console.error("Error in preloadGuildData:", err);
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  }, [saveToCache, loadFromCache]);

  const refreshData = useCallback(async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CACHE_KEY);
    }
    await preloadGuildData();
  }, [preloadGuildData]);

  return { 
    categoryData,
    characterInfo,
    guildMembers,
    loading, 
    loadingProgress,
    lastUpdated,
    preloadGuildData,
    refreshData,
    loadFromCache,
    isCacheValid: (data: CachedData) => isCacheValid(data)
  };
}