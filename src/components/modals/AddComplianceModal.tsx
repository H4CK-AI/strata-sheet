import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AddComplianceModalProps {
  onAddCompliance: (compliance: any) => void;
  trigger?: React.ReactNode;
}

export const AddComplianceModal = ({ onAddCompliance, trigger }: AddComplianceModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    priority: "Medium",
    due_date: "",
    status: "pending"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.type || !formData.due_date) {
      return;
    }

    onAddCompliance(formData);

    setFormData({
      title: "",
      description: "",
      category: "",
      type: "",
      priority: "Medium",
      due_date: "",
      status: "pending"
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="glow-cyan">
            <Plus className="mr-2 h-4 w-4" />
            Add Compliance Item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-modal max-w-2xl" aria-describedby="compliance-description">
        <DialogHeader>
          <DialogTitle className="gradient-text">Add Compliance Item</DialogTitle>
          <p id="compliance-description" className="text-sm text-muted-foreground">Create a new compliance requirement or legal item to track</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., GDPR Data Protection Review"
              className="bg-background/50 border-primary/30"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed description of the compliance requirement..."
              className="bg-background/50 border-primary/30 min-h-20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Data Protection, Tax Compliance"
                className="bg-background/50 border-primary/30"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                className="bg-background/50 border-primary/30"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow-cyan">
              Add Compliance Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};