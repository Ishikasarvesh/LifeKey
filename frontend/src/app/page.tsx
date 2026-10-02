"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LifecycleFlow from "@/components/LifecycleFlow";
import WalletShowcase from "@/components/WalletShowcase";
import CredentialIntelligenceSection from "@/components/CredentialIntelligenceSection";
import SecuritySection from "@/components/SecuritySection";
import PurposeBoundSharing from "@/components/PurposeBoundSharing";
import LifeStageTimeline from "@/components/LifeStageTimeline";
import QRVerificationSection from "@/components/QRVerificationSection";
import TamperDemo from "@/components/TamperDemo";
import RevocationTimeline from "@/components/RevocationTimeline";
import VerificationHistory from "@/components/VerificationHistory";
import SmartDigitizerSection from "@/components/SmartDigitizerSection";
import SecurityArchitectureSection from "@/components/SecurityArchitectureSection";
import StandardsRoadmapSection from "@/components/StandardsRoadmapSection";
import BusinessModelSection from "@/components/BusinessModelSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import CompareRecordsModal from "@/components/CompareRecordsModal";
import { RecordComparison } from "@/lib/api";

export default function Home() {
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Realistic sample comparison record for live modal interaction
  const demoComparison: RecordComparison = {
    record_a_id: "cred_djs_2026_canonical",
    record_a_title: "B.Tech in Information Technology (Institutional Record)",
    record_b_id: "cred_djs_2025_candidate",
    record_b_title: "B.Tech in Information Technology (Candidate Upload)",
    comparison_fields: [
      {
        field_name: "Holder Name",
        field_key: "holder_name",
        record_a_value: "Parth Patil",
        record_b_value: "Parth Patil",
        is_conflict: false,
        is_match: true,
      },
      {
        field_name: "Degree Title",
        field_key: "title",
        record_a_value: "Bachelor of Technology",
        record_b_value: "Bachelor of Technology",
        is_conflict: false,
        is_match: true,
      },
      {
        field_name: "Major / Specialization",
        field_key: "major",
        record_a_value: "Information Technology",
        record_b_value: "Information Technology",
        is_conflict: false,
        is_match: true,
      },
      {
        field_name: "Graduation Year",
        field_key: "graduation_year",
        record_a_value: "2026",
        record_b_value: "2025",
        is_conflict: true,
        is_match: false,
      },
      {
        field_name: "Registration ID",
        field_key: "reg_id",
        record_a_value: "DJS-2022-IT-084",
        record_b_value: "DJS-2022-IT-084",
        is_conflict: false,
        is_match: true,
      },
      {
        field_name: "Issuer Institution",
        field_key: "institution_name",
        record_a_value: "D. J. Sanghvi College of Engineering",
        record_b_value: "D. J. Sanghvi College of Engineering",
        is_conflict: false,
        is_match: true,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-[#11152E] flex flex-col selection:bg-[#5B5BEF] selection:text-white">
      {/* 1. Global Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section with 3D Credential Orbit */}
        <HeroSection />

        {/* 3. Product Lifecycle Flow: ISSUE -> OWN -> SHARE -> VERIFY */}
        <LifecycleFlow />

        {/* 4. LifeKey Wallet Section */}
        <WalletShowcase />

        {/* 5. Credential Intelligence Section (Deep Navy) */}
        <CredentialIntelligenceSection
          onOpenCompareModal={() => setCompareModalOpen(true)}
        />

        {/* 6. Security Section (SHA-256, RSA-PSS, Revocation, Selective Disclosure) */}
        <SecuritySection />

        {/* 7. Purpose-Bound Sharing & Selective Disclosure */}
        <PurposeBoundSharing />

        {/* 8. Life-Stage Continuity (Education -> Skills -> Employment -> Achievements) */}
        <LifeStageTimeline />

        {/* 9. QR Verification & Interactive Verification Simulator */}
        <QRVerificationSection />

        {/* 10. Real-Time Tamper Detection Lab (2026 -> 2025) */}
        <TamperDemo />

        {/* 11. Dynamic Revocation & Reinstatement Timeline */}
        <RevocationTimeline />

        {/* 12. Verification & Audit History Ledger */}
        <VerificationHistory />

        {/* 13. Smart Camera / Document Digitizer Pipeline */}
        <SmartDigitizerSection />

        {/* 14. Decentralized Trust Architecture (6-node chain) */}
        <SecurityArchitectureSection />

        {/* 15. Standards & Interoperability Roadmap */}
        <StandardsRoadmapSection />

        {/* 16. Business Model & Phased Development Roadmap */}
        <BusinessModelSection />

        {/* 17. Final Call-to-Action */}
        <FinalCTA />
      </main>

      {/* 18. Minimal Footer */}
      <Footer />

      {/* Modal: Interactive Compare Records / Human Review Signal */}
      {compareModalOpen && (
        <CompareRecordsModal
          comparison={demoComparison}
          onClose={() => setCompareModalOpen(false)}
          onAcknowledge={() => setCompareModalOpen(false)}
          issues={[
            {
              type: "conflict",
              severity: "warning",
              status: "REVIEW_REQUIRED",
              message: "Graduation year mismatch: 2026 in registered institution record vs 2025 in candidate file.",
              field: "graduation_year",
              value_1: "2026",
              value_2: "2025",
              action: "Institutional review recommended",
            },
            {
              type: "similar",
              severity: "low",
              status: "REVIEW_SIGNAL",
              message: "92% token similarity detected between records across academic fields.",
              action: "Verify if record represents duplicate issuance or curriculum revision",
            },
          ]}
        />
      )}
    </div>
  );
}
