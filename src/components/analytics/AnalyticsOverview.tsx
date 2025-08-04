import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Building, Target } from "lucide-react";

interface AnalyticsData {
  clients: any[];
  employees: any[];
  finance: any[];
}

export const AnalyticsOverview = () => {
  const [data, setData] = useState<AnalyticsData>({ clients: [], employees: [], finance: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const [clientsResponse, employeesResponse, financeResponse] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('employees').select('*'),
        supabase.from('finance').select('*')
      ]);

      setData({
        clients: clientsResponse.data || [],
        employees: employeesResponse.data || [],
        finance: financeResponse.data || []
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const totalClients = data.clients.length;
  const activeClients = data.clients.filter(c => c.status === 'Active').length;
  const totalEmployees = data.employees.length;
  const activeEmployees = data.employees.filter(e => e.status === 'Active').length;
  
  const totalRevenue = data.finance.reduce((sum, record) => {
    const revenue = parseFloat(record.revenue.replace(/[^0-9.-]+/g, "")) || 0;
    return sum + revenue;
  }, 0);

  const totalExpenses = data.finance.reduce((sum, record) => {
    const expenses = parseFloat(record.expenses.replace(/[^0-9.-]+/g, "")) || 0;
    return sum + expenses;
  }, 0);

  // Client distribution by status
  const clientStatusData = [
    { name: 'Active', value: data.clients.filter(c => c.status === 'Active').length, color: '#00ff88' },
    { name: 'Inactive', value: data.clients.filter(c => c.status === 'Inactive').length, color: '#ff4444' },
    { name: 'Pending', value: data.clients.filter(c => c.status === 'Pending').length, color: '#ffaa00' },
  ].filter(item => item.value > 0);

  // Employee performance distribution
  const performanceRanges = [
    { range: '90-100%', count: data.employees.filter(e => e.performance >= 90).length },
    { range: '80-89%', count: data.employees.filter(e => e.performance >= 80 && e.performance < 90).length },
    { range: '70-79%', count: data.employees.filter(e => e.performance >= 70 && e.performance < 80).length },
    { range: 'Below 70%', count: data.employees.filter(e => e.performance < 70).length },
  ];

  // Revenue trend (if we have multiple months)
  const revenueData = data.finance.map(record => ({
    month: record.month,
    revenue: parseFloat(record.revenue.replace(/[^0-9.-]+/g, "")) || 0,
    expenses: parseFloat(record.expenses.replace(/[^0-9.-]+/g, "")) || 0,
    profit: parseFloat(record.profit.replace(/[^0-9.-]+/g, "")) || 0,
  })).sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gradient-text">Business Analytics</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Building className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {activeClients} active ({totalClients > 0 ? ((activeClients/totalClients)*100).toFixed(0) : 0}%)
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {activeEmployees} active members
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {data.finance.length} months
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRevenue > totalExpenses ? 'text-neon-green' : 'text-neon-red'}`}>
              {totalRevenue > 0 ? (((totalRevenue - totalExpenses) / totalRevenue) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Net profit margin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text">Client Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clientStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {clientStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [value, 'Clients']}
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {clientStatusData.map((item, index) => (
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
            <CardTitle className="gradient-text">Employee Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceRanges}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="range" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value: number) => [value, 'Employees']}
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#00ff88"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {revenueData.length > 1 && (
          <Card className="glass-card md:col-span-2">
            <CardHeader>
              <CardTitle className="gradient-text">Financial Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
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
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ff4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ff4444', strokeWidth: 2 }}
                    name="Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#00ffff" 
                    strokeWidth={2}
                    dot={{ fill: '#00ffff', strokeWidth: 2 }}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="gradient-text">Business Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-secondary/20">
              <h4 className="font-semibold text-neon-green mb-2">Client Health</h4>
              <p className="text-sm text-muted-foreground">
                {totalClients > 0 ? `${((activeClients/totalClients)*100).toFixed(0)}% of clients are active` : 'No client data available'}
                {totalClients > 0 && activeClients/totalClients >= 0.8 && ' - Excellent retention!'}
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/20">
              <h4 className="font-semibold text-neon-cyan mb-2">Team Performance</h4>
              <p className="text-sm text-muted-foreground">
                {data.employees.length > 0 ? 
                  `Average performance: ${(data.employees.reduce((sum, e) => sum + e.performance, 0) / data.employees.length).toFixed(1)}%` :
                  'No employee data available'
                }
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/20">
              <h4 className="font-semibold text-neon-yellow mb-2">Financial Health</h4>
              <p className="text-sm text-muted-foreground">
                {totalRevenue > 0 ? 
                  `Profit margin: ${(((totalRevenue - totalExpenses) / totalRevenue) * 100).toFixed(1)}%` :
                  'No financial data available'
                }
                {totalRevenue > totalExpenses && ' - Profitable!'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};