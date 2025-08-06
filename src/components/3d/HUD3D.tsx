import { Html } from '@react-three/drei'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Settings, User, LogOut } from 'lucide-react'

interface HUD3DProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

export const HUD3D = ({ activeModule, onModuleChange }: HUD3DProps) => {
  return (
    <>
      {/* Top HUD */}
      <Html
        position={[0, 8, 0]}
        transform={false}
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        <div className="glass-card p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-medium gradient-text">STRATA 3D</span>
          </div>
          <Badge variant="secondary" className="neon-border">
            {activeModule.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></div>
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Html>

      {/* Bottom HUD */}
      <Html
        position={[0, -8, 0]}
        transform={false}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}
      >
        <div className="glass-card p-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Use mouse to navigate • Scroll to zoom • Click modules to interact</p>
            <p className="text-xs mt-1">Ultra Realistic 3D Dashboard</p>
          </div>
        </div>
      </Html>

      {/* Side Panel */}
      <Html
        position={[-10, 0, 0]}
        transform={false}
        style={{
          position: 'fixed',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
        }}
      >
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-sm font-semibold gradient-text">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Revenue</span>
              <span className="text-primary">$45.2K</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Clients</span>
              <span className="text-secondary">2,350</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Tasks</span>
              <span className="text-accent">12</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full neon-border"
            onClick={() => onModuleChange('dashboard')}
          >
            Reset View
          </Button>
        </div>
      </Html>

      {/* Right Panel */}
      <Html
        position={[10, 0, 0]}
        transform={false}
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
        }}
      >
        <div className="glass-card p-4 space-y-3">
          <h3 className="text-sm font-semibold gradient-text">3D Controls</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div>🖱️ Rotate: Drag</div>
            <div>🔍 Zoom: Scroll</div>
            <div>📱 Pan: Right click + drag</div>
            <div>🎯 Select: Click modules</div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full"
            onClick={() => window.location.reload()}
          >
            <LogOut className="w-3 h-3 mr-2" />
            Exit 3D
          </Button>
        </div>
      </Html>
    </>
  )
}