"use client";
import { AnimatePresence, motion } from "motion/react";

import { IVehicle } from "@/models/vehicle.model";
import { useEffect, useState } from "react";
import { ImagePlus, IndianRupee, X } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

type PropsType = {
  open: boolean;
  onClose: () => void;
  data: IVehicle | null;
};

function PricingModal({ open, onClose, data }: PropsType) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [baseFare, setBaseFare] = useState("");
  const [pricePerKM, setPricePerKM] = useState("");
  const [waitingCharge, setWaitingCharge] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setPreview(data?.imageUrl || null);
      setBaseFare(data.baseFare?.toString() || "");
      setPricePerKM(data.pricePerKM?.toString() || "");
      setWaitingCharge(data.waitingCharge?.toString() || "");
    }
  }, [data]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formdata = new FormData();

      formdata.append("baseFare", baseFare);
      formdata.append("pricePerKM", pricePerKM);
      formdata.append("waitingCharge", waitingCharge);

      if (image) {
        formdata.append("image", image);
      }

      const { data } = await axios.post(
        "/api/partner/onboarding/pricing",
        formdata,
      );
      console.log(data);
      setLoading(false);
      onClose();
    } catch (error: any) {
      console.log(error.response.data.message ?? error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b relative">
              <h2 className="text-xl font-bold">Pricing and Vehicle Image</h2>

              <div
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-700 cursor-pointer"
              >
                <X size={28} />
              </div>
            </div>

            <div className="p-6 space-y-6">
              <label
                htmlFor="imageLabel"
                className="relative h-44 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer"
              >
                {!preview ? (
                  <ImagePlus size={28} />
                ) : (
                  <img
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    src={preview}
                  />
                )}

                <input
                  id="imageLabel"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setImage(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </label>

              <div>
                <p className="text-sm font-semibold mb-1 ">Base Fare</p>
                <div className="flex items-center gap-2 border rounded-xl px-4 py-3 bg-white">
                  <IndianRupee size={18} />
                  <input
                    type="text"
                    placeholder="Base Fare"
                    value={baseFare}
                    onChange={(e) => setBaseFare(e.target.value)}
                    className="w-full outline-none"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1 ">Price Per KM</p>
                <div className="flex items-center gap-2 border rounded-xl px-4 py-3 bg-white">
                  <IndianRupee size={18} />
                  <input
                    type="text"
                    placeholder="Price Per KM"
                    value={pricePerKM}
                    onChange={(e) => setPricePerKM(e.target.value)}
                    className="w-full outline-none"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1 ">Waiting Charge</p>
                <div className="flex items-center gap-2 border rounded-xl px-4 py-3 bg-white">
                  <IndianRupee size={18} />
                  <input
                    type="text"
                    placeholder="Waiting Charge"
                    value={waitingCharge}
                    onChange={(e) => setWaitingCharge(e.target.value)}
                    className="w-full outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border rounded-xl py-2"
              >
                Cancel
              </button>
              <button
                className="flex-1 justify-center items-center bg-black text-white rounded-xl py-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {!loading ? "Continue" : "Saving..."}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PricingModal;
