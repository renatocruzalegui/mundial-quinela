"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type Team = {
  id: number;
  name: string;
  code: string;
  flag_url: string;
};

type Props = {
  matchId: number;
  homeTeam: Team;
  awayTeam: Team;
  stage: string;
  kickoff: string;
  initialPrediction?: string;
  result: string | null;
  home_score: number | null;
  away_score: number | null;
  onPredictionSaved?: (matchId: number, prediction: string) => void;
};

function getStagePoints(stage: string) {
  const normalizedStage = stage.toLowerCase();

  if (normalizedStage === "eliminatoria de 32") return 1;
  if (normalizedStage === "octavos de final") return 2;
  if (normalizedStage === "cuartos de final") return 4;
  if (normalizedStage === "semifinales") return 6;
  if (normalizedStage === "eliminatoria por tercer lugar") return 6;
  if (normalizedStage === "final") return 10;

  return 0;
}

export default function MatchCard({
  matchId,
  homeTeam,
  awayTeam,
  stage,
  kickoff,
  initialPrediction,
  result,
  home_score,
  away_score,
  onPredictionSaved,
}: Props) {
  const [prediction, setPrediction] = useState(initialPrediction ?? "");
  const [predictionModified, setPredictionModified] = useState(
    initialPrediction ?? ""
  );
  const [timeLeft, setTimeLeft] = useState("");

  const supabase = createClient();

  const isLocked = new Date() >= new Date(kickoff);
  const correct = result && predictionModified === result;
  const points = getStagePoints(stage);

  useEffect(() => {
    setPrediction(initialPrediction ?? "");
    setPredictionModified(initialPrediction ?? "");
  }, [initialPrediction, matchId]);

  async function savePrediction() {
    if (isLocked) {
      toast.error("El partido ya comenzó");
      return;
    }

    if (!prediction) {
      toast.error("Debes seleccionar un equipo");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Debes iniciar sesión");
      return;
    }

    const { error } = await supabase.from("predictions").upsert(
      {
        user_id: user.id,
        match_id: matchId,
        prediction,
      },
      {
        onConflict: "user_id,match_id",
      }
    );

    if (error) {
      console.error(error);
      toast.error("Error al guardar");
      return;
    }

    setPredictionModified(prediction);
    onPredictionSaved?.(matchId, prediction);

    toast.success("Predicción guardada correctamente");
  }

  useEffect(() => {
    function updateCountdown() {
      const now = new Date().getTime();
      const kickoffTime = new Date(kickoff).getTime();
      const distance = kickoffTime - now;

      if (distance <= 0) {
        setTimeLeft("Partido iniciado");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [kickoff]);

  return (
    <div
      className={`
        w-full max-w-xl mx-auto rounded-2xl shadow-md border p-6
        ${
          isLocked
            ? "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
            : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700"
        }
      `}
    >
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{stage}</p>

        <p className="text-xs text-gray-400">
          {new Date(kickoff).toLocaleString("es-PE")}
        </p>

        <p className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
          ⏳ {timeLeft}
        </p>

        {isLocked ? (
          <div className="mt-2 text-center text-red-600 font-medium">
            🔒 Pronósticos cerrados
          </div>
        ) : (
          <div className="mt-2 text-center text-green-600 font-medium">
            🟢 Pronósticos abiertos
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 md:gap-8 mb-6">
        <button
          type="button"
          disabled={isLocked}
          onClick={() => setPrediction("HOME")}
          className={`
            flex flex-col items-center justify-between rounded-2xl border p-3 transition
            w-[112px] h-[138px] md:w-36 md:h-[150px]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              prediction === "HOME"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            }
          `}
        >
          <div className="relative w-[70px] h-[46px] overflow-hidden rounded-md bg-white">
            <Image
              src={homeTeam.flag_url}
              alt={homeTeam.name}
              fill
              sizes="70px"
              className="object-cover"
            />
          </div>

          <span className="h-[42px] flex items-center justify-center font-semibold text-center text-sm leading-tight">
            {homeTeam.name}
          </span>
        </button>

        <div className="text-center min-w-[64px] md:min-w-[90px]">
          <div className="text-2xl font-bold text-gray-500">VS</div>

          {home_score !== null && away_score !== null && (
            <div className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
              {home_score} - {away_score}
            </div>
          )}

          {result && (
            <div className="mt-3">
              <p className="font-semibold text-green-600 text-sm">
                Resultado:{" "}
                {result === "HOME"
                  ? homeTeam.name
                  : result === "AWAY"
                  ? awayTeam.name
                  : ""}
              </p>
            </div>
          )}

          {result && predictionModified && (
            <div className="mt-3">
              {correct ? (
                <span className="text-green-600 font-bold">
                  ✅ +{points} pts
                </span>
              ) : (
                <span className="text-red-600 font-bold">❌ Fallaste</span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={isLocked}
          onClick={() => setPrediction("AWAY")}
          className={`
            flex flex-col items-center justify-between rounded-2xl border p-3 transition
            w-[112px] h-[138px] md:w-36 md:h-[150px]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              prediction === "AWAY"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            }
          `}
        >
          <div className="relative w-[70px] h-[46px] overflow-hidden rounded-md bg-white">
            <Image
              src={awayTeam.flag_url}
              alt={awayTeam.name}
              fill
              sizes="70px"
              className="object-cover"
            />
          </div>

          <span className="h-[42px] flex items-center justify-center font-semibold text-center text-sm leading-tight">
            {awayTeam.name}
          </span>
        </button>
      </div>

      {predictionModified && (
        <p className="mt-4 text-green-600 text-sm font-medium text-center">
          ✓ Pronóstico guardado:{" "}
          {predictionModified === "HOME"
            ? homeTeam.name
            : predictionModified === "AWAY"
            ? awayTeam.name
            : ""}
        </p>
      )}

      <button
        onClick={savePrediction}
        disabled={!prediction || isLocked}
        className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:text-gray-600 dark:disabled:bg-gray-700"
      >
        {isLocked ? "Partido iniciado" : "Guardar Pronóstico"}
      </button>
    </div>
  );
}