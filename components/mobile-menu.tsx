"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  displayName?: string | null;
};

export default function MobileMenu({ displayName }: Props) {
  return (
    <div className="md:hidden flex items-center gap-2">
      <ThemeSwitcher />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Menu size={22} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-2 text-sm font-medium">
            {displayName ?? "Usuario"}
          </div>

          <DropdownMenuItem asChild>
            <Link href="/dashboard">Inicio</Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/ranking">Ranking</Link>
          </DropdownMenuItem>

          <div className="px-2 py-2">
            <LogoutButton />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}