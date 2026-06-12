"use client";

import { motion } from "motion/react";
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <div className="bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-wide">RYDEX</h2>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              Book any vehicle - from bikes to trucks. Trusted Owners.
              Transparent pricing.
            </p>

            <div className="flex gap-4 mt-6">
              {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map(
                (Icon, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3 }}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition cursor-pointer"
                  >
                    <Icon />
                  </motion.div>
                ),
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">
                Browse Vehicles
              </li>
              <li className="hover:text-white cursor-pointer">
                Become a Partner
              </li>
              <li className="hover:text-white cursor-pointer">About Us</li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">Bike Rentals</li>
              <li className="hover:text-white cursor-pointer">Car Rentals</li>
              <li className="hover:text-white cursor-pointer">Truck Booking</li>
              <li className="hover:text-white cursor-pointer">
                Corporate Rentals
              </li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get latest updates and offers.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 text-sm bg-white/10 border border-white/20 rounded-l-md outline-none"
              />
              <button className="px-4 py-2 bg-white text-black text-sm rounded-r-md hover:bg-gray-200 transition">
                Subscribe
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p>Email: support@rydex.com</p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-6">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} RYDEX. All rights reserved.</p>

            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-white cursor-pointer">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Footer;
