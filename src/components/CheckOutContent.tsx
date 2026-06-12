"use client";
import { AnimatePresence, motion, scale } from "motion/react";
import {
  Bike,
  Car,
  Clock,
  CreditCard,
  IndianRupee,
  MapPin,
  Navigation,
  Shield,
  ArrowRight,
  Truck,
  Loader2,
  XCircle,
  CheckCircle,
  Banknote,
  Wallet,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSocket } from "@/lib/socket";

const VEHICLE_META: any = {
  bike: { label: "Bike", Icon: Bike },

  auto: { label: "Auto", Icon: Car },

  car: { label: "Car", Icon: Car },

  loading: { label: "Loading", Icon: Truck },

  truck: { label: "Truck", Icon: Truck },
};

type Status =
  | "idle"
  | "requested"
  | "awaiting_payment"
  | "rejected"
  | "expired"
  | "payment"
  | "confirmed";

function CheckOutContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [pickUp, setPickUp] = useState(params.get("pickUp") || "");
  const [drop, setDrop] = useState(params.get("drop") || "");

  const mobile = params.get("mobile");

  const pickUpLat = Number(params.get("pickUpLat"));
  const pickUpLon = Number(params.get("pickUpLon"));
  const dropLat = Number(params.get("dropLat"));
  const dropLon = Number(params.get("dropLon"));

  const vehicle = params.get("vehicle") || "";
  const driverId = params.get("driverId") || "";
  const vehicleId = params.get("vehicleId") || "";
  const fare = params.get("fare") || "";

  const { Icon, label } = VEHICLE_META[vehicle];

  const [status, setStatus] = useState<Status>("idle");
  const [loading, setLoading] = useState(false);

  const [booking, setBooking] = useState<any>();

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");

  const handleRequestBooking = async () => {
    // setLoading(true);
    try {
      const { data } = await axios.post("/api/booking/create", {
        driverId,
        vehicleId,
        pickUpAddress: pickUp,
        dropAddress: drop,
        pickUpLocation: {
          type: "Point",
          coordinates: [pickUpLon, pickUpLat],
        },

        dropLocation: {
          type: "Point",
          coordinates: [dropLon, dropLat],
        },

        fare,
        mobileNumber: mobile,
      });

      // console.log(data);
      // setLoading(false);
      setBooking(data);
      setStatus("requested");
    } catch (error: any) {
      // setLoading(false);
      console.log(error.response.data.message);
    }
  };

  const fetchActiveBooking = async () => {
    try {
      const { data } = await axios.get("/api/booking/active");

      // console.log(data);
      setBooking(data.booking);
      setStatus(data.booking.bookingStatus || data.booking);
    } catch (error) {
      console.log(error);
    }
  };

  const loadRazorpayScript = async () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleCancel = async () => {
    try {
      const { data } = await axios.get(`/api/booking/${booking._id}/cancel`);
      setStatus("idle");
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmPayment = async () => {
    if (!booking || !paymentMethod) {
      return;
    }

    try {
      if (paymentMethod == "online") {
        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded) {
          alert("razorpay script failed to load");
        }

        const { data } = await axios.post("/api/payment/create", {
          bookingId: booking._id,
        });
        // console.log(data);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: "INR",
          name: "RYDEX",
          description: "Ride Payment",
          order_id: data.orderId,
          handler: async function (response: any) {
            const { data } = await axios.post("/api/payment/verify", {
              bookingId: booking._id,
              ...response,
            });

            if (data.success) {
              setStatus("confirmed");
              window.location.href = `/user/ride/${booking._id}`;
            }
          },
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();
      } else {
        const { data } = await axios.get(`/api/booking/${booking._id}/confirm`);

        if (data.success) {
          setStatus("confirmed");
          window.location.href = `/ride/${booking._id}`;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchActiveBooking();
  }, []);

  useEffect(() => {
    if (status !== "awaiting_payment") return;

    const t = setTimeout(() => {
      setStatus("payment");
    }, 2000);
    return () => {
      clearTimeout(t);
    };
  }, [status]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("accept-booking", (data) => {
      setStatus(data);
    });

    socket.on("reject-booking", (data) => {
      setStatus(data);
    });

    return () => {
      socket.off("accept-booking");
      socket.off("reject-booking");
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();

    socket.on("reject-booking", (data) => {
      setStatus(data);
    });
    return () => {
      socket.off("reject-booking");
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-12">
      <div className="relative max-w-6xl mx-auto z-10">
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px w-8 bg-zinc-900" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-black">
              Booking
            </span>
          </div>

          <h1 className="font-black tracking-tight text-4xl text-zinc-900">
            Checkout
          </h1>

          <p className="text-sm text-zinc-400 font-medium mt-1.5">
            Review your ride and confirm
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.08,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
          >
            <div className="h-1 bg-zinc-900" />
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-[0.18em] font-black mb-1">
                    Selected Vehicles
                  </div>
                  <div className="font-black tracking-tight text-3xl text-zinc-900">
                    {vehicle}
                  </div>
                </div>

                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <Icon className="text-white" size={28} />
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden mb-8">
                <div className="flex gap-4 px-5 py-4 border-b border-zinc-100">
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <div className="w-3 h-3 rounded-full bg-zinc-900 border-white ring ring-zinc-300" />

                    <div
                      className="w-1 flex-1 bg-zinc-300 my-1"
                      style={{ minHeight: 12 }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-[0.18em] font-black mb-0.5">
                      PickUp
                    </div>
                    <div className="text-sm font-semibold text-zinc-900 leading-snug truncate">
                      {pickUp}
                    </div>
                  </div>

                  <div>
                    <MapPin size={14} className="mt-1 shrink-0 text-zinc-400" />
                  </div>
                </div>

                <div className="flex gap-4 px-5 py-4 border-b border-zinc-100">
                  <div className="flex flex-col items-center shrink-0 pt-0.5">
                    <div className="w-3 h-3 rounded-full bg-zinc-900 border-white ring ring-zinc-300" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-zinc-400 uppercase tracking-[0.18em] font-black mb-0.5">
                      Drop
                    </div>
                    <div className="text-sm font-semibold text-zinc-900 leading-snug truncate">
                      {drop}
                    </div>
                  </div>

                  <div>
                    <Navigation
                      size={14}
                      className="mt-1 shrink-0 text-zinc-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between pt-6 border-t border-zinc-100">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-[0.18em] font-black mb-1">
                    Total Fare
                  </p>

                  <p className="text-zinc-400 text-xs font-medium">
                    Includes base + distance charges
                  </p>
                </div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="flex items-baseline gap-1"
                >
                  <span className="font-black text-lg text-zinc-400">
                    <IndianRupee size={24} />
                  </span>
                  <span className="font-black tracking-tight text-4xl text-zinc-900 leading-none">
                    {fare}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.14,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] flex flex-col"
          >
            <div className="h-1 bg-zinc-900" />

            <div className="flex-1 p-8 sm:p-10 flex flex-col">
              <AnimatePresence mode="wait">
                {(status == "idle" || status == "rejected") && (
                  <motion.div
                    key="idle"
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="flex flex-col flex-1 justify-between"
                  >
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-[0.18em] font-black mb-1">
                        Ready to Go?
                      </p>
                      <h3 className="text-2xl text-zinc-900 mb-6 font-black">
                        Confirm your ride
                      </h3>

                      <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5 space-y-6">
                        {[
                          {
                            icon: <Clock size={14} />,
                            text: "Drivers will respond within 2 minutes",
                          },
                          {
                            icon: <Shield size={14} />,
                            text: "Verified insured drivers only",
                          },
                          {
                            icon: <CreditCard size={14} />,
                            text: "Pay after driver accepts",
                          },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-xl bg-zinc-200 flex items-center justify-center shrink-0 text-zinc-500">
                              {item.icon}
                            </div>

                            <p className="text-xs font-medium text-zinc-700">
                              {item.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.04 }}
                      onClick={handleRequestBooking}
                      className="w-full h-14 mt-8 disabled:opacity-40 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white text-sm font-black rounded-2xl transition-colors shadow-md"
                    >
                      <span>Request Ride</span>
                      <ArrowRight size={14} />
                    </motion.button>
                  </motion.div>
                )}

                {status == "requested" && (
                  <motion.div
                    key="requested"
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="flex flex-col flex-1 items-center justify-center gap-6 text-center"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-zinc-900"
                      />

                      <div className="relative w-20 h-20 rounded-full bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center">
                        <Loader2
                          className="text-zinc-900 animate-spin"
                          size={28}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-zinc-900 mb-1">
                        Finding your drivers
                      </h3>
                      <p className="text-zinc-400 text-sm font-medium">
                        Waiting for driver to accept...
                      </p>
                    </div>

                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors border border-zinc-200 hover:border-zinc-400 px-4 py-2.5 rounded-xl cursor-pointer"
                      onClick={handleCancel}
                    >
                      <XCircle size={13} />
                      Cancle Request
                    </motion.div>
                  </motion.div>
                )}

                {status == "awaiting_payment" && (
                  <motion.div
                    key="awaiting_payment"
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="flex flex-col flex-1 items-center justify-center gap-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 16,
                      }}
                      className="w-20 h-20 rounded-full bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center"
                    >
                      <CheckCircle size={36} className="text-zinc-900" />
                    </motion.div>

                    <div>
                      <h3 className="text-xl font-black text-zinc-900 mb-1">
                        Driver Accepted
                      </h3>

                      <p className="text-zinc-400 text-sm font-medium">
                        Preparing payment options...
                      </p>
                    </div>

                    <div className="w-48 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-zinc-900 rounded-full"
                      />
                    </div>
                  </motion.div>
                )}

                {status == "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="flex flex-col flex-1 gap-6"
                  >
                    <div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-[0.18em] font-black mb-1">
                        Almost There
                      </p>
                      <h3 className="text-2xl font-black text-zinc-900">
                        Select Payment Method
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          id: "cash",
                          Icon: Banknote,
                          title: "Cash",
                          sub: "Pay driver after ride",
                        },
                        {
                          id: "online",
                          Icon: Wallet,
                          title: "Online Payment",
                          sub: "UPI . Card . Netbanking",
                        },
                      ].map((p, i) => {
                        const active = paymentMethod == p.id;
                        return (
                          <motion.div
                            key={p.id}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setPaymentMethod(p.id as any)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${active ? "bg-zinc-900 border-zinc-900" : "bg-zinc-50 border-zinc-200 hover:border-zinc-400"}`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${active ? "bg-white/10" : "bg-zinc-200"}`}
                            >
                              <p.Icon
                                size={18}
                                className={`${active ? "text-white" : "text-zinc-600"}`}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-bold ${active ? "text-white" : "text-zinc-900"}`}
                              >
                                {p.title}
                              </p>

                              <p
                                className={`text-xs font-medium ${active ? "text-zinc-400" : "text-zinc-700"}`}
                              >
                                {p.sub}
                              </p>
                            </div>

                            <AnimatePresence>
                              {active && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <CheckCircle
                                    size={16}
                                    className=" text-white shrink-0"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleConfirmPayment}
                      whileHover={paymentMethod ? { scale: 1.02 } : {}}
                      disabled={!paymentMethod}
                      className="w-full h-14 bg-zinc-900 hover:bg-black disabled:opacity-25 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-colors shadow-md mt-auto"
                    >
                      {paymentMethod == "cash" ? (
                        <>
                          <Banknote size={16} />
                          <span>Confirm Cash Ride</span>
                        </>
                      ) : (
                        <>
                          <span>Proceed to Payment</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {status == "confirmed" && (
                  <motion.div
                    key="confirmed"
                    initial={{ scale: 0.94, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col flex-1 items-center justify-center text-center gap-6"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 14,
                        delay: 0.1,
                      }}
                      className="relative"
                    >
                      <div className="w-24 h-24 rounded-full bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center">
                        <CheckCircle size={44} className="text-zinc-900" />
                      </div>

                      {[0, 1].map((i) => (
                        <motion.div
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 2.2 + i * 0.6, opacity: 0 }}
                          transition={{ duration: 0.9, delay: 0.2 + i * 0.15 }}
                          className="absolute inset-0 rounded-full border-2 border-zinc-900"
                        />
                      ))}
                    </motion.div>

                    <div>
                      <motion.h3
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-900 mb-1 font-black text-2xl"
                      >
                        Ride Confirmed!
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-zinc-400 text-sm font-medium max-w-xs"
                      >
                        Your driver is on the way. Track live from the ride
                        screen.
                      </motion.p>
                    </div>

                    <motion.button
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => {
                        window.location.href = `/ride/${booking._id}`;
                      }}
                      className="flex items-center gap-2.5 bg-zinc-900 hover:bg-black text-white font-black text-sm px-8 py-4 rounded-2xl transition-colors shadow-md"
                    >
                      Track Your Ride
                      <ArrowRight size={21} />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CheckOutContent;
