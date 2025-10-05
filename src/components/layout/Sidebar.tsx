import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bot, BarChart2, Settings, TerminalSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
const navigation = [
  { name: 'Mission Control', href: '/', icon: LayoutDashboard },
  { name: 'Agent Observatory', href: '/agents', icon: Bot },
  { name: 'Live Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Configuration', href: '/configuration', icon: Settings },
];
export function Sidebar() {
  return (
    <aside className="w-64 bg-background border-r-2 border-foreground flex flex-col fixed h-full">
      <div className="p-6 border-b-2 border-foreground flex items-center space-x-3">
        <div className="w-8 h-8 bg-electric-yellow flex items-center justify-center">
          <TerminalSquare className="w-6 h-6 text-background" />
        </div>
        <h1 className="text-xl font-bold font-mono tracking-wider">AETHER GTM</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-3 text-sm font-bold uppercase tracking-widest border-2 border-transparent transition-colors relative',
                isActive
                  ? 'bg-electric-yellow text-background'
                  : 'text-foreground hover:bg-gray-800'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-foreground" />}
                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t-2 border-foreground">
        <p className="text-xs text-muted-foreground">Built with ❤️ at Cloudflare</p>
      </div>
    </aside>
  );
}