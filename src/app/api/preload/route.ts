import { NextResponse } from "next/server";

export async function GET() {
  try {
    await fetch("https://api.tibiadata.com/v4/guild/Red%20Rose");
    return NextResponse.json({ status: "preloaded" });
  } catch (err) {
    return NextResponse.json({ status: "error", error: String(err) }, { status: 500 });
  }
}
