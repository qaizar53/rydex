import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await context.params).id;
    await connectDb();

    const booking = await Booking.findById(id);
    if (!booking || booking.bookingStatus !== "requested") {
      return Response.json({ message: "invalid!" }, { status: 400 });
    }

    booking.bookingStatus = "cancelled";

    await booking.save();

    return Response.json({ success: "true" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `cancel booking error ${error}` },
      { status: 500 },
    );
  }
}
