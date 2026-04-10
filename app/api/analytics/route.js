import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    console.info("[analytics]", JSON.stringify(data));
  } catch {
    // Ignore malformed payloads.
  }

  return NextResponse.json({ ok: true });
}
