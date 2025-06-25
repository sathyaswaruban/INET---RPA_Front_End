"use client";

import React, { useEffect } from "react";
import "aos/dist/aos.css";
import Aos from "aos";
import LoginPage from "./auth/login/page";

export default function page() {
  useEffect(() => {
    Aos.init({
      duration: 800,
      once: false,
    });
  }, []);
  return (
    <div className="flex flex-col container gap-[40px] overflow-x-auto items-center justify-start mx-auto">
      <LoginPage></LoginPage>
    </div>
  );
}
