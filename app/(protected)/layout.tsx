import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            href="/dashboard"
                            className="font-bold text-xl"
                        >
                            🏆 Quiniela Mundial 2026
                        </Link>

                        {/* Menú */}
                        <div className="flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="hover:text-blue-600"
                            >
                                Inicio
                            </Link>

                            <Link
                                href="/ranking"
                                className="hover:text-blue-600"
                            >
                                Ranking
                            </Link>

                        </div>

                        {/* Usuario */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">
                                {user.email}
                            </span>

                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-6">
                {children}
            </main>
        </div>
    );
}