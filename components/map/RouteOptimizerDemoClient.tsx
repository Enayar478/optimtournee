"use client";

import dynamic from "next/dynamic";

const RouteOptimizerDemo = dynamic(() => import("./RouteOptimizerDemo"), {
  ssr: false,
});

export default function RouteOptimizerDemoClient() {
  return <RouteOptimizerDemo />;
}
