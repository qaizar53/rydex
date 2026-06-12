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

    const partner = await User.findOne({ email: session.user?.email });
    if (!partner) {
      return Response.json({ message: "partner not found!" }, { status: 400 });
    }

    const count = await Booking.countDocuments({
      driver: partner._id,
      bookingStatus: "requested",
    });

    return Response.json(count, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `pending request count error ${error}` },
      { status: 500 },
    );
  }
}
