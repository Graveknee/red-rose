import { NextResponse } from "next/server";
import { takeSnapshot } from "@/app/actions/take-snapshot";

export async function GET(req: Request) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const weeksSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60 * 24 * 7));
  if (weeksSinceEpoch % 2 === 0) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Even week - skipping snapshot" });
  }

  await takeSnapshot("Red Rose");
  return NextResponse.json({ ok: true });
}