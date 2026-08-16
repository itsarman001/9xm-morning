import { useState, useEffect } from "react";

export function TimeDate({ className = "" }) {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 becomes 12
      const minStr = minutes < 10 ? `0${minutes}` : minutes;
      setTimeStr(`${hours}:${minStr} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`font-mono text-xs sm:text-sm font-semibold tracking-wider text-amber-100/90 select-none ${className}`}>
      {timeStr || "7:00 am"}
    </div>
  );
}
