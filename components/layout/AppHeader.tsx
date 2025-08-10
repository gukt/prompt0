import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BirdIcon, LogOutIcon } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="flex items-center justify-between px-4 xl:px-16 w-full h-20">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <BirdIcon />
        <span className="text-sm font-semibold">Prompt0</span>
      </div>

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
    </header>
  );
}
