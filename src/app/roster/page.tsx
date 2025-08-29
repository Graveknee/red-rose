"use client";

import { ArrowLeft, ChevronDown, ChevronUp, Crown, Filter, Search, Shield, Sword, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface GuildMember {
  name: string;
  nick: string;
  level: number;
  vocation: string;
  joined: string;
  status: string;
  rank: string;
  title: string;
}

export default function GuildMembersPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVocation, setFilterVocation] = useState('all');
  const [yourLevel, setYourLevel] = useState<number | ''>('');
  const [filterRank, setFilterRank] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [showFilters, setShowFilters] = useState(false); 
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'vocation' | 'rank' | 'joined' | 'status' | 'title'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const router = useRouter();

  const vocations = ["Elite Knight", "Royal Paladin", "Master Sorcerer", "Elder Druid", "Exalted Monk"];

  const ranks = ["Leader", "Veneratus", "Aedilus", "Eques", "Inceptor", "Auxiliarius", "Propraetor", "Rosa Absentia", "Novellus Rosae", "Novicium", "Novicium Absentium"];

  const rankHierarchy: { [key: string]: number } = {
    "Leader": 1,
    "Veneratus": 2, 
    "Aedilus": 3,
    "Eques": 4,
    "Inceptor": 5,
    "Auxiliarius": 6,
    "Propraetor": 7,
    "Rosa Absentia": 8,
    "Novellus Rosae": 9,
    "Novicium": 10,
    "Novicium Absentium": 11
  };

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

  const fetchGuildMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.tibiadata.com/v4/guild/Red%20Rose");
      const data = await response.json();
      
      if (data.guild?.members) {
        const formattedMembers: GuildMember[] = data.guild.members.map((member: GuildMember) => ({
          name: member.name,
          nick: member.nick || '',
          level: member.level || 0,
          vocation: member.vocation || 'Unknown',
          joined: member.joined || '',
          status: member.status || 'offline',
          rank: member.rank || 'Member',
          title: member.title || ''
        }));
        setMembers(formattedMembers);
      }
    } catch (error) {
      console.error('Error fetching guild members:', error);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <nah mate>
  useEffect(() => {
    fetchGuildMembers();
  }, []);

  const getVocationColor = (vocation: string) => {
    const vocationColors = {
      "Elite Knight": "from-rose-500 to-pink-600",
      "Royal Paladin": "from-emerald-500 to-green-600", 
      "Master Sorcerer": "from-blue-500 to-indigo-600",
      "Elder Druid": "from-amber-500 to-orange-600",
      "Exalted Monk": "from-purple-500 to-violet-600"
    };
    return vocationColors[vocation as keyof typeof vocationColors] || "from-gray-400 to-gray-600";
  };

  const getRankIcon = (rank: string) => {
    switch (rank.toLowerCase()) {
      case 'leader':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'veneratus':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'aedilus':
        return <Sword className="h-4 w-4 text-purple-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredAndSortedMembers = members
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.nick.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVocation = filterVocation === 'all' || member.vocation === filterVocation;
      const matchesRank = filterRank === 'all' || member.rank === filterRank;
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
      let matchesLevelRange = true;
      if (yourLevel) {
        const minLevel = Math.floor(yourLevel * 2 / 3);
        const maxLevel = Math.floor(yourLevel * 3 / 2);
        matchesLevelRange = member.level >= minLevel && member.level <= maxLevel;
      }
      return matchesSearch && matchesVocation && matchesRank && matchesStatus && matchesLevelRange;
    })
    .sort((a, b) => {
      let compareValue = 0;
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'level':
          compareValue = a.level - b.level;
          break;
        case 'vocation':
          compareValue = a.vocation.localeCompare(b.vocation);
          break;
        case 'rank': {
          const rankA = rankHierarchy[a.rank] || 999;
          const rankB = rankHierarchy[b.rank] || 999;
          compareValue = rankA - rankB;
          break;
        }
        case 'status':
          if (a.status === 'online' && b.status === 'offline') compareValue = -1;
          else if (a.status === 'offline' && b.status === 'online') compareValue = 1;
          else compareValue = a.status.localeCompare(b.status);
          break;
        case 'title':
          compareValue = a.title.localeCompare(b.title);
          break;
        case 'joined':
          compareValue = new Date(a.joined).getTime() - new Date(b.joined).getTime();
          break;
        default:
          compareValue = 0;
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      if (column === 'rank') {
        setSortOrder('asc'); 
      } else if (column === 'level') {
        setSortOrder('desc'); 
      } else if (column === 'status') {
        setSortOrder('desc');
      } else {
        setSortOrder('asc');
      }
    }
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
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
                  Guild Members
                </h1>
                <div className="h-1 w-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-rose-100/50">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-rose-100 rounded-xl bg-white/80 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all text-base"
              />
            </div>

            {/* Filter toggle button - only visible on mobile */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 w-full bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl px-4 py-3 text-rose-700 font-medium transition-colors mb-4"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {/* Filters - always visible on desktop, toggleable on mobile */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                 <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                <span className="text-sm font-medium text-gray-700 lg:hidden">Level for shared experience:</span>
                <input
                  type="number"
                  min={1}
                  value={yourLevel}
                  onChange={(e) => setYourLevel(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="Level for shared exp"
                  className="w-full lg:w-auto px-4 py-2 border border-rose-100 rounded-xl bg-white/80 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                  <div className="flex items-center gap-2 lg:hidden">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full lg:w-auto px-4 py-2 border border-rose-100 rounded-xl bg-white/80 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="online">Online Only</option>
                    <option value="offline">Offline Only</option>
                  </select>
                </div>
                
                {/* Vocation Filter */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 lg:hidden">Vocation:</span>
                  <select
                    value={filterVocation}
                    onChange={(e) => setFilterVocation(e.target.value)}
                    className="w-full lg:w-auto px-4 py-2 border border-rose-100 rounded-xl bg-white/80 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Vocations</option>
                    {vocations.map(voc => (
                      <option key={voc} value={voc}>{voc}</option>
                    ))}
                  </select>
                </div>

                {/* Rank Filter */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 lg:hidden">Rank:</span>
                  <select
                    value={filterRank}
                    onChange={(e) => setFilterRank(e.target.value)}
                    className="w-full lg:w-auto px-4 py-2 border border-rose-100 rounded-xl bg-white/80 focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  >
                    <option value="all">All Ranks</option>
                    {ranks.map(rank => (
                      <option key={rank} value={rank}>{rank}</option>
                    ))}
                  </select>
                </div>

                {/* Members count */}
                <div className="lg:ml-auto">
                  <div className="text-sm text-gray-600 bg-rose-50 px-3 py-2 rounded-xl text-center">
                    {filteredAndSortedMembers.length} members
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-rose-300 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <Users className="animate-pulse mx-auto h-12 w-12 text-rose-600 relative z-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Guild Members</h2>
              <p className="text-rose-600/80">Gathering the finest warriors of Red Rose...</p>
            </div>
          </div>
        ) : (
          /* Members Table */
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-rose-50 to-pink-50">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-rose-100/50 transition-colors"
                        onClick={() => handleSort('rank')}
                      >
                        <div className="flex items-center gap-2">
                          Rank
                          {sortBy === 'rank' && (
                            <span className="text-rose-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-rose-100/50 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center gap-2">
                          Name
                          {sortBy === 'name' && (
                            <span className="text-rose-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-rose-100/50 transition-colors"
                        onClick={() => handleSort('level')}
                      >
                        <div className="flex items-center gap-2">
                          Level
                          {sortBy === 'level' && (
                            <span className="text-rose-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-rose-100/50 transition-colors"
                        onClick={() => handleSort('title')}
                      >
                        <div className="flex items-center gap-2">
                          Title
                          {sortBy === 'title' && (
                            <span className="text-rose-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-rose-100/50 transition-colors"
                        onClick={() => handleSort('vocation')}
                      >
                        <div className="flex items-center gap-2">
                          Vocation
                          {sortBy === 'vocation' && (
                            <span className="text-rose-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-rose-100/50 transition-colors"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {sortBy === 'status' && (
                            <span className="text-rose-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-rose-100/50 transition-colors"
                        onClick={() => handleSort('joined')}
                      >
                        <div className="flex items-center gap-2">
                          Joined
                          {sortBy === 'joined' && (
                            <span className="text-rose-600">
                              {sortOrder === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-100/50">
                    {filteredAndSortedMembers.map((member, index) => (
                      <tr 
                        key={`${member.name}-${index}`}
                        className="hover:bg-rose-50/30 transition-colors duration-200"
                      >
                        {/* Rank */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(member.rank)}
                            <span className="text-sm font-medium text-gray-800">
                              {member.rank}
                            </span>
                          </div>
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-gray-900">{member.name}</div>
                            {member.nick && (
                              <div className="text-sm text-gray-500 italic">"{member.nick}"</div>
                            )}
                          </div>
                        </td>

                        {/* Level */}
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-gray-800">{member.level}</span>
                        </td>

                        {/* Title */}
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {member.title || ''}
                          </div>
                        </td>

                        {/* Vocation */}
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getVocationColor(member.vocation)} shadow-md`}>
                            {member.vocation}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            member.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                          }`}></span>
                          <span className="text-sm text-gray-600 capitalize">{member.status}</span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {member.joined ? new Date(member.joined).toLocaleDateString() : 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredAndSortedMembers.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No members found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
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