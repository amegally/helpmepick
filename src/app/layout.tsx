import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WizardProvider } from "./components/wizard/WizardContext";
import { DebugEnv } from './components/DebugEnv';
import Footer from './components/Footer';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Help Me Pick - Find the best product for you — fast, easy, and personalized.",
  description: "Get personalized product recommendations through an interactive wizard experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-black relative flex flex-col`}>
        <div className="absolute inset-0 bottom-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent dark:from-purple-900/10" />
        <div className="relative flex-grow z-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16">
            <main className="max-w-4xl mx-auto">
              <DebugEnv />
              <WizardProvider>
                {children}
              </WizardProvider>
            </main>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
