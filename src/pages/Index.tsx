import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CRMModule } from "@/components/modules/CRMModule";
import { TeamModule } from "@/components/modules/TeamModule";
import { FinanceModule } from "@/components/modules/FinanceModule";
import { TaskModule } from "@/components/modules/TaskModule";
import { ComplianceModule } from "@/components/modules/ComplianceModule";
import { NotificationCenter } from "@/components/modules/NotificationCenter";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { NotificationProvider } from "@/hooks/useNotifications";
import { Scene3D } from "@/components/3d/Scene3D";
import { Dashboard3D } from "@/components/3d/Dashboard3D";
import { HUD3D } from "@/components/3d/HUD3D";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [is3DMode, setIs3DMode] = useState(false);

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
      case 'compliance':
        return <ComplianceModule />;
      case 'notifications':
        return <NotificationCenter />;
      case 'tasks':
        return <TaskModule />;
      case 'analytics':
        return <AnalyticsOverview />;
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
    <NotificationProvider>
      <div className="min-h-screen bg-background">
        {is3DMode ? (
          // 3D Mode
          <div className="relative w-full h-screen overflow-hidden">
            <Scene3D>
              <Dashboard3D 
                activeModule={activeModule} 
                onModuleChange={setActiveModule} 
              />
              <HUD3D 
                activeModule={activeModule} 
                onModuleChange={setActiveModule} 
              />
            </Scene3D>
            {/* Toggle Button */}
            <div className="absolute top-4 right-4 z-50">
              <Button
                onClick={() => setIs3DMode(false)}
                variant="outline"
                className="glass-card neon-border"
              >
                Exit 3D Mode
              </Button>
            </div>
          </div>
        ) : (
          // 2D Mode (Original)
          <div className="flex">
            <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
            <main className="flex-1 p-8 relative">
              {renderModule()}
              {/* SUPER VISIBLE 3D Mode Toggle */}
              <div className="fixed bottom-4 right-4 z-[9999]">
                <div className="relative">
                  <Button
                    onClick={() => {
                      console.log("3D Mode activating...");
                      setIs3DMode(true);
                    }}
                    className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-500 hover:via-blue-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/50 transform hover:scale-105 transition-all duration-300 animate-bounce"
                  >
                    <span className="text-3xl mr-3">🚀</span>
                    ENTER 3D MODE
                  </Button>
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-xl opacity-60 -z-10 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-30 -z-20 animate-ping"></div>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </NotificationProvider>
  );
};

export default Index;
