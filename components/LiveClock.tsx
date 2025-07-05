"use client";

import { useEffect, useState } from "react";

export default function LiveClock({ format = "hh:mm:ss a" }) {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span>
            {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            })}
        </span>
    );
}
