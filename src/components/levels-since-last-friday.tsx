"use client";
import { useEffect, useState } from "react";
import { getLevelsSinceLastFriday } from "@/app/actions/get-levels-since-last-friday";

export default function LevelsSinceFriday({ guildName }: { guildName: string }) {
  const [data, setData] = useState<{ name: string; levelsGained: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLevelsSinceLastFriday(guildName).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [guildName]);

  if (loading) return <p>Loading levels since last Friday...</p>;

  return (
    <div>
      <h2>Levels gained since last Friday 10:00</h2>
      {data.map((m) => (
        <div key={m.name}>
          {m.name}: {m.levelsGained} levels
        </div>
      ))}
    </div>
  );
}
