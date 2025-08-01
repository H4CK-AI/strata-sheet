import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CRMModule } from "@/components/modules/CRMModule";
import { TeamModule } from "@/components/modules/TeamModule";
import { FinanceModule } from "@/components/modules/FinanceModule";
import { TaskModule } from "@/components/modules/TaskModule";

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'clients':
        return <CRMModule />;
      case 'team':
        return <TeamModule />;
      case 'finance':
        return <FinanceModule />;
      case 'tasks':
        return <TaskModule />;
      case 'analytics':
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-xl font-semibold gradient-text mb-2">Analytics Module</h3>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-xl font-semibold gradient-text mb-2">{activeModule} Module</h3>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <main className="flex-1 p-8">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default Index;
