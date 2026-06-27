"use client";

import { useState } from "react";
import MatchCard from "@/components/match-card";
import ExtraPredictionsForm from "@/components/extra-predictions-form";

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
  result: string | null;
  home_score: number | null;
  away_score: number | null;
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
  matches: Match[];
  teams: Team[];
  extraPredictions: ExtraPrediction[];
  extraResults: ExtraResult[];
  extraPredictionsLocked: boolean;
  extraPredictionsDeadline: string | null;
};

const tabs = [
  {
    label: "Predicciones extras",
    type: "extra",
    stages: [],
  },
  {
    label: "Eliminatoria de 32",
    type: "matches",
    stages: ["Eliminatoria de 32"],
  },
  {
    label: "Octavos de Final",
    type: "matches",
    stages: ["Octavos de Final"],
  },
  {
    label: "Cuartos de Final",
    type: "matches",
    stages: ["Cuartos de Final"],
  },
  {
    label: "Semifinal / Final",
    type: "matches",
    stages: ["Semifinales", "Final", "Eliminatoria por tercer lugar"],
  },
];

export default function DashboardTabs({
  matches,
  teams,
  extraPredictions,
  extraResults,
  extraPredictionsLocked,
  extraPredictionsDeadline,
}: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const [predictionsByMatch, setPredictionsByMatch] = useState<
    Record<number, string>
  >(() => {
    const initialValues: Record<number, string> = {};

    matches.forEach((match) => {
      initialValues[match.id] = match.initialPrediction ?? "";
    });

    return initialValues;
  });

  const [localExtraPredictions, setLocalExtraPredictions] =
    useState<ExtraPrediction[]>(extraPredictions);

  const currentTab = tabs.find((tab) => tab.label === activeTab)!;

  const filteredMatches = matches.filter((match) =>
    currentTab.stages.some(
      (stage) => match.stage?.toLowerCase() === stage.toLowerCase()
    )
  );

  function updateMatchPrediction(matchId: number, prediction: string) {
    setPredictionsByMatch((currentPredictions) => ({
      ...currentPredictions,
      [matchId]: prediction,
    }));
  }

  function updateExtraPredictions(savedPredictions: ExtraPrediction[]) {
    setLocalExtraPredictions((currentPredictions) => {
      const updatedPredictions = [...currentPredictions];

      savedPredictions.forEach((savedPrediction) => {
        const index = updatedPredictions.findIndex(
          (prediction) => prediction.bet_type === savedPrediction.bet_type
        );

        if (index >= 0) {
          updatedPredictions[index] = savedPrediction;
        } else {
          updatedPredictions.push(savedPrediction);
        }
      });

      return updatedPredictions;
    });
  }

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-xs text-center text-gray-500 dark:text-gray-400 md:hidden">
          Desliza hacia la derecha para ver más fases →
        </p>

        <div className="relative">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-gray-100 dark:from-gray-800 to-transparent z-10 md:hidden" />

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-sm overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-semibold transition whitespace-nowrap
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
      </div>

      <div className="space-y-6">
        {currentTab.type === "extra" ? (
          <ExtraPredictionsForm
            teams={teams}
            initialPredictions={localExtraPredictions}
            extraResults={extraResults}
            locked={extraPredictionsLocked}
            deadline={extraPredictionsDeadline}
            onPredictionsSaved={updateExtraPredictions}
          />
        ) : filteredMatches.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No hay partidos para esta fase.
          </p>
        ) : (
          filteredMatches.map((match) => {
            const currentPrediction = predictionsByMatch[match.id] ?? "";

            return (
              <MatchCard
                key={`${match.id}-${currentPrediction}`}
                matchId={match.id}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                stage={match.stage}
                kickoff={match.kickoff}
                initialPrediction={currentPrediction}
                result={match.result}
                home_score={match.home_score}
                away_score={match.away_score}
                onPredictionSaved={updateMatchPrediction}
              />
            );
          })
        )}
      </div>
    </div>
  );
}