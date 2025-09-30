import { NextResponse } from "next/server";

export async function GET(params) {
  return NextResponse.json({ message: "d" });
}

export async function POST(req) {
  const data = await req.json();
  const { a } = data;
  return NextResponse.json({ message: "d" });
}

export async function GET(params) {
  return NextResponse.json({ message: "d" });
}

export async function GET(params) {
  return NextResponse.json({ message: "d" });
}
