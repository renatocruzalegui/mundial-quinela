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
            <div className="mb-6 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(tab.label)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border ${activeTab === tab.label
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-white text-gray-700 border-gray-300"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
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
                        />
                    ))
                )}
            </div>
        </div>
    );
}