"use client";

import dynamic from "next/dynamic";
import celebrate from "../public/celebrate.json";
import { useState } from "react";

export default function CelebrateAnimation({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  const DynamicLottie = dynamic(() => import("lottie-react"), { ssr: false });
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50">
      <DynamicLottie
        animationData={celebrate}
        loop={false}
        onComplete={() => {
          setIsVisible(false); // Hide animation when it finishes
          onComplete?.(); // Notify parent component if needed
        }}
      />
    </div>
  );
}
