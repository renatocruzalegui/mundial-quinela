import { createClient } from "@/lib/supabase/server";

type RankingRow = {
  user_id: string;
  display_name: string;
  points: number;
};

function getMedal(index: number) {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `#${index + 1}`;
}

export default async function RankingPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_ranking");

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Error cargando ranking</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  const ranking = data as RankingRow[];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">🏆 Ranking</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Puntaje actualizado de la quiniela
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl shadow overflow-hidden">
        {ranking.map((user, index) => (
          <div
            key={user.user_id}
            className="flex items-center justify-between px-5 py-4 border-b last:border-b-0 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <div className="text-2xl w-10 text-center">
                {getMedal(index)}
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {user.display_name}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Puesto {index + 1}
                </p>
              </div>
            </div>

            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {user.points} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}