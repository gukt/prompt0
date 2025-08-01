import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { BrainIcon, LogOutIcon } from 'lucide-react';

interface HeaderProps {
  activeMenuItem: string;
  onMenuItemChange: (item: string) => void;
}

export const Header = ({ activeMenuItem, onMenuItemChange }: HeaderProps) => {
  return (
    <header className="grid grid-cols-3 items-center px-16 w-full h-16 mt-4 mb-16">
      <BrainIcon />

      {/* Dashboard & Discover Tabs */}
      <div className="flex items-center justify-center gap-8">
        <div
          onClick={() => onMenuItemChange('dashboard')}
          className={cn(
            'cursor-pointer hover:text-primary',
            activeMenuItem === 'dashboard' ? '' : 'text-muted-foreground',
          )}
        >
          Dashboard
        </div>
        <div
          onClick={() => onMenuItemChange('discover')}
          className={cn(
            'cursor-pointer hover:text-primary',
            activeMenuItem === 'discover' ? '' : 'text-muted-foreground',
          )}
        >
          Discover
        </div>
      </div>

      {/* User Dropdown */}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 text-sm" align="end">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              gukaitong@gmail.com
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-between">
              Logout <LogOutIcon />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
