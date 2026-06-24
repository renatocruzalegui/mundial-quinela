"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    home_score: number;
    away_score: number;
};

export default function MatchCard({
    matchId,
    homeTeam,
    awayTeam,
    stage,
    kickoff,
    initialPrediction,
    result,
    home_score,
    away_score
}: Props) {
    const [prediction, setPrediction] = useState(
        initialPrediction ?? ""
    );

    const [predictionModified, setPredictionModified] = useState(
        initialPrediction ?? ""
    );

    const isLocked = new Date() >= new Date(kickoff);

    const correct = prediction === result;

    const supabase = createClient();

    async function savePrediction() {
        const isLocked = new Date() >= new Date(kickoff);
        if (isLocked) {
            alert("El partido ya comenzó");
            return;
        }
        
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Debes iniciar sesion");
            return;
        }

        const { error } = await supabase
            .from("predictions")
            .upsert(
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
            alert("Error al guardar");
            return;
        }

        setPredictionModified(prediction)
    }

    return (
        <div
            className={`
                w-full max-w-xl mx-auto rounded-2xl shadow-md border p-6
                ${isLocked
                ? "bg-gray-100 border-gray-300 dark:bg-gray-800"
                : "bg-white border-gray-200 dark:bg-gray-900"}
            `}
            >
            <div className="text-center mb-4">
                <p className="text-sm text-gray-500">
                    {stage}
                </p>

                <p className="text-xs text-gray-400">
                    {new Date(kickoff).toLocaleString("es-PE")}
                    
                </p>
                {isLocked && (
                <div className="mt-2 text-center text-red-600 font-medium">
                    🔒 Pronósticos cerrados
                </div>
                )}
                {!isLocked && (
                <div className="mt-2 text-center text-green-600 font-medium">
                    🟢 Pronósticos abiertos
                </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
                <div className="flex flex-col items-center text-center">
                    <Image
                        src={homeTeam.flag_url}
                        alt={homeTeam.name}
                        width={60}
                        height={45}
                        className="rounded"
                    />

                    <span className="mt-2 font-semibold">
                        {homeTeam.name}
                    </span>
                </div>

                <div className="font-bold text-xl text-gray-500 text-center">
                    VS
                    {result && (
                      <div className="text-center mt-4">
                        <p className="font-semibold text-green-600">
                        Resultado: {result == "HOME" ? homeTeam.name : awayTeam.name}
                        </p>
                    </div>
                    )}
                    {home_score !== null && away_score !== null && (
                    <div className="text-center mt-4">
                        <div className="text-3xl font-bold">
                        {home_score} - {away_score}
                        </div>
                    </div>
                    )}
                    {result && (
                    <div className="mt-3 text-center">
                        {correct ? (
                        <span className="text-green-600 font-bold">
                            ✅ +1 punto
                        </span>
                        ) : (
                        <span className="text-red-600 font-bold">
                            ❌ Fallaste
                        </span>
                        )}
                    </div>
                    )}
                </div>


                <div className="flex flex-col items-center text-center">
                    <Image
                        src={awayTeam.flag_url}
                        alt={awayTeam.name}
                        width={60}
                        height={45}
                        className="rounded"
                    />

                    <span className="mt-2 font-semibold">
                        {awayTeam.name}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={`prediction-${matchId}`}
                        value="HOME"
                        disabled={isLocked}
                        checked={prediction === "HOME"}
                        onChange={(e) => setPrediction(e.target.value)}
                    />
                    {homeTeam.name}
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={`prediction-${matchId}`}
                        value="AWAY"
                        disabled={isLocked}
                        checked={prediction === "AWAY"}
                        onChange={(e) => setPrediction(e.target.value)}
                    />
                    {awayTeam.name}
                </label>
            </div>

            {predictionModified && (
                <p className="mt-4 text-green-600 text-sm font-medium text-center">
                    ✓ Pronóstico guardado: {predictionModified == "HOME" ? homeTeam.name : predictionModified == "AWAY" ? awayTeam.name : ""}
                </p>
            )}

            <button
                onClick={savePrediction}
                disabled={!prediction  || isLocked}
                className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 dark:bg-gray-800"
            >
                {isLocked ? "Partido iniciado" : "Guardar Pronóstico"}
            </button>
        </div>
    );
}