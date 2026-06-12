"use client";

import { useState } from "react";
import AuthModal from "./AuthModal";
import HeroSection from "./HeroSection";
import VehicleSlider from "./VehicleSlider";

function PublicHome() {
  const [authOen, setAuthOpen] = useState(false);

  return (
    <>
      <HeroSection onAuthRequired={() => setAuthOpen(true)} />
      <VehicleSlider />
      <AuthModal open={authOen} onClose={() => setAuthOpen(false)} />
    </>
  );
}

export default PublicHome;
