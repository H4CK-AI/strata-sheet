import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CheckCircle, Clock, AlertCircle, User, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddTaskModal } from "@/components/modals/AddTaskModal";
import { useNotifications } from "@/hooks/useNotifications";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  project: string;
}

export const TaskModule = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Update client dashboard",
      description: "Implement new analytics features for client portal",
      assignee: "Alice Johnson",
      status: "In Progress",
      priority: "High",
      dueDate: "2024-02-15",
      project: "Client Portal"
    },
    {
      id: "2", 
      title: "Database optimization",
      description: "Optimize query performance for large datasets",
      assignee: "Bob Smith",
      status: "To Do",
      priority: "Medium",
      dueDate: "2024-02-20",
      project: "Backend"
    },
    {
      id: "3",
      title: "UI/UX redesign review",
      description: "Review and approve new design mockups",
      assignee: "Carol Davis",
      status: "Done",
      priority: "Medium",
      dueDate: "2024-02-10",
      project: "Design System"
    }
  ]);
  
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const handleAddTask = (task: any) => {
    const newTask = {
      ...task,
      id: (tasks.length + 1).toString()
    };
    setTasks([...tasks, newTask]);
    toast({
      title: "Task Added",
      description: "New task created successfully.",
    });
    addNotification({
      title: "New Task Created",
      message: `Task "${task.title}" has been assigned to ${task.assignee}`,
      type: "success",
      priority: "medium",
      category: "Tasks"
    });
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast({
      title: "Task Updated",
      description: `Task status changed to ${newStatus}.`,
    });
    if (task) {
      addNotification({
        title: "Task Status Updated",
        message: `"${task.title}" status changed to ${newStatus}`,
        type: newStatus === "Done" ? "success" : "info",
        priority: "low",
        category: "Tasks"
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "Task has been removed successfully.",
    });
    if (task) {
      addNotification({
        title: "Task Deleted",
        message: `Task "${task.title}" has been removed`,
        type: "warning",
        priority: "low",
        category: "Tasks"
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === "All" || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done": return <CheckCircle className="w-4 h-4 text-neon-green" />;
      case "In Progress": return <Clock className="w-4 h-4 text-neon-cyan" />;
      case "To Do": return <AlertCircle className="w-4 h-4 text-neon-yellow" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done": return "bg-neon-green/20 text-neon-green border-neon-green/30";
      case "In Progress": return "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30";
      case "To Do": return "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30";
      default: return "bg-secondary/20 text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-neon-red/20 text-neon-red border-neon-red/30";
      case "Medium": return "bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30";
      case "Low": return "bg-neon-green/20 text-neon-green border-neon-green/30";
      default: return "bg-secondary/20 text-muted-foreground";
    }
  };

  const tasksByStatus = {
    "To Do": filteredTasks.filter(t => t.status === "To Do"),
    "In Progress": filteredTasks.filter(t => t.status === "In Progress"),
    "Done": filteredTasks.filter(t => t.status === "Done")
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold gradient-text">Task & Project Board</h2>
        <AddTaskModal 
          onAddTask={handleAddTask}
          trigger={
            <Button className="glow-cyan">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          }
        />
      </div>

      {/* Task Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <AlertCircle className="h-4 w-4 text-neon-yellow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-yellow">{tasksByStatus["To Do"].length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-cyan">{tasksByStatus["In Progress"].length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">{tasksByStatus["Done"].length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-background/50 border-primary/30"
            />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-primary/30">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <Card key={status} className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(status)}
                <span className="gradient-text">{status}</span>
                <Badge variant="secondary" className="ml-auto">{statusTasks.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-smooth">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)} variant="outline">
                          {task.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>{task.assignee}</span>
                        </div>
                        <span className="text-muted-foreground">{task.dueDate}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {task.project}
                        </Badge>
                        
                        <div className="flex items-center gap-2">
                          <Select value={task.status} onValueChange={(value) => handleStatusChange(task.id, value as Task["status"])}>
                            <SelectTrigger className="w-24 h-6 text-xs bg-background/50 border-primary/30">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="To Do">To Do</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Done">Done</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {statusTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tasks in {status.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};