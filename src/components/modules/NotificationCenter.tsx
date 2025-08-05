import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  timestamp: Date;
  category: string;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load notifications from localStorage or generate sample notifications
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(savedNotifications).map((notif: any) => ({
        ...notif,
        timestamp: new Date(notif.timestamp)
      }));
      setNotifications(parsedNotifications);
    } else {
      // Generate sample notifications only on first load
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          title: 'GDPR Compliance Due',
          message: 'Annual GDPR review is due in 5 days. Please complete the assessment.',
          type: 'warning',
          priority: 'high',
          read: false,
          timestamp: new Date(),
          category: 'Compliance'
        },
        {
          id: '2',
          title: 'New Client Added',
          message: 'TechCorp has been successfully added to your CRM.',
          type: 'success',
          priority: 'medium',
          read: false,
          timestamp: new Date(Date.now() - 3600000),
          category: 'CRM'
        },
        {
          id: '3',
          title: 'Monthly Finance Report',
          message: 'October financial records have been updated.',
          type: 'info',
          priority: 'low',
          read: true,
          timestamp: new Date(Date.now() - 7200000),
          category: 'Finance'
        },
        {
          id: '4',
          title: 'Team Performance Alert',
          message: 'Overall team performance has increased by 15% this month.',
          type: 'success',
          priority: 'medium',
          read: false,
          timestamp: new Date(Date.now() - 86400000),
          category: 'HR'
        }
      ];
      
      setNotifications(sampleNotifications);
      localStorage.setItem('notifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-neon-green" />;
      case 'error':
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-neon-cyan" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-yellow-400 bg-yellow-400/5';
      case 'success':
        return 'border-l-neon-green bg-neon-green/5';
      case 'error':
        return 'border-l-destructive bg-destructive/5';
      default:
        return 'border-l-neon-cyan bg-neon-cyan/5';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been removed.",
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-bold gradient-text">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notification Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">All notifications</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {notifications.filter(n => n.priority === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Critical items</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-neon-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neon-green">
              {notifications.filter(n => 
                new Date(n.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Today's notifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up! No new notifications.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                "glass-card border-l-4 transition-smooth hover:glow-cyan",
                getNotificationColor(notification.type),
                !notification.read && "ring-1 ring-primary/20"
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getNotificationIcon(notification.type)}
                      <h3 className={cn(
                        "font-semibold",
                        !notification.read && "text-foreground",
                        notification.read && "text-muted-foreground"
                      )}>
                        {notification.title}
                      </h3>
                      <Badge className={cn("text-xs", getPriorityColor(notification.priority))}>
                        {notification.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {notification.category}
                      </Badge>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{notification.message}</p>
                    <div className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => markAsRead(notification.id)}
                        className="text-neon-green hover:text-neon-green"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};