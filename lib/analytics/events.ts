/**
 * Analytics Events Reference
 * 
 * Événements trackés dans PostHog
 */

export const AnalyticsEvents = {
  // Landing Page
  LANDING_HERO_VIEW: "landing_hero_view",
  LANDING_FEATURES_VIEW: "landing_features_view",
  LANDING_PRICING_VIEW: "landing_pricing_view",
  
  // CTA
  CTA_HERO_CLICK: "cta_hero_click",
  CTA_DEMO_CLICK: "cta_demo_click",
  CTA_PRICING_CLICK: "cta_pricing_click",
  CTA_NAV_CLICK: "cta_nav_click",
  CTA_CALCULATOR_CLICK: "cta_calculator_click",
  
  // Demo
  DEMO_PAGE_VIEW: "demo_page_view",
  DEMO_MAP_INTERACTION: "demo_map_interaction",
  DEMO_POINT_ADDED: "demo_point_added",
  DEMO_POINT_REMOVED: "demo_point_removed",
  DEMO_ROUTE_OPTIMIZED: "demo_route_optimized",
  DEMO_WEATHER_TOGGLE: "demo_weather_toggle",
  
  // Signup Intent
  SIGNUP_INTENT: "signup_intent",
  SIGNUP_FORM_START: "signup_form_start",
  SIGNUP_FORM_SUBMIT: "signup_form_submit",
  
  // Navigation
  NAV_LINK_CLICK: "nav_link_click",
  NAV_CTA_CLICK: "nav_cta_click",
  FOOTER_LINK_CLICK: "footer_link_click",
  
  // Calculator
  CALCULATOR_INTERACTION: "calculator_interaction",
  CALCULATOR_VEHICLE_CHANGE: "calculator_vehicle_change",
  CALCULATOR_KM_CHANGE: "calculator_km_change",
  CALCULATOR_FUEL_CHANGE: "calculator_fuel_change",
} as const;

export type AnalyticsEvent = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];
