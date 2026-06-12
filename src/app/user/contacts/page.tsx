"use client";

import { motion } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  ArrowRight,
  MessageSquare,
  Headphones,
} from "lucide-react";

const contactCards = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Us",
    value: "support@rydex.app",
    description: "For general inquiries and support.",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    value: "+91 98765 43210",
    description: "Available during business hours.",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Office",
    value: "Raipur, Chhattisgarh",
    description: "Serving riders and drivers across the city.",
  },
];

const faqs = [
  {
    q: "How can I book a ride?",
    a: "Simply create an account, enter your pickup and destination, and choose the ride option that best suits your needs.",
  },
  {
    q: "How do I become a rydex driver partner?",
    a: "Visit the Driver section in the app or contact our support team. We'll guide you through the onboarding process.",
  },
  {
    q: "What if I lose an item during a trip?",
    a: "Reach out to our support team with your booking details, and we'll help coordinate with the driver.",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-linear-to-b from-slate-50 via-white to-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-blue-50 via-transparent to-violet-50" />

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
              <MessageSquare className="w-4 h-4" />
              Contact rydex
            </span>

            <h1 className="mt-8 text-5xl md:text-6xl font-black tracking-tight text-slate-900">
              We'd Love to
              <br />
              Hear From You.
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600 leading-8">
              Have a question, need support, or want to partner with us? Our
              team is here to help. Reach out anytime, and we'll get back to you
              as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {contactCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
            >
              <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                {card.icon}
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {card.title}
              </h3>

              <p className="mt-2 font-medium text-blue-600">{card.value}</p>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Get in Touch
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900">
              Send Us a Message
            </h2>

            <p className="mt-5 text-slate-600 leading-8">
              Fill out the form, and our team will get back to you as quickly as
              possible. Whether it's a support request, business inquiry, or
              feedback, we're always happy to connect.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-slate-100 p-3">
                  <Clock3 className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Support Hours</p>
                  <p className="text-sm text-slate-500">
                    Monday - Sunday • 8:00 AM - 10:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-slate-100 p-3">
                  <Headphones className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    Customer Support
                  </p>
                  <p className="text-sm text-slate-500">
                    Fast and friendly assistance for riders and drivers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-4xl border border-slate-100 bg-white p-8 shadow-sm space-y-5"
          >
            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message here..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none resize-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:scale-[1.02] transition"
            >
              Send Message
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.form>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              FAQ
            </span>

            <h2 className="mt-4 text-4xl font-black text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-14 space-y-5">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-6"
              >
                <h3 className="text-lg font-bold text-white">{faq.q}</h3>
                <p className="mt-3 text-slate-400 leading-7">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto rounded-4xl bg-linear-to-r from-blue-600 to-violet-700 p-12 text-center text-white shadow-xl">
          <h2 className="text-4xl md:text-5xl font-black">
            Let's Build Better Mobility Together
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-blue-100 leading-8">
            Whether you're a rider, driver partner, or business looking to
            collaborate, the rydex team is always ready to connect.
          </p>

          <button className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3 font-semibold text-blue-700 hover:scale-[1.02] transition">
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </main>
  );
}
