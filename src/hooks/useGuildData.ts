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
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

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
  ];

  // Check if cache is valid
  const isCacheValid = (cachedData: CachedData) => {
    return Date.now() - cachedData.timestamp < CACHE_DURATION;
  };

  // Load data from localStorage (client-side only)
  const loadFromCache = (): CachedData | null => {
    if (typeof window === 'undefined') {
      console.log('🚫 loadFromCache: SSR detected, skipping cache');
      return null;
    }
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CachedData = JSON.parse(cached);
        if (isCacheValid(data)) {
          console.log('✅ loadFromCache: Valid cache found', {
            timestamp: new Date(data.timestamp),
            categoriesCount: Object.keys(data.categoryData).length,
            charactersCount: data.characterInfo.length
          });
          return data;
        } else {
          console.log('⏰ loadFromCache: Cache expired', {
            timestamp: new Date(data.timestamp),
            age: Date.now() - data.timestamp
          });
        }
      } else {
        console.log('🗂️ loadFromCache: No cache found');
      }
    } catch (error) {
      console.error('❌ Error loading cache:', error);
    }
    return null;
  };

  // Save data to localStorage (client-side only)
  const saveToCache = (categoryData: CategoryData, characterInfo: CharacterBasicInfo[]) => {
    if (typeof window === 'undefined') return;
    
    try {
      const cacheData: CachedData = {
        timestamp: Date.now(),
        categoryData,
        characterInfo
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 saveToCache: Data saved', {
        categoriesCount: Object.keys(categoryData).length,
        charactersCount: characterInfo.length
      });
    } catch (error) {
      console.error('❌ Error saving cache:', error);
    }
  };

  const preloadGuildData = useCallback(async () => {
    console.log('🚀 preloadGuildData: Starting...');
    
    // Check cache first
    const cachedData = loadFromCache();
    if (cachedData) {
      console.log('📋 preloadGuildData: Using cached data');
      setCategoryData(cachedData.categoryData);
      setCharacterInfo(cachedData.characterInfo);
      setLastUpdated(new Date(cachedData.timestamp));
      return;
    }

    console.log('🔄 preloadGuildData: No valid cache, fetching fresh data');
    setLoading(true);
    setLoadingProgress('Starting data fetch...');

    try {
      // First, get guild members
      console.log('👥 Fetching guild members...');
      setLoadingProgress('Fetching guild members...');
      const guildRes = await fetch("https://api.tibiadata.com/v4/guild/Red%20Rose");
      const guildData = await guildRes.json();
      const members = guildData.guild?.members || [];
      const memberNames = new Set<string>(members.map((m: any) => String(m.name)));
      setGuildMembers(memberNames);
      console.log(`👥 Found ${members.length} guild members`);

      // Get basic character info for vocation-based highscores
      console.log('🔍 Fetching character info...');
      setLoadingProgress('Fetching character info...');
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
          console.log(`⚠️ Failed to fetch character: ${member.name}`);
        }
        return null;
      });

      const resolvedCharInfo = (await Promise.all(charInfoPromises)).filter(Boolean) as CharacterBasicInfo[];
      setCharacterInfo(resolvedCharInfo);
      console.log(`🧙 Processed ${resolvedCharInfo.length} characters`);

      // Now fetch highscores for each category
      const newCategoryData: CategoryData = {};
      
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        console.log(`📊 Fetching ${category.label} highscores... (${i + 1}/${categories.length})`);
        setLoadingProgress(`Fetching ${category.label} highscores... (${i + 1}/${categories.length})`);
        
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
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // Filter to only guild members and take top 5
          const guildHighscores = allHighscores
            .filter(entry => memberNames.has(entry.name))
            .slice(0, 5);
          
          newCategoryData[category.key] = guildHighscores;
          console.log(`📊 ${category.label}: Found ${guildHighscores.length} guild members`);
          
        } catch (err) {
          console.error(`❌ Error fetching ${category.label}:`, err);
          newCategoryData[category.key] = [];
        }
      }

      setCategoryData(newCategoryData);
      setLastUpdated(new Date());
      
      // Save to cache
      saveToCache(newCategoryData, resolvedCharInfo);
      console.log('✅ preloadGuildData: Complete!');
      
    } catch (err) {
      console.error("❌ Error in preloadGuildData:", err);
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  }, []);

  const refreshData = useCallback(async () => {
    console.log('🔄 refreshData: Clearing cache and fetching fresh data');
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