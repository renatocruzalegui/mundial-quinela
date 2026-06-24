"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Team = {
  id: number;
  name: string;
};

type ExtraPrediction = {
  bet_type: string;
  team_id: number;
};

type Props = {
  teams: Team[];
  initialPredictions: ExtraPrediction[];
};

const bets = [
  { type: "CHAMPION", label: "1er puesto / Campeón", points: 8 },
  { type: "RUNNER_UP", label: "2do puesto", points: 4 },
  { type: "THIRD_PLACE", label: "3er puesto", points: 4 },
  { type: "MOST_GOALS", label: "Equipo con más goles", points: 4 },
  { type: "BIGGEST_WIN", label: "Mayor goleada", points: 4 },
  { type: "MOST_RED_CARDS", label: "Equipo con más rojas", points: 4 },
];

export default function ExtraPredictionsForm({
  teams,
  initialPredictions,
}: Props) {
  const supabase = createClient();

  const initialValues = Object.fromEntries(
    initialPredictions.map((p) => [p.bet_type, String(p.team_id)])
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saving, setSaving] = useState(false);

  async function saveExtraPredictions() {
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Debes iniciar sesión");
      setSaving(false);
      return;
    }

    const rows = bets
      .filter((bet) => values[bet.type])
      .map((bet) => ({
        user_id: user.id,
        bet_type: bet.type,
        team_id: Number(values[bet.type]),
      }));

    const { error } = await supabase
      .from("extra_predictions")
      .upsert(rows, {
        onConflict: "user_id,bet_type",
      });

    setSaving(false);

    if (error) {
      console.error(error);
      alert("Error al guardar predicciones extras");
      return;
    }

    alert("Predicciones extras guardadas");
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-2">Predicciones extras</h2>

      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Estas predicciones se deben completar antes del inicio de las eliminatorias.
      </p>

      <div className="space-y-4">
        {bets.map((bet) => (
          <div key={bet.type}>
            <label className="block text-sm font-semibold mb-1">
              {bet.label}{" "}
              <span className="text-blue-600 dark:text-blue-400">
                ({bet.points} pts)
              </span>
            </label>

            <select
              value={values[bet.type] ?? ""}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  [bet.type]: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2"
            >
              <option value="">Selecciona un equipo</option>

              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        onClick={saveExtraPredictions}
        disabled={saving}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
      >
        {saving ? "Guardando..." : "Guardar predicciones extras"}
      </button>
    </div>
  );
}