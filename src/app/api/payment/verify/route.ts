import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Booking from "@/models/booking.model";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const {
      bookingId,
      razorpay_payment_id,
      razorpay_signature,
      razorpay_order_id,
    } = await req.json();

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({
        message: "invalid signature!",
        success: false,
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({
        success: false,
        message: "Booking is not found!",
      });
    }

    const adminComission = booking.fare * 0.1;
    const partnerAmount = booking.fare - adminComission;

    booking.adminComission = adminComission;
    booking.partnerAmount = partnerAmount;

    booking.bookingStatus = "confirmed";
    booking.paymentStatus = "paid";

    await booking.save();

    return NextResponse.json(
      { success: true, adminComission, partnerAmount },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `payment verify error ${error}` },
      { status: 500 },
    );
  }
}
