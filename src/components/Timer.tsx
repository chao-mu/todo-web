"use client";

// react-timer-hook
import { useStopwatch } from "react-timer-hook";

// Ours
import styles from "./Timer.module.css";

export function Timer() {
  const { seconds, minutes, hours, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  const formatTime = (num: number): string => num.toString().padStart(2, "0");

  return (
    <div className={styles["timer"]}>
      <div className={styles["timer__time"]}>
        {formatTime(hours)}h:{formatTime(minutes)}m:{formatTime(seconds)}s
      </div>
      <div className={styles["timer__action-row"]}>
        <button onClick={() => start()}>Start</button>
        <button onClick={() => pause()}>Pause</button>
        <button onClick={() => reset()}>Reset</button>
      </div>
    </div>
  );
}
