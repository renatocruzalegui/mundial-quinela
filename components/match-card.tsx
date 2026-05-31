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
};

export default function MatchCard({
    matchId,
    homeTeam,
    awayTeam,
    stage,
    kickoff,
    initialPrediction
}: Props) {
    const [prediction, setPrediction] = useState(
        initialPrediction ?? ""
    );

    const supabase = createClient();

    async function savePrediction() {
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

        alert("Pronostico guardado");
    }

    return (
        <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-md border p-6">
            <div className="text-center mb-4">
                <p className="text-sm text-gray-500">
                    {stage}
                </p>

                <p className="text-xs text-gray-400">
                    {new Date(kickoff).toLocaleString("es-PE")}
                </p>
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

                <div className="font-bold text-xl text-gray-500">
                    VS
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
                        checked={prediction === "HOME"}
                        onChange={(e) => setPrediction(e.target.value)}
                    />
                    {homeTeam.name}
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={`prediction-${matchId}`}
                        value="DRAW"
                        checked={prediction === "DRAW"}
                        onChange={(e) => setPrediction(e.target.value)}
                    />
                    Empate
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={`prediction-${matchId}`}
                        value="AWAY"
                        checked={prediction === "AWAY"}
                        onChange={(e) => setPrediction(e.target.value)}
                    />
                    {awayTeam.name}
                </label>
            </div>

            {initialPrediction && (
                <p className="mt-4 text-green-600 text-sm font-medium text-center">
                    ✓ Pronóstico guardado: {initialPrediction}
                </p>
            )}

            <button
                onClick={savePrediction}
                disabled={!prediction}
                className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300"
            >
                Guardar Pronostico
            </button>
        </div>
    );
}