import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const bookingId = (await context.params).id;
    await connectDb();

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({
        success: false,
        message: "Booking is not found!",
      });
    }

    const adminComission = booking.fare * 0.1;
    const partnerAmount = booking.fare - adminComission;

    booking.bookingStatus = "confirmed";
    booking.paymentStatus = "cash";

    booking.adminComission = adminComission;
    booking.partnerAmount = partnerAmount;

    await booking.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Cash confirm error ${error}` },
      { status: 500 },
    );
  }
}
