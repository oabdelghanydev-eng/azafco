/**
 * Secure Certificate Verification Registry
 * 
 * Maps cryptographic tokens to certificate data.
 * Each token is a 128-bit random hex string (3.4×10³⁸ possible combinations).
 * 
 * SECURITY:
 * - Tokens are unguessable — brute-force is computationally infeasible
 * - To revoke a certificate link: delete its entry from this map
 * - This file is the SINGLE SOURCE OF TRUTH for all verification data
 * 
 * @see app/v/[token]/page.tsx — the verification page that renders this data
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface TrainingModule {
  title: string;
  description: string;
}

export interface CertificateRecord {
  /** Certificate holder full name */
  holder: string;
  /** Training program official title */
  program: string;
  /** Short abbreviation shown as badge */
  abbreviation: string;
  /** Training start date (ISO format for display) */
  startDate: string;
  /** Training end date (ISO format for display) */
  endDate: string;
  /** Human-readable duration */
  duration: string;
  /** Training curriculum modules */
  modules: TrainingModule[];
  /** Certificate issue timestamp for verification display */
  issuedDate: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CERTIFICATE REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

export const certificateRegistry: Record<string, CertificateRecord> = {

  // ─────────────────────────────────────────────────────────────────────────
  // QR Code #1 — IoT Engineering Certificate
  // ─────────────────────────────────────────────────────────────────────────
  '7a3f9c2e8b1d4e6f0a5c3b7d9e2f1a8c': {
    holder: 'Omar Abdelghany Mohamed Abdelghany',
    program: 'Internet of Things (IoT) Engineering',
    abbreviation: 'IoT',
    startDate: 'August 10, 2025',
    endDate: 'September 10, 2025',
    duration: 'One Month (Intensive)',
    modules: [
      {
        title: 'Remote Industrial Control',
        description: 'Operating water motors and heavy pumps remotely via Contactors integrated with ESP8266 (NodeMCU) over Wi-Fi.',
      },
      {
        title: 'Microcontroller Programming',
        description: 'Developing firmware to bridge industrial hardware with modern web applications and dashboards.',
      },
      {
        title: 'Sensors & Telemetry',
        description: 'Deployment of environmental sensors for automated quality control and smart logistics monitoring.',
      },
      {
        title: 'Data Protocols & Automation',
        description: 'Utilizing IoT protocols (MQTT/HTTP) for real-time alerting and automated industrial workflows.',
      },
    ],
    issuedDate: 'September 10, 2025',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // QR Code #2 — AI Applied Engineering Certificate
  // ─────────────────────────────────────────────────────────────────────────
  'd4e8f2a6c0b3e7d1f5a9c2e6b8d0f4a3': {
    holder: 'Omar Abdelghany Mohamed Abdelghany',
    program: 'Artificial Intelligence (AI) Applied Engineering',
    abbreviation: 'AI',
    startDate: 'February 15, 2026',
    endDate: 'March 15, 2026',
    duration: 'One Month (Intensive)',
    modules: [
      {
        title: 'AI-Driven SDLC Integration',
        description: 'Embedding LLMs and Copilots across the software lifecycle to accelerate web app delivery and ensure scalable system design.',
      },
      {
        title: 'Autonomous AI Agents',
        description: 'Orchestrating intelligent agents for automated code generation, complex refactoring, and systematic repository debugging.',
      },
      {
        title: 'Cloud & Backend AI',
        description: 'Optimizing cloud services, serverless databases, and modern API architectures using next-generation AI developer tools.',
      },
      {
        title: 'AI-Powered CI/CD',
        description: 'Streamlining production deployments and version control workflows via AI-assisted automated error resolution.',
      },
    ],
    issuedDate: 'March 15, 2026',
  },
};
