import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import MobileNav from "@/components/mobile-nav";
import MobileMenu from "@/components/mobile-menu";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user!.id)
        .single();

    if (!user) {
        redirect("/auth/login");
    }

return (
  <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white">
    <nav className="bg-white border-b shadow-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="font-bold text-base md:text-xl truncate"
          >
            🏆 Quiniela Mundial 2026
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-blue-600">
              Inicio
            </Link>

            <Link href="/ranking" className="hover:text-blue-600">
              Ranking
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />

            <span className="text-sm text-gray-600 dark:text-gray-300">
              {profile?.display_name}
            </span>

            <LogoutButton />
          </div>

          <MobileMenu displayName={profile?.display_name} />
        </div>
      </div>
    </nav>

    <main className="max-w-7xl mx-auto p-4 md:p-6">
      {children}
    </main>
  </div>
);
}