import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Shield, AlertTriangle, CheckCircle, Clock, Search, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AddComplianceModal } from "@/components/modals/AddComplianceModal";
import { EditComplianceModal } from "@/components/modals/EditComplianceModal";

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  priority: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export const ComplianceModule = () => {
  const [compliance, setCompliance] = useState<ComplianceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [editingCompliance, setEditingCompliance] = useState<ComplianceItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCompliance();
  }, []);

  const loadCompliance = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('compliance')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCompliance(data || []);
    } catch (error) {
      console.error('Error loading compliance:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompliance = async (newItem: Omit<ComplianceItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('compliance')
        .insert([newItem])
        .select()
        .single();
      
      if (error) throw error;
      
      setCompliance(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Compliance item added successfully.",
      });
    } catch (error) {
      console.error('Error adding compliance item:', error);
      toast({
        title: "Error",
        description: "Failed to add compliance item.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('compliance')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setCompliance(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
      
      toast({
        title: "Status Updated",
        description: "Compliance item status updated successfully.",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleEditCompliance = (item: ComplianceItem) => {
    setEditingCompliance(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateCompliance = async (updatedItem: ComplianceItem) => {
    try {
      const { error } = await supabase
        .from('compliance')
        .update(updatedItem)
        .eq('id', updatedItem.id);
      
      if (error) throw error;
      
      setCompliance(prev => prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
      
      toast({
        title: "Success",
        description: "Compliance item updated successfully.",
      });
    } catch (error) {
      console.error('Error updating compliance item:', error);
      toast({
        title: "Error",
        description: "Failed to update compliance item.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCompliance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('compliance')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCompliance(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Compliance Item Deleted",
        description: "Compliance item removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting compliance item:', error);
      toast({
        title: "Error",
        description: "Failed to delete compliance item.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-neon-green" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'overdue':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'legal':
        return '⚖️';
      case 'financial':
        return '💰';
      case 'security':
        return '🔒';
      case 'operational':
        return '⚙️';
      default:
        return '📋';
    }
  };

  // Filter compliance items
  const filteredCompliance = compliance.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate analytics
  const totalItems = compliance.length;
  const completedItems = compliance.filter(item => item.status === 'completed').length;
  const pendingItems = compliance.filter(item => item.status === 'pending').length;
  const overdueItems = compliance.filter(item => item.status === 'overdue').length;
  const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading compliance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gradient-text">Compliance & Legal</h2>
        <AddComplianceModal onAddCompliance={handleAddCompliance} />
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Shield className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Compliance items tracked</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{completedItems} of {totalItems} completed</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{pendingItems}</div>
            <p className="text-xs text-muted-foreground">Items awaiting action</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueItems}</div>
            <p className="text-xs text-muted-foreground">Items past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search compliance items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-primary/30"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-primary/30">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40 bg-background/50 border-primary/30">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Items */}
      <div className="grid gap-4">
        {filteredCompliance.map((item) => (
          <Card key={item.id} className="glass-card transition-smooth hover:glow-cyan">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{getTypeIcon(item.type)}</span>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <Badge className={cn("text-xs", getStatusColor(item.status))}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1">{item.status}</span>
                    </Badge>
                    <Badge className={cn("text-xs", getPriorityColor(item.priority))}>
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{item.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-medium">{item.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium capitalize">{item.type}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <p className="font-medium">{new Date(item.due_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Created:</span>
                      <p className="font-medium">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditCompliance(item)}
                    className="text-neon-cyan hover:text-neon-cyan"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteCompliance(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  {item.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(item.id, 'completed')}
                      className="text-neon-green hover:text-neon-green"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  {item.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(item.id, 'pending')}
                      className="text-yellow-400 hover:text-yellow-400"
                    >
                      <Clock className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompliance.length === 0 && (
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No compliance items found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? "Try adjusting your filters"
                  : "Get started by adding your first compliance item"}
              </p>
              {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                <AddComplianceModal 
                  onAddCompliance={handleAddCompliance}
                  trigger={
                    <Button className="glow-cyan">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Compliance Item
                    </Button>
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Compliance Modal */}
      <EditComplianceModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        compliance={editingCompliance}
        onUpdateCompliance={handleUpdateCompliance}
      />
    </div>
  );
};