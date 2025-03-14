import Lottie from "lottie-react";
import celebrate from "../../public/celebrate.json";
import { useEffect, useState } from "react";

export default function CelebrateAnimation({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    console.log("CelebrateAnimation rendered");
  }, []);

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50">
      <Lottie
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
