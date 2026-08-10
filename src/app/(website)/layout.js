import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./website.css";
import FloatingButtons from "@/components/FloatingButtons";

// Display Font
const fraunces = Fraunces({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: '--font-display'
});

// Body Font
const manrope = Manrope({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"],
  variable: '--font-body'
});

// Utility/Numeric Font
const ibmMono = IBM_Plex_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600"],
  variable: '--font-mono'
});

export default function WebsiteLayout({ children }) {
  return (
    <div className={`${fraunces.variable} ${manrope.variable} ${ibmMono.variable} ${manrope.className}`}>
      {children}
      <FloatingButtons />
    </div>
  );
}
