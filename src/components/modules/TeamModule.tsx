import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, User, DollarSign } from "lucide-react";
import { googleSheetsService } from "@/lib/google-sheets";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AddTeamMemberModal } from "@/components/modals/AddTeamMemberModal";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  salary: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  performance: number;
  joined: string;
}

export const TeamModule = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTeam();
  }, []);

  const handleAddMember = (newMember: TeamMember) => {
    setTeam(prev => [...prev, newMember]);
    toast({
      title: "Success",
      description: "Team member added successfully to local data.",
    });
  };

  const loadTeam = async () => {
    try {
      setLoading(true);
      const data = await googleSheetsService.readSheet('Team!A:G');
      
      if (data.length <= 1) {
        // Add sample team data
        const sampleData = [
          ['ID', 'Name', 'Role', 'Salary', 'Status', 'Performance', 'Joined'],
          ['1', 'Alice Johnson', 'Frontend Developer', '75000', 'Active', '92', '2023-06-01'],
          ['2', 'Bob Smith', 'Backend Developer', '80000', 'Active', '88', '2023-04-15'],
          ['3', 'Carol Davis', 'UI/UX Designer', '70000', 'Active', '95', '2023-08-01'],
          ['4', 'David Wilson', 'Project Manager', '85000', 'On Leave', '87', '2023-03-01'],
        ];
        await googleSheetsService.writeSheet('Team!A:G', sampleData);
        setTeam(sampleData.slice(1).map(row => ({
          id: row[0],
          name: row[1],
          role: row[2],
          salary: parseFloat(row[3]) || 0,
          status: row[4] as TeamMember['status'],
          performance: parseFloat(row[5]) || 0,
          joined: row[6],
        })));
      } else {
        const teamData = data.slice(1).map(row => ({
          id: row[0] || '',
          name: row[1] || '',
          role: row[2] || '',
          salary: parseFloat(row[3]) || 0,
          status: (row[4] || 'Active') as TeamMember['status'],
          performance: parseFloat(row[5]) || 0,
          joined: row[6] || '',
        }));
        setTeam(teamData);
      }
      
      toast({
        title: "Team Data Loaded",
        description: "Team information synced successfully.",
      });
    } catch (error) {
      console.error('Error loading team:', error);
      toast({
        title: "Error",
        description: "Failed to load team data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'On Leave':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Terminated':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-neon-green';
    if (performance >= 80) return 'text-neon-cyan';
    if (performance >= 70) return 'text-yellow-400';
    return 'text-destructive';
  };

  const totalPayroll = team.reduce((sum, member) => 
    member.status === 'Active' ? sum + member.salary : sum, 0
  );

  const averagePerformance = team.length > 0 
    ? team.reduce((sum, member) => sum + member.performance, 0) / team.length 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gradient-text">Team Management</h2>
        <AddTeamMemberModal onAddMember={handleAddMember} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <User className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{team.length}</div>
            <p className="text-xs text-muted-foreground">
              {team.filter(m => m.status === 'Active').length} active members
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">
              ${(totalPayroll / 12).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ${totalPayroll.toLocaleString()} annually
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <div className="h-4 w-4 rounded-full bg-neon-green"></div>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getPerformanceColor(averagePerformance))}>
              {averagePerformance.toFixed(1)}%
            </div>
            <Progress value={averagePerformance} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <Card key={member.id} className="glass-card transition-smooth hover:glow-cyan">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-neon-cyan to-neon-purple text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{member.name}</h3>
                    <Badge className={cn("text-xs", getStatusColor(member.status))}>
                      {member.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Salary:</span>
                  <p className="font-medium text-neon-green">
                    ${member.salary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Joined:</span>
                  <p className="font-medium">
                    {new Date(member.joined).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Performance</span>
                  <span className={cn("font-medium", getPerformanceColor(member.performance))}>
                    {member.performance}%
                  </span>
                </div>
                <Progress value={member.performance} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};