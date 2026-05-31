import { createClient } from "@/lib/supabase/server";
import MatchCard from "@/components/match-card";

export const dynamic = "force-dynamic";

type Team = {
    id: number;
    name: string;
    code: string;
    flag_url: string;
};

type Match = {
    id: number;
    stage: string;
    kickoff: string;
    home_team: Team;
    away_team: Team;
};

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("matches")
        .select(`
      id,
      stage,
      kickoff,
      home_team:teams!matches_home_team_id_fkey (
        id,
        name,
        code,
        flag_url
      ),
      away_team:teams!matches_away_team_id_fkey (
        id,
        name,
        code,
        flag_url
      )
    `)
        .order("kickoff", { ascending: true });

    const matches = data as Match[] | null;


    const { data: { user },} = await supabase.auth.getUser();

    const { data: predictions } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user!.id);

    const predictionsMap = new Map(
        predictions?.map((p) => [p.match_id, p.prediction])
    );

    if (error) {
        return (
            <div>
                <h1>Error cargando partidos</h1>
                <p>{error.message}</p>
            </div>
        );
    }


    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">
                    🏆 Quiniela Mundial 2026
                </h1>

                <p className="text-gray-500 mt-2">
                    Realiza tus pronósticos antes del inicio de cada partido
                </p>
            </div>

            <div className="space-y-6">
                {matches?.map((match) => (
                    <MatchCard
                        key={match.id}
                        matchId={match.id}
                        homeTeam={match.home_team}
                        awayTeam={match.away_team}
                        stage={match.stage}
                        kickoff={match.kickoff}
                        initialPrediction={predictionsMap.get(match.id)}
                    />
                ))}
            </div>
        </div>
    );
}