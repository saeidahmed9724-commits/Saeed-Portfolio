import { useEffect, useState } from "react";

export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    const checkTouch = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const noHover = window.matchMedia("(hover: none)").matches;
      setIsTouch(coarse || noHover);
    };

    checkTouch();

    const mediaQuery = window.matchMedia("(pointer: coarse)");
    mediaQuery.addEventListener("change", checkTouch);
    return () => {
      mediaQuery.removeEventListener("change", checkTouch);
    };
  }, []);

  return isTouch;
}
