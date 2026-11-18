import DashboardHeader from "@/components/dashboard/shared/dashboardHeader";
import DashboardSidebar from "@/components/dashboard/shared/dashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

/**
 * Dashboard shell: sidebar on the left, page content on the right.
 *
 * Structure only — no role/permission guards here yet.
 */
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <TooltipProvider>
        
        <DashboardSidebar />
        <SidebarInset>
            <DashboardHeader></DashboardHeader>
            {children}
            
            </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default DashboardLayout;
