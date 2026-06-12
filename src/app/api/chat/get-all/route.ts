import connectDb from "@/lib/db";
import ChatMessage from "@/models/chatMessage.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const { bookingId, sender, text } = await req.json();

    const msgs = await ChatMessage.find({
      bookingId,
    }).sort({ createdAt: -1 });

    return NextResponse.json(msgs, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `get all msg error ${error}` },
      { status: 500 },
    );
  }
}
