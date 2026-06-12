import connectDb from "@/lib/db";
import { sendMail } from "@/lib/sendMail";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    await connectDb();

    // console.log("DB Connected Successfully");

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 },
      );
    }

    let user = await User.findOne({ email });

    if (user && user.isEmailVerified) {
      return NextResponse.json(
        { message: "Email already exists!" },
        { status: 400 },
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password should have atleast 6 characters!" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (user && !user.isEmailVerified) {
      ((user.name = name),
        (user.email = email),
        (user.password = hashedPassword),
        (user.otp = otp),
        (user.otpExpiresAt = otpExpiresAt));
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiresAt,
      });
    }

    await sendMail(
      email,
      "Your OTP for Email Verification",
      `<h2> Your Email Verification OTP is <strong> ${otp} strong</h2>`,
    );

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `Register Error ${error}!` },
      { status: 500 },
    );
  }
}
