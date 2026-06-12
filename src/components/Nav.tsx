"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModal from "./AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { Bike, Car, ChevronRight, LogOut, Menu, Truck, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { getSocket } from "@/lib/socket";

const Nav_Items = ["Home", "Bookings", "About-Us", "Contacts"];

function Nav() {
  const pathName = usePathname();
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const { userData } = useSelector((state: RootState) => state.user);

  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    dispatch(setUserData(null));
    setProfileOpen(false);
  };

  const fetchCount = async () => {
    try {
      const { data } = await axios.get(
        "/api/partner/bookings/pending-requests-count",
      );
      // console.log(data);
      setPendingCount(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?.role == "partner") {
      fetchCount();
    }
  }, [userData?.role]);

  useEffect(() => {
    const socket = getSocket();

    console.log("Connected:", socket.connected);
    console.log("Socket ID:", socket.id);

    socket.on("new-booking", (data) => {
      setPendingCount((prev) => prev + 1);
    });
    return () => {
      socket.off("new-booking");
    };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`  fixed top-3 left-1/2 -translate-x-1/2 w-[94%] md:w-[86%] z-50 rounded-full bg-[#0B0B0B] shadow-[0_15px_50px_rgba(0,0,0,0.7)] text-white py-4`}
      >
        <div className="mx-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <Image src={"/logo.png"} width={44} height={44} priority alt="Logo" />

          <div className="hidden md:flex items-center gap-10">
            {userData?.role == "partner" ? (
              <>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/"}
                >
                  Home
                </Link>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/partner/pending-requests"}
                >
                  Pending Requests
                  <span className="absolute -top-1.5 -right-4 w-4 h-4 bg-white text-black text-xs rounded-full flex items-center justify-center font-bold">
                    {pendingCount ?? 0}
                  </span>
                </Link>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/partner/bookings"}
                >
                  Bookings
                </Link>
                <Link
                  className="relative text-sm font-medium text-gray-300 hover:text-white transition"
                  href={"/partner/active-ride"}
                >
                  Active Ride
                </Link>
              </>
            ) : (
              Nav_Items.map((i, index) => {
                let href;
                if (i == "Home") {
                  href = "/";
                } else {
                  href = `/user/${i.toLowerCase()}`;
                }
                const active = href == pathName;
                return (
                  <Link
                    href={href}
                    key={index}
                    className={`text-sm font-medium transition ${active ? "text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    {i}
                  </Link>
                );
              })
            )}
          </div>

          <div className=" flex items-center gap-3 relative">
            <div className="hidden md:block relative">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full bg-white text-black text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 bg-white text-black rounded-full font-bold"
                    onClick={() => setProfileOpen((p) => !p)}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-14 right-0 w-75 bg-white text-black rounded-2xl shadow-xl border"
                      >
                        <div className="p-5">
                          <p className="text-lg uppercase font-semibold">
                            {" "}
                            {userData.name}{" "}
                          </p>

                          <p className="text-xs uppercase text-gray-500 mb-4">
                            {" "}
                            {userData.role}{" "}
                          </p>

                          {userData.role != "partner" && (
                            <div
                              className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl"
                              onClick={() =>
                                router.push("/partner/onboarding/vehicle")
                              }
                            >
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Bike size={16} />
                                </div>

                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Car size={16} />
                                </div>

                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                                  <Truck size={16} />
                                </div>
                              </div>
                              Become a Partner
                              <ChevronRight size={18} className="ml-auto" />
                            </div>
                          )}

                          <button
                            className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2"
                            onClick={handleLogout}
                          >
                            {" "}
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* for mobile */}

            <div className="md:hidden">
              {!userData ? (
                <button
                  className="px-4 py-1.5 rounded-full bg-white text-black text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    className="w-11 h-11 bg-white text-black rounded-full font-bold"
                    onClick={() => setProfileOpen((p) => !p)}
                  >
                    {userData.name.charAt(0).toUpperCase()}
                  </button>
                </>
              )}
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen((p) => !p)}
            >
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-21.25 left-1/2 -translate-x-1/2 w-[92%] bg-[#0B0B0B] rounded-2xl shadow-2xl overflow-hidden z-40 md:hidden"
            >
              {/* <div className="flex flex-col divide-y divide-white/10">
                {Nav_Items.map((i, index) => {
                  let href;
                  if (i == "Home") {
                    href = "/";
                  } else {
                    href = `/user/${i.toLowerCase()}`;
                  }
                  return (
                    <Link
                      href={href}
                      key={index}
                      className="px-6 py-4 text-gray-300 hover:bg-white"
                    >
                      {i}
                    </Link>
                  );
                })}
              </div> */}

              <div className="flex flex-col divide-y divide-white/10">
                {userData?.role === "partner" ? (
                  <>
                    <Link
                      href="/"
                      className="px-6 py-4 text-gray-300 hover:bg-white hover:text-black transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Home
                    </Link>

                    <Link
                      href="/partner/pending-requests"
                      className="flex items-center justify-between px-6 py-4 text-gray-300 hover:bg-white hover:text-black transition"
                      onClick={() => setMenuOpen(false)}
                    >
                       <span>Pending Requests</span>
                      <span className="w-5 h-5 rounded-full bg-white text-black text-xs flex items-center justify-center font-bold">
                        {pendingCount ?? 0}
                      </span>
                    </Link>

                    <Link
                      href="/partner/bookings"
                      className="px-6 py-4 text-gray-300 hover:bg-white hover:text-black transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Bookings
                    </Link>

                    <Link
                      href="/partner/active-ride"
                      className="px-6 py-4 text-gray-300 hover:bg-white hover:text-black transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Active Ride
                    </Link>
                  </>
                ) : (
                  Nav_Items.map((i, index) => {
                    const href =
                      i === "Home" ? "/" : `/user/${i.toLowerCase()}`;

                    return (
                      <Link
                        href={href}
                        key={index}
                        className="px-6 py-4 text-gray-300 hover:bg-white hover:text-black transition"
                        onClick={() => setMenuOpen(false)}
                      >
                        {i}
                      </Link>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {profileOpen && userData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />

            <motion.div
              initial={{ y: 400 }}
              animate={{ y: 0 }}
              exit={{ y: 400 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden"
            >
              <div className="p-5">
                <p className="text-lg uppercase font-semibold">
                  {" "}
                  {userData.name}{" "}
                </p>

                <p className="text-xs uppercase text-gray-500 mb-4">
                  {" "}
                  {userData.role}{" "}
                </p>

                {userData.role != "partner" && (
                  <div
                    className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl"
                    onClick={() => router.push("/partner/onboarding/vehicle")}
                  >
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Bike size={16} />
                      </div>

                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Car size={16} />
                      </div>

                      <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                        <Truck size={16} />
                      </div>
                    </div>
                    Become a Partner
                    <ChevronRight size={18} className="ml-auto" />
                  </div>
                )}

                <button
                  className="w-full flex items-center gap-3 py-3 hover:bg-gray-100 rounded-xl mt-2"
                  onClick={handleLogout}
                >
                  {" "}
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default Nav;
