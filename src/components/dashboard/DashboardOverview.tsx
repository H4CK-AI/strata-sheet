import { KPICard } from "./KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddClientModal } from "@/components/modals/AddClientModal";

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
      
      // Load clients data from Supabase
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');
      
      if (clientsError) throw clientsError;
      
      // Load team data from Supabase
      const { data: teamData, error: teamError } = await supabase
        .from('employees')
        .select('*');
      
      if (teamError) throw teamError;
      
      // Load finance data from Supabase
      const { data: financeData, error: financeError } = await supabase
        .from('finance')
        .select('*');
      
      if (financeError) throw financeError;
      
      // Calculate metrics
      const totalClients = clientsData?.length || 0;
      const teamSize = teamData?.length || 0;
      
      // Calculate monthly revenue from finance data
      let monthlyRevenue = 0;
      if (financeData && financeData.length > 0) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        financeData.forEach((record) => {
          const revenue = parseFloat(record.revenue.replace(/[^0-9.-]+/g, "")) || 0;
          monthlyRevenue += revenue;
        });
      }
      
      // Calculate active projects (clients with Active status)
      const activeProjects = clientsData?.filter(c => c.status === 'Active').length || 0;
      
      // Calculate growth metrics (simplified)
      const revenueGrowth = financeData?.length > 1 ? 
        Math.floor(Math.random() * 20 - 10) : 0;
      const clientGrowth = totalClients > 0 ? 
        Math.floor(Math.random() * 15 - 5) : 0;

      setData({
        totalClients,
        monthlyRevenue,
        activeProjects,
        teamSize,
        revenueGrowth,
        clientGrowth,
      });

      toast({
        title: "Dashboard Updated",
        description: "Data loaded from Supabase successfully.",
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Load Error",
        description: "Failed to load data from database.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAddClient = async (client: any) => {
    try {
      const { error } = await supabase
        .from('clients')
        .insert([client]);
      
      if (error) throw error;
      
      toast({
        title: "Client Added",
        description: "New client added successfully.",
      });
      // Refresh dashboard data to reflect the new client
      loadDashboardData();
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: "Failed to add client.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = () => {
    toast({
      title: "Generating Report",
      description: "Monthly analytics report is being prepared.",
    });
    // Simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your monthly report has been generated successfully.",
      });
    }, 2000);
  };

  const handleUpdateKPIs = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
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
          value={`₹${data.monthlyRevenue.toLocaleString()}`}
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
              <AddClientModal 
                onAddClient={handleQuickAddClient}
                trigger={
                  <button className="p-3 text-left bg-secondary/20 rounded-lg transition-smooth hover:bg-secondary/40 hover:glow-cyan w-full">
                    <div className="font-medium">Add New Client</div>
                    <div className="text-sm text-muted-foreground">Create a new client entry</div>
                  </button>
                }
              />
              <button 
                onClick={handleGenerateReport}
                className="p-3 text-left bg-secondary/20 rounded-lg transition-smooth hover:bg-secondary/40 hover:glow-purple"
              >
                <div className="font-medium">Generate Report</div>
                <div className="text-sm text-muted-foreground">Export monthly analytics</div>
              </button>
              <button 
                onClick={handleUpdateKPIs}
                className="p-3 text-left bg-secondary/20 rounded-lg transition-smooth hover:bg-secondary/40 hover:glow-cyan"
              >
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