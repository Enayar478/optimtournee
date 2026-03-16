"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Leaf } from "lucide-react";

interface OnboardingShellProps {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  loading?: boolean;
  nextLabel?: string;
  children: React.ReactNode;
}

const STEP_LABELS = [
  "Mon entreprise",
  "Mes équipes",
  "Mes clients",
  "Récapitulatif",
];

export function OnboardingShell({
  step,
  totalSteps,
  onNext,
  onBack,
  canProceed,
  loading,
  nextLabel,
  children,
}: OnboardingShellProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-green-50/30">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2D5A3D] to-[#3D7A52]">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              OptimTournée
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Étape {step} sur {totalSteps}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-[#2D5A3D] to-[#4A90A4]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Stepper */}
      <div className="mx-auto flex w-full max-w-4xl gap-2 px-6 pt-6">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === step;
          const isDone = stepNum < step;
          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                  isDone
                    ? "bg-[#2D5A3D] text-white"
                    : isActive
                      ? "bg-[#2D5A3D] text-white ring-4 ring-[#2D5A3D]/20"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isDone ? "✓" : stepNum}
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-[#2D5A3D]" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <button
            onClick={onBack}
            disabled={step <= 1}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 disabled:invisible"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed || loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2D5A3D] to-[#3D7A52] px-6 py-2.5 text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : null}
            {nextLabel ?? "Suivant"}
            {!nextLabel && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
}
