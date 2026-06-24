"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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

    const [timeLeft, setTimeLeft] = useState("");

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
        const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
        );
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
                <p className="mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                ⏳ {timeLeft}
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
                            ✅ +{stage == "Eliminatoria de 32" ? "1" : stage == "Octavos de final" ? "2" : stage == "Cuartos de final" ? "4" : stage == "Semifinales" ? "6" : stage == "Eliminatoria por tercer lugar" ? "6" : stage == "Final" ? "10" : 0} punto
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