import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BrainIcon, LogOutIcon } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-16 w-full h-16 mt-4 mb-16">
      <BrainIcon />

      {/* User Dropdown */}
      <div>
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
