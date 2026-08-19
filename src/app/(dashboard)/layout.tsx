import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
// @ts-ignore
import FloatingButtons from "@/components/FloatingButtons";
// @ts-ignore
import AuthGuard from "@/components/AuthGuard";
import "../(website)/website.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: '--font-jetbrains' });

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${inter.className} bg-[var(--ink)] text-white antialiased flex h-screen overflow-hidden`}>
      <AuthGuard>
        <Sidebar />
        <main className="flex-1 h-screen overflow-y-auto relative print:h-auto print:overflow-visible">
          {children}
        </main>
        <FloatingButtons />
      </AuthGuard>
    </div>
  );
}
