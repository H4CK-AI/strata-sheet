import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddTeamMemberModalProps {
  onAddMember: (member: any) => void;
  trigger?: React.ReactNode;
}

export const AddTeamMemberModal = ({ onAddMember, trigger }: AddTeamMemberModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    salary: "",
    status: "Active",
    performance: "80",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.role || !formData.salary) {
      toast({
        title: "Validation Error",
        description: "Name, role, and salary are required.",
        variant: "destructive",
      });
      return;
    }

    const newMember = {
      name: formData.name,
      position: formData.role,
      department: formData.role, // Using role as department for now
      salary: `₹${formData.salary}`,
      status: formData.status,
      performance: parseFloat(formData.performance) || 80,
      join_date: new Date().toISOString().split('T')[0],
      skills: [],
    };

    onAddMember(newMember);
    setFormData({ name: "", role: "", salary: "", status: "Active", performance: "80" });
    setOpen(false);
    
    toast({
      title: "Team Member Added",
      description: `${formData.name} has been added to the team.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="glow-cyan">
            <Plus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-card border-border/30">
        <DialogHeader>
          <DialogTitle className="gradient-text">Add Team Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Frontend Developer"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary">Annual Salary ($) *</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="75000"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="performance">Initial Performance (%)</Label>
            <Input
              id="performance"
              type="number"
              min="0"
              max="100"
              value={formData.performance}
              onChange={(e) => setFormData({ ...formData, performance: e.target.value })}
              placeholder="80"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 glow-cyan">
              Add Member
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};