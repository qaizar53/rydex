import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

const VEHICLE_REGEX = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,2}[0-9]{4}$/;

export async function POST(req: Request) {
  try {
    await connectDb();

    const session = await auth();
    if (!session || !session.user?.email) {
      // console.log("kallu");

      return Response.json({ message: "Unauthorised!" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      // console.log("kc");

      return Response.json({ message: "user not found!" }, { status: 400 });
    }

    const { type, number, vehicleModel } = await req.json();
    if (!type || !number || !vehicleModel) {
      // console.log("cb");
      // console.log({
      //   type,
      //   number,
      //   vehicleModel,
      // });
      return Response.json(
        { message: "Missing required details!" },
        { status: 400 },
      );
    }

    if (!VEHICLE_REGEX.test(number)) {
      // console.log("mb");

      return Response.json(
        { message: "Invalid vehicle number format!" },
        { status: 400 },
      );
    }

    const vehicleNumber = number.toUpperCase();

    let vehicle = await Vehicle.findOne({ owner: user._id });
    if (vehicle) {
      vehicle.type = type;
      vehicle.number = vehicleNumber;
      vehicle.vehicleModel = vehicleModel;
      vehicle.status = "pending";

      await vehicle.save();

      if (user.partnerOnBoardingSteps < 2) {
        user.partnerOnBoardingSteps = 2;
        user.partnerStatus = "pending";
        await user.save();
      } else {
        user.partnerOnBoardingSteps = 3;
        user.partnerStatus = "pending";
        await user.save();
      }

      return Response.json(vehicle, { status: 200 });
    }

    const duplicate = await Vehicle.findOne({ number: vehicleNumber });
    if (duplicate) {
      // console.log("mkd");
      return Response.json(
        { message: "Vehicle already registered!" },
        { status: 400 },
      );
    }

    vehicle = await Vehicle.create({
      owner: user._id,
      type,
      number: vehicleNumber,
      vehicleModel,
    });

    if (user.partnerOnBoardingSteps < 1) {
      user.partnerOnBoardingSteps = 1;
    }

    user.role = "partner";
    user.partnerStatus = "pending";

    await user.save();

    return Response.json(vehicle, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: `vehicle error ${error}` },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const session = await auth();
    if (!session || !session.user?.email) {
      return Response.json({ message: "Unauthorised!" }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user?.email });
    if (!user) {
      return Response.json({ message: "user not found!" }, { status: 400 });
    }

    let vehicle = await Vehicle.findOne({ owner: user._id });
    if (vehicle) {
      return Response.json(vehicle, { status: 201 });
    } else {
      // return null;
      return Response.json({ message: "Vehicle not found!" }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: `get vehicle error ${error}` },
      { status: 500 },
    );
  }
}
