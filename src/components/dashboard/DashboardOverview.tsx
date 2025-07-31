import { KPICard } from "./KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { googleSheetsService } from "@/lib/google-sheets";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
  totalClients: number;
  monthlyRevenue: number;
  activeProjects: number;
  teamSize: number;
  revenueGrowth: number;
  clientGrowth: number;
}

export const DashboardOverview = () => {
  const [data, setData] = useState<DashboardData>({
    totalClients: 0,
    monthlyRevenue: 0,
    activeProjects: 0,
    teamSize: 0,
    revenueGrowth: 0,
    clientGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load clients data
      const clientsData = await googleSheetsService.readSheet('Clients!A:H');
      const totalClients = Math.max(0, clientsData.length - 1); // Subtract header row
      
      // Load team data
      const teamData = await googleSheetsService.readSheet('Team!A:G');
      const teamSize = Math.max(0, teamData.length - 1);
      
      // Load finance data
      const financeData = await googleSheetsService.readSheet('Finance!A:F');
      let monthlyRevenue = 0;
      
      if (financeData.length > 1) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        financeData.slice(1).forEach((row) => {
          if (row[4]) { // Date column
            const rowDate = new Date(row[4]);
            if (rowDate.getMonth() === currentMonth && rowDate.getFullYear() === currentYear) {
              monthlyRevenue += parseFloat(row[2]) || 0; // Amount column
            }
          }
        });
      }

      setData({
        totalClients,
        monthlyRevenue,
        activeProjects: Math.floor(totalClients * 0.6), // Estimated active projects
        teamSize,
        revenueGrowth: Math.floor(Math.random() * 20 - 10), // Mock growth data
        clientGrowth: Math.floor(Math.random() * 15 - 5),
      });

      toast({
        title: "Dashboard Updated",
        description: "Data synced from Google Sheets successfully.",
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Sync Error",
        description: "Failed to load data from Google Sheets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Syncing with Google Sheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gradient-text">Business Overview</h2>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg transition-smooth hover:glow-cyan"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Clients"
          value={data.totalClients}
          change={data.clientGrowth}
          trend={data.clientGrowth > 0 ? 'up' : data.clientGrowth < 0 ? 'down' : 'neutral'}
          icon={<Users className="h-4 w-4" />}
        />
        
        <KPICard
          title="Monthly Revenue"
          value={`$${data.monthlyRevenue.toLocaleString()}`}
          change={data.revenueGrowth}
          trend={data.revenueGrowth > 0 ? 'up' : data.revenueGrowth < 0 ? 'down' : 'neutral'}
          icon={<DollarSign className="h-4 w-4" />}
        />
        
        <KPICard
          title="Active Projects"
          value={data.activeProjects}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        
        <KPICard
          title="Team Size"
          value={data.teamSize}
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                <span className="text-sm">New client added to CRM</span>
                <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
                <span className="text-sm">Payment received from Acme Corp</span>
                <span className="text-xs text-muted-foreground ml-auto">15m ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                <span className="text-sm">Team member completed project</span>
                <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <button className="p-3 text-left bg-secondary/20 rounded-lg transition-smooth hover:bg-secondary/40 hover:glow-cyan">
                <div className="font-medium">Add New Client</div>
                <div className="text-sm text-muted-foreground">Create a new client entry</div>
              </button>
              <button className="p-3 text-left bg-secondary/20 rounded-lg transition-smooth hover:bg-secondary/40 hover:glow-purple">
                <div className="font-medium">Generate Report</div>
                <div className="text-sm text-muted-foreground">Export monthly analytics</div>
              </button>
              <button className="p-3 text-left bg-secondary/20 rounded-lg transition-smooth hover:bg-secondary/40 hover:glow-cyan">
                <div className="font-medium">Update KPIs</div>
                <div className="text-sm text-muted-foreground">Refresh key metrics</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};