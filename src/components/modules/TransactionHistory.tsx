import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2, TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  description: string;
  category: string;
  amount: number;
  mode: 'Bank' | 'Credit Card' | 'UPI' | 'Cash';
  status: 'Pending' | 'Received' | 'Paid';
  client_reference?: string;
  created_at: string;
  updated_at: string;
}

export const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Income' as 'Income' | 'Expense',
    description: '',
    category: '',
    amount: '',
    mode: 'Bank' as 'Bank' | 'Credit Card' | 'UPI' | 'Cash',
    status: 'Pending' as 'Pending' | 'Received' | 'Paid',
    client_reference: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, typeFilter]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      setTransactions((data || []) as Transaction[]);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;
    
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.client_reference?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (typeFilter !== "All Types") {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }
    
    setFilteredTransactions(filtered);
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.category || !formData.amount) {
      toast({
        title: "Validation Error",
        description: "Description, category, and amount are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...formData,
          amount: parseFloat(formData.amount)
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      setTransactions(prev => [data as Transaction, ...prev]);
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Transaction added successfully.",
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction.",
        variant: "destructive",
      });
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      date: transaction.date,
      type: transaction.type,
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount.toString(),
      mode: transaction.mode,
      status: transaction.status,
      client_reference: transaction.client_reference || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTransaction) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          ...formData,
          amount: parseFloat(formData.amount)
        })
        .eq('id', editingTransaction.id);
      
      if (error) throw error;
      
      setTransactions(prev => prev.map(t => 
        t.id === editingTransaction.id 
          ? { ...t, ...formData, amount: parseFloat(formData.amount) }
          : t
      ));
      setIsEditDialogOpen(false);
      setEditingTransaction(null);
      resetForm();
      toast({
        title: "Success",
        description: "Transaction updated successfully.",
      });
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);
      
      if (error) throw error;
      
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      toast({
        title: "Transaction Deleted",
        description: "Transaction removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'Income',
      description: '',
      category: '',
      amount: '',
      mode: 'Bank',
      status: 'Pending',
      client_reference: ''
    });
  };

  const getTypeColor = (type: string) => {
    return type === 'Income' 
      ? 'bg-neon-green/20 text-neon-green border-neon-green/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received':
      case 'Paid':
        return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'Income' ? '+' : '-';
    const color = type === 'Income' ? 'text-neon-green' : 'text-red-400';
    return (
      <span className={color}>
        {sign}₹{amount.toLocaleString()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  // Calculate analytics
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const avgMonthlyIncome = transactions.length > 0 ? totalIncome / (new Set(transactions.map(t => t.date.substring(0, 7))).size || 1) : 0;

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Transaction History</h2>
          <p className="text-muted-foreground mt-1">Complete record of all financial transactions</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="glow-cyan">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Transaction Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter(t => t.type === 'Income').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-neon-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-red">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.filter(t => t.type === 'Expense').length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : 0}% margin
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly</CardTitle>
            <Clock className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-cyan">{formatCurrency(avgMonthlyIncome)}</div>
            <p className="text-xs text-muted-foreground">
              Average income per month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Types">All Types</SelectItem>
            <SelectItem value="Income">Income</SelectItem>
            <SelectItem value="Expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions Table */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Mode</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border/20 hover:bg-secondary/20 transition-smooth">
                    <td className="p-4">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })}
                    </td>
                    <td className="p-4">
                      <Badge className={cn("text-xs", getTypeColor(transaction.type))}>
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        {transaction.client_reference && (
                          <p className="text-xs text-muted-foreground">
                            Client: {transaction.client_reference}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{transaction.category}</td>
                    <td className="p-4 text-right font-medium">
                      {formatAmount(transaction.amount, transaction.type)}
                    </td>
                    <td className="p-4 text-muted-foreground">{transaction.mode}</td>
                    <td className="p-4">
                      <Badge className={cn("text-xs", getStatusColor(transaction.status))}>
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditTransaction(transaction)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value: 'Income' | 'Expense') => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Web Development - Phase 1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Project Fee, Office Rent"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mode">Payment Mode</Label>
                <Select value={formData.mode} onValueChange={(value: 'Bank' | 'Credit Card' | 'UPI' | 'Cash') => setFormData({ ...formData, mode: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'Pending' | 'Received' | 'Paid') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="client_reference">Client Reference (Optional)</Label>
              <Input
                id="client_reference"
                value={formData.client_reference}
                onChange={(e) => setFormData({ ...formData, client_reference: e.target.value })}
                placeholder="e.g., C001"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 glow-cyan">
                Add Transaction
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateTransaction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Type</Label>
                <Select value={formData.type} onValueChange={(value: 'Income' | 'Expense') => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="edit-amount">Amount (₹)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-mode">Payment Mode</Label>
                <Select value={formData.mode} onValueChange={(value: 'Bank' | 'Credit Card' | 'UPI' | 'Cash') => setFormData({ ...formData, mode: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'Pending' | 'Received' | 'Paid') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-client_reference">Client Reference (Optional)</Label>
              <Input
                id="edit-client_reference"
                value={formData.client_reference}
                onChange={(e) => setFormData({ ...formData, client_reference: e.target.value })}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 glow-cyan">
                Update Transaction
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};