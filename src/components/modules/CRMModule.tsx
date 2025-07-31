import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Edit, Trash2, Users } from "lucide-react";
import { googleSheetsService } from "@/lib/google-sheets";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  status: 'Lead' | 'Active' | 'Dormant' | 'Churned';
  source: string;
  value: number;
  lastContact: string;
  created: string;
}

export const CRMModule = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, statusFilter]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await googleSheetsService.readSheet('Clients!A:H');
      
      if (data.length <= 1) {
        // If no data, add sample data
        const sampleData = [
          ['ID', 'Name', 'Email', 'Status', 'Source', 'Value', 'Last Contact', 'Created'],
          ['1', 'Acme Corp', 'contact@acme.com', 'Active', 'Website', '50000', '2024-01-15', '2024-01-01'],
          ['2', 'TechStart Inc', 'hello@techstart.com', 'Lead', 'Referral', '25000', '2024-01-10', '2024-01-08'],
          ['3', 'Global Solutions', 'info@global.com', 'Dormant', 'LinkedIn', '75000', '2023-12-20', '2023-12-01'],
        ];
        await googleSheetsService.writeSheet('Clients!A:H', sampleData);
        setClients(sampleData.slice(1).map(row => ({
          id: row[0],
          name: row[1],
          email: row[2],
          status: row[3] as Client['status'],
          source: row[4],
          value: parseFloat(row[5]) || 0,
          lastContact: row[6],
          created: row[7],
        })));
      } else {
        const clientData = data.slice(1).map(row => ({
          id: row[0] || '',
          name: row[1] || '',
          email: row[2] || '',
          status: (row[3] || 'Lead') as Client['status'],
          source: row[4] || '',
          value: parseFloat(row[5]) || 0,
          lastContact: row[6] || '',
          created: row[7] || '',
        }));
        setClients(clientData);
      }
      
      toast({
        title: "CRM Data Loaded",
        description: "Client data synced successfully.",
      });
    } catch (error) {
      console.error('Error loading clients:', error);
      toast({
        title: "Error",
        description: "Failed to load client data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;
    
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "All") {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    
    setFilteredClients(filtered);
  };

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'Lead':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Active':
        return 'bg-neon-green/20 text-neon-green border-neon-green/30';
      case 'Dormant':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Churned':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CRM data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gradient-text">Customer Relationship Management</h2>
        <Button className="glow-cyan">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Lead', 'Active', 'Dormant', 'Churned'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={statusFilter === status ? "glow-cyan" : ""}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="glass-card transition-smooth hover:glow-cyan">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{client.name}</CardTitle>
                <Badge className={cn("text-xs", getStatusColor(client.status))}>
                  {client.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Source:</span>
                  <p className="font-medium">{client.source}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Value:</span>
                  <p className="font-medium text-neon-green">${client.value.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="text-sm">
                <span className="text-muted-foreground">Last Contact:</span>
                <p className="font-medium">{new Date(client.lastContact).toLocaleDateString()}</p>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="glass-card text-center py-12">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No clients found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "All"
                ? "Try adjusting your filters"
                : "Get started by adding your first client"}
            </p>
            <Button className="glow-cyan">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};