import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, Plus, FileText, Clock, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TransactionHistory } from './TransactionHistory';

interface FinanceData {
  id: string;
  month: string;
  revenue: string;
  expenses: string;
  profit: string;
  salaries: string;
  overhead: string;
  created_at: string;
  updated_at: string;
}

export const FinanceModule = () => {
  const [financeData, setFinanceData] = useState<FinanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecord, setEditingRecord] = useState<FinanceData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('finance')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setFinanceData(data || []);
      toast({
        title: "Finance Data Loaded",
        description: "Financial data loaded successfully.",
      });
    } catch (error) {
      console.error('Error loading finance data:', error);
      toast({
        title: "Error",
        description: "Failed to load finance data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (newRecord: Omit<FinanceData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('finance')
        .insert([newRecord])
        .select()
        .single();
      
      if (error) throw error;
      
      setFinanceData(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Finance record added successfully.",
      });
    } catch (error) {
      console.error('Error adding finance record:', error);
      toast({
        title: "Error",
        description: "Failed to add finance record.",
        variant: "destructive",
      });
    }
  };

  const handleEditRecord = (record: FinanceData) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRecord = async (updatedRecord: FinanceData) => {
    try {
      const { error } = await supabase
        .from('finance')
        .update(updatedRecord)
        .eq('id', updatedRecord.id);
      
      if (error) throw error;
      
      setFinanceData(prev => prev.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      ));
      setIsEditDialogOpen(false);
      setEditingRecord(null);
      toast({
        title: "Success",
        description: "Finance record updated successfully.",
      });
    } catch (error) {
      console.error('Error updating finance record:', error);
      toast({
        title: "Error",
        description: "Failed to update finance record.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('finance')
        .delete()
        .eq('id', recordId);
      
      if (error) throw error;
      
      setFinanceData(prev => prev.filter(record => record.id !== recordId));
      toast({
        title: "Finance Record Deleted",
        description: "Finance record removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting finance record:', error);
      toast({
        title: "Error",
        description: "Failed to delete finance record.",
        variant: "destructive",
      });
    }
  };

  // Parse financial values
  const parseFinancialValue = (value: string) => {
    return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
  };

  // Calculate analytics
  const totalRevenue = financeData.reduce((sum, record) => sum + parseFinancialValue(record.revenue), 0);
  const totalExpenses = financeData.reduce((sum, record) => sum + parseFinancialValue(record.expenses), 0);
  const totalProfit = financeData.reduce((sum, record) => sum + parseFinancialValue(record.profit), 0);
  const totalSalaries = financeData.reduce((sum, record) => sum + parseFinancialValue(record.salaries || "0"), 0);
  const totalOverhead = financeData.reduce((sum, record) => sum + parseFinancialValue(record.overhead || "0"), 0);

  // Prepare chart data
  const chartData = financeData.map(record => ({
    month: record.month,
    revenue: parseFinancialValue(record.revenue),
    expenses: parseFinancialValue(record.expenses),
    profit: parseFinancialValue(record.profit),
  })).reverse(); // Reverse to show chronological order

  const expenseBreakdown = [
    { name: 'Salaries', value: totalSalaries, color: '#00ff88' },
    { name: 'Overhead', value: totalOverhead, color: '#0088ff' },
    { name: 'Other', value: totalExpenses - totalSalaries - totalOverhead, color: '#ff4444' }
  ].filter(item => item.value > 0);

  const monthlyGrowth = chartData.map((current, index) => {
    if (index === 0) return { month: current.month, growth: 0 };
    const previous = chartData[index - 1];
    const growth = previous.revenue > 0 
      ? ((current.revenue - previous.revenue) / previous.revenue) * 100 
      : 0;
    return { month: current.month, growth: Math.round(growth * 100) / 100 };
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading finance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gradient-text">Finance & Analytics</h2>
        <Button className="glow-cyan" onClick={() => {}}>
          <Plus className="w-4 h-4 mr-2" />
          Add Monthly Record
        </Button>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {financeData.length} months tracked
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-neon-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-red">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Including salaries & overhead
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              ${totalProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}% margin
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly</CardTitle>
            <Clock className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-cyan">
              ${financeData.length > 0 ? (totalRevenue / financeData.length).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Average revenue per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History Section */}
      <TransactionHistory />

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Revenue vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00ff88" 
                  strokeWidth={2}
                  dot={{ fill: '#00ff88', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ff4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ff4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {expenseBreakdown.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Monthly Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Growth']}
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="growth" 
                  fill="#0088ff"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Profit Margin Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#00ffff" 
                  strokeWidth={3}
                  dot={{ fill: '#00ffff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Finance Records Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">Monthly Financial Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financeData.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-smooth">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                  <div>
                    <p className="font-medium">{record.month}</p>
                    <p className="text-xs text-muted-foreground">Month</p>
                  </div>
                  <div>
                    <p className="font-medium text-neon-green">{record.revenue}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <p className="font-medium text-neon-red">{record.expenses}</p>
                    <p className="text-xs text-muted-foreground">Expenses</p>
                  </div>
                  <div>
                    <p className={`font-medium ${parseFinancialValue(record.profit) >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                      {record.profit}
                    </p>
                    <p className="text-xs text-muted-foreground">Profit</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="font-medium">{record.salaries || 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">Salaries</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEditRecord(record)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {financeData.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No financial records found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Financial Record</DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  value={editingRecord.month}
                  onChange={(e) => setEditingRecord({...editingRecord, month: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="revenue">Revenue</Label>
                <Input
                  id="revenue"
                  value={editingRecord.revenue}
                  onChange={(e) => setEditingRecord({...editingRecord, revenue: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="expenses">Expenses</Label>
                <Input
                  id="expenses"
                  value={editingRecord.expenses}
                  onChange={(e) => setEditingRecord({...editingRecord, expenses: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="profit">Profit</Label>
                <Input
                  id="profit"
                  value={editingRecord.profit}
                  onChange={(e) => setEditingRecord({...editingRecord, profit: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="salaries">Salaries</Label>
                <Input
                  id="salaries"
                  value={editingRecord.salaries || ''}
                  onChange={(e) => setEditingRecord({...editingRecord, salaries: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="overhead">Overhead</Label>
                <Input
                  id="overhead"
                  value={editingRecord.overhead || ''}
                  onChange={(e) => setEditingRecord({...editingRecord, overhead: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleUpdateRecord(editingRecord)} className="flex-1">
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