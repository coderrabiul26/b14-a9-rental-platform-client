import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@base-ui/react';
import { Badge } from "@/components/ui/badge";
import React from 'react';

const DashboardHeader = () => {
    return (
        <div>
            <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-5" />
        <h1 className="text-base font-semibold tracking-tight">Dashboard</h1>
        <Badge variant="outline" className="ml-auto">
          Demo
        </Badge>
      </header>
        </div>
    );
};

export default DashboardHeader;