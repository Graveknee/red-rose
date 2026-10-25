import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.tibiadata.com/v5/guild/Red%20Rose");
    if (!response.ok) {
      return NextResponse.json(
        { status: "error", error: `TibiaData returned ${response.status}` },
        { status: 502 }
      );
    }
    return NextResponse.json({ status: "preloaded" });
  } catch (err) {
    return NextResponse.json({ status: "error", error: String(err) }, { status: 502 });
  }
}
