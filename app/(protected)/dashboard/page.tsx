import { createClient } from "@/lib/supabase/server";
import DashboardTabs from "@/components/dashboard-tabs";

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
    result: string;
    home_score: number;
    away_score: number;
};

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("matches")
        .select(`
      id,
      stage,
      kickoff,
      result,
      home_score,
      away_score,
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


    const matchesWithPredictions =
        matches?.map((match) => ({
            ...match,
            initialPrediction: predictionsMap.get(match.id) ?? "",
        })) ?? [];

    const { data: teams } = await supabase
    .from("teams")
    .select("id, name, code, flag_url")
    .order("name");

    const { data: extraPredictions } = await supabase
        .from("extra_predictions")
        .select("bet_type, team_id")
        .eq("user_id", user!.id);


    const { data: extraResults } = await supabase
        .from("extra_results")
        .select("bet_type, team_id, points");

    const firstKnockoutMatch = matches?.find(
    (match) => match.stage === "Eliminatoria de 32"
    );

    const extraPredictionsDeadline = firstKnockoutMatch?.kickoff ?? null;

    const extraPredictionsLocked = firstKnockoutMatch
    ? new Date(firstKnockoutMatch.kickoff) <= new Date()
    : false;

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold">
                    🏆 Quiniela Mundial 2026
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Realiza tus pronósticos antes del inicio de cada partido
                </p>
            </div>

            <DashboardTabs
                matches={matchesWithPredictions}
                teams={teams ?? []}
                extraPredictions={extraPredictions ?? []}
                extraResults={extraResults ?? []}
                extraPredictionsLocked={extraPredictionsLocked}
                extraPredictionsDeadline={extraPredictionsDeadline}
                />
        </div>
    );
}