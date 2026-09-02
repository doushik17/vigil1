import { useState, useEffect } from "react";

export function useORClock(initialElapsedSeconds = 6138) { // 1h 42m 18s
  const [time, setTime] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsedSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTime(new Date());
      if (isTimerRunning) {
        setElapsedSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(clockInterval);
  }, [isTimerRunning]);

  const formatElapsedTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  const formatClockTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return {
    time,
    timeString: formatClockTime(time),
    elapsedSeconds,
    elapsedString: formatElapsedTime(elapsedSeconds),
    isTimerRunning,
    toggleTimer: () => setIsTimerRunning((r) => !r),
    resetTimer: () => setElapsedSeconds(0),
  };
}

export default useORClock;
