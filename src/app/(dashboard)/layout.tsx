import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";
import "./dashboard.css";

// Same typefaces as the public website so the tools read as one brand
const fraunces = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: '--font-display' });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: '--font-body' });
const ibmMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: '--font-brand-mono' });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`dashboard-root ${fraunces.variable} ${manrope.variable} ${ibmMono.variable} ${manrope.className} bg-[var(--ink)] text-white antialiased min-h-screen relative`}>
      <AuthGuard>
        <Sidebar />
        {/* Fixed-height scroll area: chat tools fill it (input pinned to the bottom); admin pages scroll inside it */}
        <main className="lg:ml-[260px] pt-14 lg:pt-0 h-[100dvh] overflow-y-auto bg-[#050505] print:ml-0 print:pt-0 print:h-auto print:overflow-visible print:bg-white">
          {children}
        </main>
      </AuthGuard>
    </div>
  );
}
