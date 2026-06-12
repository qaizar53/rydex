// import { auth } from "@/auth";
// import connectDb from "@/lib/db";
// import Booking from "@/models/booking.model";
// import User from "@/models/user.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDb();

//     const session = await auth();
//     if (!session || !session.user?.email) {
//       return Response.json({ message: "Unauthorised!" }, { status: 400 });
//     }

//     const driver = await User.findOne({ email: session.user.email });

//     const bookings = await Booking.find({ driver:driver._id })
//       .populate("user driver vehicle")
//       .sort({ createdAt: -1 });

//     return NextResponse.json(bookings, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: `get booking for partner error ${error}` },
//       { status: 500 },
//     );
//   }
// }

import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorised!" }, { status: 400 });
    }

    const driver = await User.findOne({ email: session.user.email });

    if (!driver) {
      return NextResponse.json(
        { message: "Driver not found" },
        { status: 404 },
      );
    }

    // 2. Pass the explicit model objects into the populate method to be 100% safe in Next.js environments
    const bookings = await Booking.find({ driver: driver._id })
      .populate([
        { path: "user", model: User },
        { path: "driver", model: User },
        { path: "vehicle", model: Vehicle }, // 👈 Explicit model injection
      ])
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `get booking for partner error ${error}` },
      { status: 500 },
    );
  }
}
