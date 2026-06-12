"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Clock3,
  HeartHandshake,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Users,
  Car,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const stats = [
  { value: "10K+", label: "Rides Completed" },
  { value: "500+", label: "Driver Partners" },
  { value: "25K+", label: "Happy Customers" },
  { value: "99.9%", label: "Reliable Service" },
];

const features = [
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Safe & Secure",
    description:
      "Verified drivers, OTP-based ride verification, and live trip monitoring for peace of mind.",
  },
  {
    icon: <Clock3 className="w-6 h-6" />,
    title: "Quick Booking",
    description:
      "Book your ride in seconds with an intuitive experience designed for speed and simplicity.",
  },
  {
    icon: <MapPinned className="w-6 h-6" />,
    title: "Smart Navigation",
    description:
      "Accurate pickup and drop locations with optimized routes for a smoother journey.",
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Driver First",
    description:
      "Fair earnings and transparent systems that empower our driver partners.",
  },
];

const values = [
  {
    title: "Trust",
    text: "Every ride is built on transparency, reliability, and accountability.",
  },
  {
    title: "Innovation",
    text: "We use technology to make urban transportation smarter and more accessible.",
  },
  {
    title: "Community",
    text: "We grow together by supporting riders, drivers, and local communities.",
  },
];

export default function AboutPage({
  onAuthRequired,
}: {
  onAuthRequired: () => void;
}) {
  const { userData } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  return (
    <main className="bg-linear-to-b from-slate-50 via-white to-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-50 via-transparent to-violet-50" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
              <Sparkles className="w-4 h-4" />
              About Rydex
            </div>

            <h1 className="mt-8 text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900">
              The Smarter Way
              <br />
              to Move.
            </h1>

            <p className="mt-8 text-lg md:text-xl leading-8 text-slate-600 max-w-3xl mx-auto">
              Rydex is a modern ride-booking platform built to make daily travel
              simple, safe, and affordable. We connect riders with trusted
              drivers through technology that focuses on convenience,
              transparency, and reliability.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-white font-semibold hover:scale-[1.02] transition"
                onClick={() => {
                  !userData ? onAuthRequired() : router.push("/user/book");
                }}
              >
                Book a Ride
                <ArrowRight className="w-4 h-4" />
              </button>

              {userData?.role !== "partner" && (
                <button
                  className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
                  onClick={() => router.push("/partner/onboarding/vehicle")}
                >
                  Become a Partner
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <h2 className="text-3xl font-black text-slate-900">
                {item.value}
              </h2>
              <p className="mt-2 text-sm text-slate-500">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Our Story
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Built for Cities,
              <br />
              Designed for People.
            </h2>

            <p className="mt-6 text-slate-600 leading-8">
              Rydex started with a simple vision: local transportation should
              never be complicated. Whether it's a student going to college, a
              professional heading to work, or a family planning a trip across
              town, getting a ride should be effortless.
            </p>

            <p className="mt-5 text-slate-600 leading-8">
              By combining modern technology with a user-first approach, we are
              creating a mobility platform that benefits everyone—riders enjoy a
              seamless experience while driver partners gain flexible earning
              opportunities and transparent payouts.
            </p>
          </motion.div>

          {/* Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-4xl bg-linear-to-br from-slate-900 via-slate-800 to-blue-900 p-8 text-white shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <Car className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm text-slate-300">Our Mission</p>
                <h3 className="text-2xl font-bold">
                  Connecting Every Journey.
                </h3>
              </div>
            </div>

            <p className="mt-8 text-slate-300 leading-8">
              We believe transportation should be accessible, dependable, and
              fair. Every feature we build is focused on making travel easier
              while creating opportunities for our driver community.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-5">
                <Users className="w-6 h-6 mb-3" />
                <p className="font-semibold">Community Driven</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <ShieldCheck className="w-6 h-6 mb-3" />
                <p className="font-semibold">Safety Focused</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Why Rydex
            </span>

            <h2 className="mt-4 text-4xl md:text-5xl font-black text-white">
              Mobility Made Better.
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-slate-400">
              Built with modern technology and a commitment to exceptional
              service, Rydex delivers a ride experience you can count on.
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-3xl bg-white/5 border border-white/10 p-7 backdrop-blur-sm"
              >
                <div className="inline-flex rounded-2xl bg-blue-500/10 p-3 text-blue-400">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Our Values
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-black text-slate-900">
            What Drives Us.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold text-slate-900">
                {value.title}
              </h3>

              <p className="mt-4 text-slate-600 leading-8">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto overflow-hidden rounded-4xl bg-linear-to-r from-blue-600 via-blue-700 to-violet-700 p-10 md:p-14 text-center text-white shadow-xl">
          <h2 className="text-4xl md:text-5xl font-black">
            Ready to Ride with Rydex?
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-blue-100 leading-8">
            Whether you're looking for a convenient ride across the city or want
            to become a valued driver partner, Rydex is here to help you move
            forward.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              className="rounded-2xl bg-white px-7 py-3 font-semibold text-blue-700 hover:scale-[1.02] transition"
              onClick={() => router.push("/")}
            >
              Get Started
            </button>

            <button className="rounded-2xl border border-white/30 px-7 py-3 font-semibold text-white hover:bg-white/10 transition">
              Join as Driver
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
