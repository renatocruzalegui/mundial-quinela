"use client";

import { useState } from "react";
import MatchCard from "@/components/match-card";

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
    initialPrediction?: string;
    result: string;
    home_score: number;
    away_score: number;
};

type Props = {
    matches: Match[];
};

const tabs = [
    {
        label: "Eliminatoria de 32",
        stages: ["Eliminatoria de 32"],
    },
    {
        label: "Octavos de Final",
        stages: ["Octavos de Final"],
    },
    {
        label: "Cuartos de Final",
        stages: ["Cuartos de Final"],
    },
    {
        label: "Semifinal / Final",
        stages: ["Semifinales", "Final", "Eliminatoria por tercer lugar"],
    },
];

export default function DashboardTabs({ matches }: Props) {
    const [activeTab, setActiveTab] = useState(tabs[0].label);

    const currentTab = tabs.find((tab) => tab.label === activeTab)!;

    const filteredMatches = matches.filter((match) =>
        currentTab.stages.some((stage) =>
            match.stage?.toLowerCase() == stage.toLowerCase()
        )
    );

    return (
        <div>
            <div className="mb-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-sm overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                {tabs.map((tab) => (
                    <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.label)}
                    className={`
                        px-4 py-3 rounded-xl text-sm font-semibold transition
                        ${
                        activeTab === tab.label
                            ? "bg-blue-600 text-white shadow"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                    `}
                    >
                    {tab.label}
                    </button>
                ))}
                </div>
            </div>
            </div>

            <div className="space-y-6">
                {filteredMatches.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No hay partidos para esta fase.
                    </p>
                ) : (
                    filteredMatches.map((match) => (
                        <MatchCard
                            key={match.id}
                            matchId={match.id}
                            homeTeam={match.home_team}
                            awayTeam={match.away_team}
                            stage={match.stage}
                            kickoff={match.kickoff}
                            initialPrediction={match.initialPrediction}
                            result={match.result}
                            home_score={match.home_score}
                            away_score={match.away_score}
                        />
                    ))
                )}
            </div>
        </div>
    );
}