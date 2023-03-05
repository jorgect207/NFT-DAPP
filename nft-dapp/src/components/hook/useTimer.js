import React, { useEffect, useState } from "react";

function useTimer(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return seconds;
}

export default useTimer;
