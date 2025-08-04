import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddMonthlyRecordModalProps {
  onAddRecord: (record: any) => void;
  trigger: React.ReactNode;
}

export const AddMonthlyRecordModal = ({ onAddRecord, trigger }: AddMonthlyRecordModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    month: "",
    revenue: "",
    expenses: "",
    profit: "",
    salaries: "",
    overhead: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.month || !formData.revenue || !formData.expenses || !formData.profit) {
      return;
    }

    onAddRecord({
      month: formData.month,
      revenue: formData.revenue,
      expenses: formData.expenses,
      profit: formData.profit,
      salaries: formData.salaries || "0",
      overhead: formData.overhead || "0"
    });

    setFormData({
      month: "",
      revenue: "",
      expenses: "",
      profit: "",
      salaries: "",
      overhead: ""
    });
    setOpen(false);
  };

  const currentYear = new Date().getFullYear();
  const months = [
    `January ${currentYear}`, `February ${currentYear}`, `March ${currentYear}`,
    `April ${currentYear}`, `May ${currentYear}`, `June ${currentYear}`,
    `July ${currentYear}`, `August ${currentYear}`, `September ${currentYear}`,
    `October ${currentYear}`, `November ${currentYear}`, `December ${currentYear}`
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="glass-modal max-w-lg">
        <DialogHeader>
          <DialogTitle className="gradient-text">Add Monthly Financial Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="month">Month</Label>
            <Select value={formData.month} onValueChange={(value) => setFormData({...formData, month: value})}>
              <SelectTrigger className="bg-background/50 border-primary/30">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="revenue">Revenue (₹ Lakhs)</Label>
              <Input
                id="revenue"
                type="text"
                placeholder="e.g., 20L"
                value={formData.revenue}
                onChange={(e) => setFormData({...formData, revenue: e.target.value})}
                className="bg-background/50 border-primary/30"
                required
              />
            </div>

            <div>
              <Label htmlFor="expenses">Expenses (₹ Lakhs)</Label>
              <Input
                id="expenses"
                type="text"
                placeholder="e.g., 15L"
                value={formData.expenses}
                onChange={(e) => setFormData({...formData, expenses: e.target.value})}
                className="bg-background/50 border-primary/30"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profit">Profit (₹ Lakhs)</Label>
              <Input
                id="profit"
                type="text"
                placeholder="e.g., 5L"
                value={formData.profit}
                onChange={(e) => setFormData({...formData, profit: e.target.value})}
                className="bg-background/50 border-primary/30"
                required
              />
            </div>

            <div>
              <Label htmlFor="salaries">Salaries (₹ Lakhs)</Label>
              <Input
                id="salaries"
                type="text"
                placeholder="e.g., 8L"
                value={formData.salaries}
                onChange={(e) => setFormData({...formData, salaries: e.target.value})}
                className="bg-background/50 border-primary/30"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="overhead">Overhead (₹ Lakhs)</Label>
            <Input
              id="overhead"
              type="text"
              placeholder="e.g., 3L"
              value={formData.overhead}
              onChange={(e) => setFormData({...formData, overhead: e.target.value})}
              className="bg-background/50 border-primary/30"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow-cyan">
              Add Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};