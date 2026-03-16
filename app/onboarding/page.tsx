"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { StepCompany } from "@/components/onboarding/StepCompany";
import { StepTeams } from "@/components/onboarding/StepTeams";
import { StepClients } from "@/components/onboarding/StepClients";
import { StepRecap } from "@/components/onboarding/StepRecap";
import type { CompanyFormData, ContractFormData } from "@/lib/validation/onboarding";
import type { TeamFormData } from "@/lib/validation/team";

type TeamData = TeamFormData & { id?: string };

interface ClientData {
  id?: string;
  name: string;
  address: string;
  contactPhone?: string;
  contactEmail?: string;
  lat?: number;
  lng?: number;
  contract?: ContractFormData;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [company, setCompany] = useState<CompanyFormData>({
    companyName: "",
    companyAddress: "",
    companySiret: "",
    companyPhone: "",
  });
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);

  // Load existing data + redirect if already completed
  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.onboardingCompleted) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {});

    Promise.all([
      fetch("/api/onboarding/company").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/teams").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/clients").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([companyData, teamsData, clientsData]) => {
        if (companyData) {
          setCompany({
            companyName: companyData.companyName ?? "",
            companyAddress: companyData.companyAddress ?? "",
            companySiret: companyData.companySiret ?? "",
            companyPhone: companyData.companyPhone ?? "",
          });
        }
        if (teamsData?.length > 0) setTeams(teamsData);
        if (clientsData?.length > 0) {
          setClients(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            clientsData.map((c: any) => ({
              id: c.id,
              name: c.name,
              address: c.address,
              contactPhone: c.contactPhone,
              contactEmail: c.contactEmail,
              lat: c.lat,
              lng: c.lng,
              contract: c.contract ?? undefined,
            }))
          );
        }
      })
      .catch(() => {
        setError("Impossible de charger vos données. Veuillez rafraîchir.");
      });
  }, [router]);

  const canProceed =
    step === 1
      ? company.companyName.trim().length >= 2
      : step === 2
        ? teams.length > 0
        : step === 3
          ? clients.length > 0
          : true;

  const handleNext = useCallback(async () => {
    setError(null);
    if (step === 1) {
      setLoading(true);
      try {
        const res = await fetch("/api/onboarding/company", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(company),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? "Erreur lors de la sauvegarde");
          return;
        }
        setStep(2);
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      setLoading(true);
      try {
        const res = await fetch("/api/onboarding/complete", { method: "POST" });
        if (res.ok) {
          router.push("/dashboard");
        } else {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? "Erreur lors de la finalisation");
        }
      } finally {
        setLoading(false);
      }
    }
  }, [step, company, router]);

  const handleBack = () => {
    if (step > 1) {
      setError(null);
      setStep(step - 1);
    }
  };

  return (
    <OnboardingShell
      step={step}
      totalSteps={4}
      onNext={handleNext}
      onBack={handleBack}
      canProceed={canProceed}
      loading={loading}
      nextLabel={step === 4 ? "Lancer mon planning" : undefined}
    >
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {step === 1 && <StepCompany data={company} onChange={setCompany} />}
      {step === 2 && <StepTeams teams={teams} onTeamsChange={setTeams} />}
      {step === 3 && (
        <StepClients clients={clients} onClientsChange={setClients} />
      )}
      {step === 4 && (
        <StepRecap
          data={{
            companyName: company.companyName,
            teams,
            clients,
          }}
        />
      )}
    </OnboardingShell>
  );
}
