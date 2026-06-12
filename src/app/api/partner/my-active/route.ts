import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorised!" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });

    const booking = await Booking.findOne({
      driver: user._id,
      bookingStatus: { $in: ["confirmed", "started"] },
    }).populate("user vehicle driver");

    // console.log(JSON.stringify(booking, null, 2));

    return Response.json(booking, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `get active ride for partner error ${error}` },
      { status: 500 },
    );
  }
}
