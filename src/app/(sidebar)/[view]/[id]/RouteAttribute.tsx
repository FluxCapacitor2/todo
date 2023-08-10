"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { useEffect } from "react";

export const RouteAttribute = () => {
  const segments = useSelectedLayoutSegments();

  useEffect(() => {
    document.body.setAttribute("data-route", segments[0]);
  }, [segments]);

  return <></>;
};
