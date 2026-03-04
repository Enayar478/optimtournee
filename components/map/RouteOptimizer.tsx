"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const OpenStreetMap = dynamic(
  () => import("./OpenStreetMap").then((m) => m.OpenStreetMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex w-full items-center justify-center bg-gray-100"
        style={{ height: "500px" }}
      >
        Chargement de la carte...
      </div>
    ),
  }
);
import { Button } from "@/components/ui/button";
import { Waypoint, OptimizedRoute } from "@/types";
import { TrackButton } from "@/components/analytics/TrackButton";
import { MapPin, Plus, Trash2, Navigation } from "lucide-react";

export function RouteOptimizer() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(
    null
  );
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    48.8566, 2.3522,
  ]);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const newWaypoint: Waypoint = {
        id: `wp-${Date.now()}`,
        lat,
        lng,
        clientName: `Client ${waypoints.length + 1}`,
        duration: 30,
      };
      setWaypoints((prev) => [...prev, newWaypoint]);
      setOptimizedRoute(null);
    },
    [waypoints.length]
  );

  const removeWaypoint = useCallback((id: string) => {
    setWaypoints((prev) => prev.filter((wp) => wp.id !== id));
    setOptimizedRoute(null);
  }, []);

  const optimizeRoute = useCallback(async () => {
    if (waypoints.length < 2) return;

    setIsOptimizing(true);

    try {
      const response = await fetch("/api/route/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waypoints }),
      });

      if (!response.ok) throw new Error("Optimization failed");

      const result = await response.json();
      setOptimizedRoute(result);

      // Center map on first waypoint
      if (result.waypoints.length > 0) {
        setMapCenter([result.waypoints[0].lat, result.waypoints[0].lng]);
      }
    } catch (error) {
      console.error("Route optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  }, [waypoints]);

  const clearAll = useCallback(() => {
    setWaypoints([]);
    setOptimizedRoute(null);
  }, []);

  const displayWaypoints = optimizedRoute?.waypoints || waypoints;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Map */}
      <div className="lg:col-span-2">
        <OpenStreetMap
          center={mapCenter}
          waypoints={displayWaypoints}
          onMapClick={handleMapClick}
          showRoute={!!optimizedRoute}
          height="500px"
        />
        <p className="mt-2 text-sm text-gray-500">
          Cliquez sur la carte pour ajouter des points d&apos;intervention
        </p>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <MapPin className="h-4 w-4" />
            Points d&apos;intervention ({waypoints.length})
          </h3>

          {waypoints.length === 0 ? (
            <p className="text-sm text-gray-500">
              Ajoutez des points sur la carte pour commencer
            </p>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto">
              {(optimizedRoute?.waypoints || waypoints).map((wp, index) => (
                <li
                  key={wp.id}
                  className="flex items-center justify-between rounded border bg-white p-2"
                >
                  <span className="text-sm">
                    <span className="mr-2 font-mono font-bold text-green-600">
                      {index + 1}
                    </span>
                    {wp.clientName}
                  </span>
                  {!optimizedRoute && (
                    <button
                      onClick={() => removeWaypoint(wp.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {optimizedRoute && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h4 className="mb-2 font-semibold text-green-800">
              <Navigation className="mr-1 inline h-4 w-4" />
              Itinéraire optimisé
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Distance totale:</strong>{" "}
                {(optimizedRoute.totalDistance / 1000).toFixed(1)} km
              </p>
              <p>
                <strong>Temps estimé:</strong>{" "}
                {Math.round(optimizedRoute.totalDuration / 60)} min
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <TrackButton
            event="demo_route_optimized"
            properties={{ waypoint_count: waypoints.length }}
            onClick={optimizeRoute}
            disabled={waypoints.length < 2 || isOptimizing}
            className="flex-1"
            variant="primary"
            size="default"
          >
            {isOptimizing ? "Optimisation..." : "Optimiser l'itinéraire"}
          </TrackButton>

          {waypoints.length > 0 && (
            <Button onClick={clearAll} variant="outline" size="default">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
