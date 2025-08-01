import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, Plus, FileText, Clock } from "lucide-react";
import { googleSheetsService } from "@/lib/google-sheets";
import { useToast } from "@/hooks/use-toast";
import { AddTransactionModal } from "@/components/modals/AddTransactionModal";

interface Transaction {
  id: string;
  type: "Income" | "Expense";
  amount: number;
  description: string;
  date: string;
  client: string;
  status: "Paid" | "Pending" | "Overdue";
}

export const FinanceModule = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const data = await googleSheetsService.readSheet('Finance!A:F');
      
      if (data.length > 1) {
        const transactionData = data.slice(1).map((row) => ({
          id: row[0] || '',
          type: row[1] as "Income" | "Expense" || 'Income',
          amount: parseFloat(row[2]) || 0,
          description: row[3] || '',
          date: row[4] || '',
          client: row[5] || '',
          status: (Math.random() > 0.7 ? "Pending" : Math.random() > 0.5 ? "Paid" : "Overdue") as "Paid" | "Pending" | "Overdue"
        }));
        setTransactions(transactionData);
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
      toast({
        title: "Sync Error",
        description: "Failed to load finance data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = (transaction: any) => {
    const newTransaction = {
      ...transaction,
      id: (transactions.length + 1).toString(),
      status: "Pending" as const
    };
    setTransactions([...transactions, newTransaction]);
    toast({
      title: "Transaction Added",
      description: "New transaction recorded successfully.",
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === "All" || transaction.type === filter;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncome = transactions.filter(t => t.type === "Income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const pendingAmount = transactions.filter(t => t.status === "Pending").reduce((sum, t) => sum + t.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "Pending": return "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30";
      case "Overdue": return "bg-neon-red/20 text-neon-red border-neon-red/30";
      default: return "bg-secondary/20 text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "Income" ? "text-neon-green" : "text-neon-red";
  };

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
        <h2 className="text-3xl font-bold gradient-text">Finance & Billing</h2>
        <AddTransactionModal 
          onAddTransaction={handleAddTransaction}
          trigger={
            <Button className="glow-cyan">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          }
        />
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">${totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-neon-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-red">${totalExpenses.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
              ${netProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-cyan">${pendingAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background/50 border-primary/30"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-primary/30">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-smooth">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${transaction.type === 'Income' ? 'bg-neon-green/20' : 'bg-neon-red/20'}`}>
                    {transaction.type === 'Income' ? 
                      <TrendingUp className="w-4 h-4 text-neon-green" /> : 
                      <TrendingDown className="w-4 h-4 text-neon-red" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.client && `${transaction.client} • `}{transaction.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                  <span className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};