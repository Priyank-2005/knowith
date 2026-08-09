import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import FloatingButtons from "@/components/FloatingButtons";
import AuthGuard from "@/components/AuthGuard";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains' });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${inter.className} bg-[#050505] text-white antialiased flex h-screen overflow-hidden`}>
      <AuthGuard>
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto relative print:h-auto print:overflow-visible">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505] -z-10 print:hidden" />
          {children}
        </main>
        <FloatingButtons />
      </AuthGuard>
    </div>
  );
}
