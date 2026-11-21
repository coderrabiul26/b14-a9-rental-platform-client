import Header from "@/components/shared/header";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
