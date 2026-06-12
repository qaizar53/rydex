"use client";

import {
  Bike,
  Car,
  Clock,
  IndianRupee,
  MessageCircle,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import RideChat from "./RideChat";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";

function PanelContent({
  isActive,
  displayDistance,
  displayEta,
  cfg,
  status,
  bookings,
  paymentStatus,
  canchat,
  chatOpen,
  onChatToggle,
}: any) {
  const { userData } = useSelector((state: RootState) => state.user);

  // let currentRole;

  // useEffect(() => {
  //   if (userData) {
  //     currentRole = userData._id === bookings.driver._id ? "driver" : "user";
  //   }
  // }, [userData?._id]);

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType?.toLowerCase()) {
      case "bike":
        return <Bike className="text-white" size={18} />;

      case "auto":
        return <Car className="text-white" size={18} />;

      case "truck":
        return <Truck className="text-white" size={18} />;

      case "loading":

      case "car":

      default:
        return <Car className="text-white" size={18} />;
    }
  };

  const currentRole =
    userData?._id === bookings?.driver?._id ? "driver" : "user";

  return (
    <div className="flex flex-col pt-5 gap-3">
      {isActive && (
        <div className="mx-5 lg:mx-6 grid grid-cols-2 gap-2">
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
              <Clock className="text-zinc-600" size={16} />
            </div>

            <div>
              <p className="text-zinc-400 uppercase tracking-wider font-semibold text-[10px]">
                ETA
              </p>
              <p className="text-zinc-900 font-black text-lg leading-none mt-0.5">
                {Math.round(displayEta)}
                <span className="text-xs font-normal text-zinc-400 ml-0.5">
                  Minutes
                </span>
              </p>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <IndianRupee className="text-white" size={16} />
            </div>

            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                Fare
              </p>
              <p className="text-white text-lg font-black leading-none mt-0.5">
                {bookings.fare || "-"}
              </p>
            </div>
          </div>
        </div>
      )}

      {bookings?.user && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-5 lg:mx-6"
        >
          <div className="bg-zinc-950 rounded-2xl p-4 flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center">
                <User size={26} className=" text-zinc-300" />
              </div>

              <div className="absolute -bottom-1 -right-1 bg-emerald-400 w-4 h-4 rounded-full border-2 border-zinc-950" />
            </div>

            <div className="shrink-0 flex-1">
              <div className="flex items-center gap-2 justify-between">
                <p className="text-white font-bold text-base truncate">
                  {bookings?.user?.name || "Customer"}
                </p>

                <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full shrink-0">
                  <IndianRupee size={10} className="text-amber-400" />
                  <span className="text-white text-sm font-sembold">
                    {bookings.fare}
                  </span>
                </div>
              </div>

              {bookings.paymentStatus && (
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${paymentStatus.cls ?? "bg-zinc-700 text-zinc-300"}`}
                  >
                    {paymentStatus.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {isActive && (
            <div className="flex gap-2 mt-2">
              {bookings.userMobileNumber && (
                <a
                  className={`flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 active:scale-[0.97] transition-all text-zinc-900 py-3 rounded-xl text-sm font-semibold ${canchat ? "flex-1" : "w-full"}`}
                  href={`tel:${bookings.userMobileNumber}`}
                >
                  <Phone size={15} />
                  Call
                </a>
              )}

              {canchat && (
                <button
                  onClick={onChatToggle}
                  className={`flex-1 flex items-center justify-center gap-2 active:scale-[0.97] transition-all py-3 rounded-xl text-sm font-semibold ${chatOpen ? "bg-zinc-200 text-zinc-900" : "bg-zinc-900 hover:bg-zinc-800 text-white"}`}
                >
                  <MessageCircle size={15} />
                  {chatOpen ? "Close Chat" : "Message"}
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {chatOpen && canchat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-5 lg:mx-6"
          >
            <div className="rounded-2xl overflow-hidden border border-zinc-100 h-[70vh] flex flex-col">
              {currentRole}
              <RideChat
                currentRole={currentRole}
                bookingId={bookings._id}
                userName={bookings?.user?.name || "Customer"}
                driverName={bookings?.driver?.name || "Driver"}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {bookings?.vehicle && (
        <div className="mx-5 lg:mx-6">
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
              {getVehicleIcon(bookings.vehicle.type)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                Your Vehicle{" "}
              </p>
              <p className="text-sm font-bold text-zinc-900 truncate">
                {bookings.vehicle.vehicleModel ?? "vehicle"}
              </p>
            </div>

            <div className=" shrink-0 bg-zinc-900 px-3 py-1.5 rounded-lg">
              <p className="text-xs font-mono font-black text-white tracking-widest">
                {bookings.vehicle.number ?? "number"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mx- lg:mx-6">
        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="flex gap-3 p-4 border-b border-zinc-100">
            <div className="flex flex-col items-center shrink-0 pt-1">
              <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow-sm" />
              <div className="w-px bg-zinc-200 mt-1" style={{ height: 20 }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                Pick Up
              </p>

              <p className="text-sm text-zinc-800 leading-snug">
                {bookings?.pickUpAddress} 
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-4 border-b border-zinc-100">
            <div className="flex flex-col items-center shrink-0 pt-1">
              <div className="w-3 h-3 rounded-full bg-zinc-900 border-2 border-white shadow-sm" />
              <div className="w-px bg-zinc-200 mt-1" style={{ height: 20 }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-0.5">
                Drop
              </p>

              <p className="text-sm text-zinc-800 leading-snug">
                {bookings?.dropAddress} 
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PanelContent;
