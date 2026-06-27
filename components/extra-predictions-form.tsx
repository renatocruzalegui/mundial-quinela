"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

type Team = {
  id: number;
  name: string;
  code: string;
  flag_url: string;
};

type ExtraPrediction = {
  bet_type: string;
  team_id: number;
};

type ExtraResult = {
  bet_type: string;
  team_id: number | null;
  points: number;
};

type Props = {
  teams: Team[];
  initialPredictions: ExtraPrediction[];
  extraResults: ExtraResult[];
  locked: boolean;
  deadline: string | null;
  onPredictionsSaved?: (
    predictions: {
      bet_type: string;
      team_id: number;
    }[]
  ) => void;
};

const bets = [
  { type: "CHAMPION", label: "🥇 1er puesto / Campeón", points: 8 },
  { type: "RUNNER_UP", label: "🥈 2do puesto", points: 4 },
  { type: "THIRD_PLACE", label: "🥉 3er puesto", points: 4 },
  { type: "MOST_GOALS", label: "⚽ Equipo con más goles", points: 4 },
  { type: "BIGGEST_WIN", label: "🥅 Equipos con más goles en contra", points: 4 },
  { type: "MOST_RED_CARDS", label: "🟥 Equipo con más rojas", points: 4 },
];

export default function ExtraPredictionsForm({
  teams,
  initialPredictions,
  extraResults,
  locked,
  deadline,
  onPredictionsSaved,
}: Props) {
  const supabase = createClient();

  const [openAccordion, setOpenAccordion] = useState<string>("");

  const initialValues = Object.fromEntries(
    initialPredictions.map((p) => [p.bet_type, String(p.team_id)])
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saving, setSaving] = useState(false);

  async function saveExtraPredictions() {
      if (locked) {
        toast.error("Las predicciones extras ya están bloqueadas");
        return;
      }
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Debes iniciar sesión");
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
      toast.error("Error al guardar predicciones extra");
      return;
    }

    onPredictionsSaved?.(
      rows.map((row) => ({
        bet_type: row.bet_type,
        team_id: row.team_id,
      }))
    );

    toast.success("Predicciones guardadas correctamente");
  }

const [timeLeft, setTimeLeft] = useState("");

useEffect(() => {
    if (!deadline) return;

    function updateCountdown() {
      const now = new Date().getTime();
      const deadlineTime = new Date(deadline!).getTime();
      const distance = deadlineTime - now;

      if (distance <= 0) {
        setTimeLeft("Predicciones bloqueadas");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        days > 0
          ? `${days}d ${hours}h ${minutes}m`
          : `${hours}h ${minutes}m ${seconds}s`
      );
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
 
      <h2 className="text-2xl font-bold mb-2">Predicciones extras</h2>

      <p className="text-gray-600 dark:text-gray-300 mb-3">
        Estas predicciones se deben completar antes del inicio de las eliminatorias.
      </p>
      {deadline && (
        <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-center dark:border-blue-800 dark:bg-blue-950">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Las predicciones extras cierran en:
          </p>

          <p className="mt-1 text-1xl font-bold text-blue-600 dark:text-blue-400">
            ⏳ {timeLeft}
          </p>
        </div>
      )}

      {locked && (
        <div className="mb-4 rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800">
          🔒 Las predicciones extras están bloqueadas porque ya inició la eliminatoria.
        </div>
      )}
      <div className="space-y-4">
        <Accordion
          type="single"
          collapsible
          value={openAccordion}
          onValueChange={setOpenAccordion}
          className="space-y-3"
        >
          {bets.map((bet) => {
            const result = extraResults.find(
              (r) => r.bet_type === bet.type
            );

            const hasResult = result?.team_id != null;

            const isCorrect =
              hasResult && Number(values[bet.type]) === result?.team_id;

            const selectedTeam = teams.find(
              (team) => String(team.id) === values[bet.type]
            );

            return (
              <AccordionItem
                key={bet.type}
                value={bet.type}
                className="border rounded-xl px-4 bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <AccordionTrigger>
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold">
                      {bet.label} ({bet.points} pts)
                    </span>

                    <div className="mt-1">
                      {selectedTeam ? (
                        <div className="flex items-center gap-2">
                          <Image
                            src={selectedTeam.flag_url}
                            alt={selectedTeam.name}
                            width={24}
                            height={18}
                            className="rounded border"
                          />

                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedTeam.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Selecciona un equipo
                        </span>
                      )}
                    </div>
                    {hasResult && values[bet.type] && (
                      <div className="mt-2">
                        {isCorrect ? (
                          <span className="text-sm font-semibold text-green-600">
                            ✅ Acertaste +{result.points} pts
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-red-600">
                            ❌ Fallaste
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
                    {teams.map((team) => {
                      const selected = values[bet.type] === String(team.id);

                      return (
                        <button
                          key={team.id}
                          type="button"
                          disabled={locked}
                          onClick={() => {
                            if (locked) return;

                            setValues((prev) => ({
                              ...prev,
                              [bet.type]: String(team.id),
                            }));

                            setOpenAccordion("");
                          }}
                          className={`
                            flex items-center gap-3 rounded-xl border p-3 text-left transition
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${
                              selected
                                ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                                : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700"
                            }
                          `}
                        >
                          <Image
                            src={team.flag_url}
                            alt={team.name}
                            width={32}
                            height={24}
                            className="rounded"
                          />

                          <span className="font-medium">{team.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      <button
        onClick={saveExtraPredictions}
        disabled={saving || locked}
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
      >
        {locked
          ? "Predicciones bloqueadas"
          : saving
          ? "Guardando..."
          : "Guardar predicciones extras"}
      </button>
    </div>
  );
}