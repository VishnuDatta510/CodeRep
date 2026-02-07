import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from "next/font/google";

import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeRep - Spaced Repetition for LeetCode",
  description:
    "Never forget a LeetCode problem again. CodeRep uses spaced repetition to schedule your reviews at the perfect time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          footerAction__signIn: "hidden",
          footerAction__signUp: "hidden",
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
          card: "shadow-lg",
          // Hide development mode badge
          footer: "hidden",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
