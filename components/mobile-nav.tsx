"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="p-2">
        <Menu size={24} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-16 bg-white dark:bg-gray-900 border-b dark:border-gray-700 p-4 space-y-3 z-50">
          <Link href="/dashboard" className="block">Inicio</Link>
          <Link href="/predictions" className="block">Pronósticos</Link>
          <Link href="/ranking" className="block">Ranking</Link>
          <Link href="/profile" className="block">Mi Perfil</Link>
        </div>
      )}
    </div>
  );
}