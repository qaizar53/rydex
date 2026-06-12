import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import axios from "axios";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ message: "Unauthorised User!" }, { status: 400 });
    }

    const {
      driverId,
      vehicleId,
      pickUpAddress,
      dropAddress,
      pickUpLocation,
      dropLocation,
      fare,
      mobileNumber,
    } = await req.json();

    if (
      !driverId ||
      !vehicleId ||
      !pickUpLocation.coordinates ||
      !dropLocation.coordinates
    ) {
      return Response.json(
        { message: "missing required details!" },
        { status: 400 },
      );
    }

    // const userId = new mongoose.Schema.Types.ObjectId(session.user.id);
    const userId = session.user.id.toString();

    const driver = await User.findById(driverId);
    if (!driver) {
      return Response.json({ message: "driver not found!" }, { status: 400 });
    }

    const existing = await Booking.findOne({
      user: userId,
      bookingStatus: {
        $in: ["requested", "awaiting_payment", "confirmed", "started"],
      },
    });

    if (existing) {
      return Response.json(existing);
    }

    const booking = await Booking.create({
      user: userId,
      driver,
      vehicle: vehicleId,
      pickUpAddress,
      dropAddress,
      pickUpLocation,
      dropLocation,
      fare,
      userMobileNumber: mobileNumber,
      driverMobileNumber: driver.mobileNumber,
      bookingStatus: "requested",
    });

    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/emit`, {
      event: "new-booking",
      userId: driverId,
      data: booking,
    });

    return Response.json(booking, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `create booking error ${error}` },
      { status: 500 },
    );
  }
}
