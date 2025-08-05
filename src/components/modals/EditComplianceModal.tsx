import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface EditComplianceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  compliance: ComplianceItem | null;
  onUpdateCompliance: (compliance: ComplianceItem) => void;
}

export const EditComplianceModal = ({ open, onOpenChange, compliance, onUpdateCompliance }: EditComplianceModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    priority: "Medium",
    due_date: "",
    status: "pending"
  });

  useEffect(() => {
    if (compliance) {
      setFormData({
        title: compliance.title,
        description: compliance.description,
        category: compliance.category,
        type: compliance.type,
        priority: compliance.priority,
        due_date: compliance.due_date,
        status: compliance.status
      });
    }
  }, [compliance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!compliance || !formData.title || !formData.description || !formData.category || !formData.type || !formData.due_date) {
      return;
    }

    onUpdateCompliance({
      ...compliance,
      ...formData
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-modal max-w-2xl" aria-describedby="edit-compliance-description">
        <DialogHeader>
          <DialogTitle className="gradient-text">Edit Compliance Item</DialogTitle>
          <p id="edit-compliance-description" className="text-sm text-muted-foreground">Update compliance requirement or legal item details</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., GDPR Data Protection Review"
              className="bg-background/50 border-primary/30"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed description of the compliance requirement..."
              className="bg-background/50 border-primary/30 min-h-20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-category">Category *</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Data Protection, Tax Compliance"
                className="bg-background/50 border-primary/30"
                required
              />
            </div>

            <div>
              <Label htmlFor="edit-type">Type *</Label>
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-priority">Priority</Label>
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
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-due_date">Due Date *</Label>
              <Input
                id="edit-due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                className="bg-background/50 border-primary/30"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow-cyan">
              Update Compliance Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};