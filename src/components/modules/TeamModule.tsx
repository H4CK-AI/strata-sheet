import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, User, DollarSign, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AddTeamMemberModal } from "@/components/modals/AddTeamMemberModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: string;
  status: string;
  performance: number;
  skills: string[];
  join_date: string;
  created_at: string;
  updated_at: string;
}

export const TeamModule = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTeam(data || []);
      toast({
        title: "Team Data Loaded",
        description: "Team information loaded successfully.",
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

  const handleAddMember = async (newMember: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([newMember])
        .select()
        .single();
      
      if (error) throw error;
      
      setTeam(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Team member added successfully.",
      });
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member.",
        variant: "destructive",
      });
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const handleUpdateMember = async (updatedMember: TeamMember) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update(updatedMember)
        .eq('id', updatedMember.id);
      
      if (error) throw error;
      
      setTeam(prev => prev.map(member => 
        member.id === updatedMember.id ? updatedMember : member
      ));
      setIsEditDialogOpen(false);
      setEditingMember(null);
      toast({
        title: "Success",
        description: "Team member updated successfully.",
      });
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', memberId);
      
      if (error) throw error;
      
      setTeam(prev => prev.filter(member => member.id !== memberId));
      toast({
        title: "Team Member Deleted",
        description: "Team member removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
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

  // Calculate analytics
  const totalPayroll = team.reduce((sum, member) => {
    const salary = parseFloat(member.salary.replace(/[^0-9.-]+/g, "")) || 0;
    return member.status === 'Active' ? sum + salary : sum;
  }, 0);

  const averagePerformance = team.length > 0 
    ? team.reduce((sum, member) => sum + member.performance, 0) / team.length 
    : 0;

  const activeMembers = team.filter(m => m.status === 'Active').length;

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

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <User className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{team.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeMembers} active members
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">
              ₹{totalPayroll.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              ₹{(totalPayroll / 12).toLocaleString()} monthly
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

      {/* Team Members Grid */}
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
                  <p className="text-sm text-muted-foreground">{member.position}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Department:</span>
                  <p className="font-medium">{member.department}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Salary:</span>
                  <p className="font-medium text-neon-green">{member.salary}</p>
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground text-sm">Joined:</span>
                <p className="font-medium">
                  {new Date(member.join_date).toLocaleDateString()}
                </p>
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

              {member.skills && member.skills.length > 0 && (
                <div>
                  <span className="text-muted-foreground text-sm">Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {member.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => handleEditMember(member)}
                >
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteMember(member.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={editingMember.position}
                  onChange={(e) => setEditingMember({...editingMember, position: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={editingMember.department}
                  onChange={(e) => setEditingMember({...editingMember, department: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  value={editingMember.salary}
                  onChange={(e) => setEditingMember({...editingMember, salary: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="performance">Performance (%)</Label>
                <Input
                  id="performance"
                  type="number"
                  min="0"
                  max="100"
                  value={editingMember.performance}
                  onChange={(e) => setEditingMember({...editingMember, performance: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status"
                  className="w-full p-2 border rounded"
                  value={editingMember.status}
                  onChange={(e) => setEditingMember({...editingMember, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleUpdateMember(editingMember)} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};