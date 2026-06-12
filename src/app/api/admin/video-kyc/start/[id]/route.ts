import { NextRequest } from "next/server";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user?.email || session.user.role !== "admin") {
      return Response.json({ message: "Unauthorised!" }, { status: 400 });
    }
    await connectDb();

    const partnerId = (await context.params).id;
    const partner = await User.findById(partnerId);

    if (!partner || partner.role !== "partner") {
      return Response.json({ message: "partner not found!" }, { status: 400 });
    }

    const roomId = `kyc-${partner._id}-${Date.now()}`;
    partner.videoKycRoomId = roomId;
    partner.videoKycStatus = "in_progress";
    partner.partnerOnBoardingSteps = 4;

    await partner.save();

    return Response.json(roomId, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: `video kyc start error ${error}` },
      { status: 500 },
    );
  }
}
