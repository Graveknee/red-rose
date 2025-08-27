"use client";

import { useEffect, useState } from "react";

interface Snapshot {
  timestamp: number;
  name: string;
  level: number;
}

export default function GainsPage() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSnapshots() {
      // TODO: replace with API / DB call
      const res = await fetch("/api/snapshots"); 
      const data: Snapshot[] = await res.json();
      setSnapshots(data);
      setLoading(false);
    }

    fetchSnapshots();
  }, []);

  if (loading) return <p>Loading level gains...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Level Gains</h1>
      <p>Compare weekly / monthly snapshots to see gained levels.</p>
      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Level Then</th>
            <th className="border p-2">Level Now</th>
            <th className="border p-2">Gained</th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map(s => (
            <tr key={s.name}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.level}</td>
              <td className="border p-2">{s.level + 0 /* replace with current level */}</td>
              <td className="border p-2">{0 /* replace with diff */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

