import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  DollarSign, 
  BarChart3, 
  FileText,
  Package,
  Kanban,
  TrendingUp,
  Brain,
  Shield
} from "lucide-react";

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'CRM', icon: Users },
  { id: 'team', label: 'Team', icon: UserCog },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: FileText },
  { id: 'tasks', label: 'Tasks', icon: Kanban },
];

export const Sidebar = ({ activeModule, onModuleChange }: SidebarProps) => {
  return (
    <div className="glass-card h-full w-64 p-6 border-r border-border/30">
      <div className="flex items-center space-x-2 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-lg glow-cyan"></div>
        <h1 className="text-xl font-bold gradient-text">OpsCore</h1>
      </div>
      
      <nav className="space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Button
              key={module.id}
              variant={activeModule === module.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start transition-smooth",
                activeModule === module.id 
                  ? "bg-primary text-primary-foreground glow-cyan" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
              onClick={() => onModuleChange(module.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {module.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};