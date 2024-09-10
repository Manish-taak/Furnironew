"use client"

import Footer from "@/component/ui/Footer";
import Header from "@/component/ui/Header";

export default function RootLayout2({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
