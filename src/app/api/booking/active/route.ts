import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";

export async function GET(req: Request) {
  try {
    await connectDb();

    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ booking: null });
    }

    const user = await User.findOne({ email: session.user.email });

    const booking = await Booking.findOne({
      user: user._id,
      bookingStatus: {
        $in: ["requested", "awaiting_payment", "confirmed", "started"],
      },
    });

    if (!booking) {
      return Response.json({ booking: "idle" });
    }

    return Response.json({ booking });
  } catch (error) {
    return Response.json(
      { message: `active booking error ${error}` },
      { status: 500 },
    );
  }
}
