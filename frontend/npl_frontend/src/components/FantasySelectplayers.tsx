import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCSRF, getCookie } from "./csrf";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

interface Player {
  player_id: number;
  player_name: string;
  role: string;
  cost: number;
  team_name: string;
  team_id: number;
}

export default function FantasySelectPlayers() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [captain, setCaptain] = useState<number | null>(null);
  const [viceCaptain, setViceCaptain] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_PLAYERS = 7;
  const MAX_BUDGET = 60;
  const MAX_PER_TEAM = 4;
  const MAX_PER_ROLE = 3;

  useEffect(() => {
    fetch(`${API_BASE_URL}/fantasy/select/${matchId}/`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.players);
        if (data.existing_team) {
          setSelected(data.existing_team.players);
          setCaptain(data.existing_team.captain);
          setViceCaptain(data.existing_team.vice_captain);
        }
      });
  }, [matchId]);

  const selectedPlayers = useMemo(
    () => players.filter((p) => selected.includes(p.player_id)),
    [players, selected],
  );

  const totalCost = selectedPlayers.reduce((s, p) => s + p.cost, 0);
  const budgetLeft = MAX_BUDGET - totalCost;
  const playersLeft = MAX_PLAYERS - selected.length;

  const teamCount = useMemo(() => {
    const map: Record<number, number> = {};
    selectedPlayers.forEach((p) => {
      map[p.team_id] = (map[p.team_id] || 0) + 1;
    });
    return map;
  }, [selectedPlayers]);

  const roleCount = useMemo(() => {
    const map: Record<string, number> = {};
    selectedPlayers.forEach((p) => {
      map[p.role] = (map[p.role] || 0) + 1;
    });
    return map;
  }, [selectedPlayers]);

  const playersByTeam = useMemo(() => {
    const teams: Record<number, Player[]> = {};
    players.forEach((p) => {
      if (!teams[p.team_id]) teams[p.team_id] = [];
      teams[p.team_id].push(p);
    });
    return teams;
  }, [players]);

  const teamIds = useMemo(() => Object.keys(playersByTeam).map(Number), [playersByTeam]);

  const togglePlayer = (id: number) => {
    setError(null);

    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
      if (captain === id) setCaptain(null);
      if (viceCaptain === id) setViceCaptain(null);
      return;
    }

    const p = players.find((x) => x.player_id === id);
    if (!p) return;

    if (selected.length >= MAX_PLAYERS)
      return setError("You can select only 7 players");

    if (budgetLeft < p.cost) return setError("Not enough budget");

    if ((teamCount[p.team_id] || 0) >= MAX_PER_TEAM)
      return setError("Max 4 players allowed from one team");

    if ((roleCount[p.role] || 0) >= MAX_PER_ROLE)
      return setError(`Max 3 players allowed for role: ${p.role}`);

    setSelected([...selected, id]);
  };

  const submitTeam = async () => {
    if (selected.length !== 7) return setError("Select exactly 7 players");

    if (!captain || !viceCaptain)
      return setError("Assign Captain and Vice-Captain");

    if (captain === viceCaptain)
      return setError("Captain and Vice-Captain must be different");

    setSubmitting(true);
    try {
      await getCSRF();
      const csrfToken = getCookie("csrftoken");

      const res = await fetch(
        `${API_BASE_URL}/fantasy/select/${matchId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(csrfToken && { "X-CSRFToken": csrfToken }),
          },
          credentials: "include",
          body: JSON.stringify({
            players: selected,
            captain,
            vice_captain: viceCaptain,
          }),
        },
      );

      if (res.ok) {
        navigate(`/fantasy/view/${matchId}`);
      } else {
        setError("Failed to save team");
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header with Rules */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Build Your Fantasy Team</h1>
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-xs font-medium text-blue-700">Exactly 7 players</span>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-xs font-medium text-blue-700">Max 4 from one team</span>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-xs font-medium text-blue-700">Max 3 per role</span>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-xs font-medium text-blue-700">Budget ≤ 60</span>
            </div>
            <div className="px-3 py-1.5 bg-blue-50 rounded-md border border-blue-200">
              <span className="text-xs font-medium text-blue-700">1 Captain & 1 Vice-Captain</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* PLAYER POOLS - SIDE BY SIDE */}
          <div className="xl:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamIds.map((teamId, idx) => {
                const teamPlayers = playersByTeam[teamId] || [];
                const teamName = teamPlayers[0]?.team_name || `Team ${idx + 1}`;

                return (
                  <div key={teamId} className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-5 py-4 bg-gradient-to-r from-red-600 to-blue-700 rounded-t-xl">
                      <h2 className="text-lg font-bold text-white flex items-center justify-between">
                        <span>{teamName}</span>
                        <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">
                          {(teamCount[teamId] || 0)}/{MAX_PER_TEAM}
                        </span>
                      </h2>
                    </div>

                    <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
                      {teamPlayers.map((p) => {
                        const isSelected = selected.includes(p.player_id);
                        const isCaptain = captain === p.player_id;
                        const isViceCaptain = viceCaptain === p.player_id;

                        return (
                          <div
                            key={p.player_id}
                            onClick={() => togglePlayer(p.player_id)}
                            className={`relative p-3 rounded-lg cursor-pointer transition-all
                              ${isSelected
                                ? 'bg-blue-200 border-2 border-blue-500'
                                : 'bg-gray-50 border-2 border-transparent hover:border-gray-300'
                              }`}
                          >
                            {(isCaptain || isViceCaptain) && (
                              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md
                                ${isCaptain ? 'bg-red-600' : 'bg-blue-800'}`}>
                                {isCaptain ? 'C' : 'VC'}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate">
                                  {p.player_name}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5 uppercase">
                                  {p.role}
                                </p>
                              </div>
                              <div className="text-right ml-3">
                                <span className="font-bold text-lg text-blue-600">
                                  ₹{p.cost}
                                </span>
                                {isSelected && (
                                  <div className="flex justify-end mt-1">
                                    <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center">
                                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SELECTED TEAM SIDEBAR */}
          <div className="xl:sticky xl:top-6 h-fit">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="bg-gradient-to-r from-red-600 to-blue-700 px-5 py-4 rounded-t-xl">
                <h2 className="text-lg font-bold text-white">Your Team</h2>
              </div>
              
              <div className="p-5">

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-2 text-sm font-semibold text-red-700">{error}</p>
                    </div>
                  </div>
                )}
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium mb-1">Players Left</p>
                    <p className="text-3xl font-bold text-blue-700">{playersLeft}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium mb-1">Budget Left</p>
                    <p className="text-3xl font-bold text-blue-700">₹{budgetLeft}</p>
                  </div>
                </div>

                {/* Selected Players List */}
                <div className="space-y-2 mb-5">
                  {selectedPlayers.map((p) => (
                    <div
                      key={p.player_id}
                      className="flex justify-between items-center bg-gray-50 px-3 py-3 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-sm">{p.player_name}</p>
                        <p className="text-xs text-gray-500">{p.team_name}</p>
                      </div>

                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => setCaptain(p.player_id)}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                            captain === p.player_id
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          C
                        </button>

                        <button
                          onClick={() => setViceCaptain(p.player_id)}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                            viceCaptain === p.player_id
                              ? 'bg-blue-800 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          VC
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty Slots */}
                  {[...Array(playersLeft)].map((_, i) => (
                    <div
                      key={i}
                      className="text-center text-sm text-gray-400 border-2 border-dashed border-gray-300 py-4 rounded-lg bg-gray-50"
                    >
                      Empty Slot
                    </div>
                  ))}
                </div>

                
                  
                {/* Submit Button */}
                <button
                  onClick={submitTeam}
                  disabled={submitting}
                  className={`w-full py-4 rounded-xl font-black text-white px-6 shadow-lg transition-all duration-300 flex items-center justify-center gap-3
                    ${submitting 
                      ? 'bg-gray-400 cursor-not-allowed scale-95' 
                      : 'bg-linear-to-r from-brand-red to-brand-blue hover:shadow-xl active:scale-[0.98] cursor-pointer'
                    }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="uppercase tracking-widest text-sm">Saving Squad...</span>
                    </>
                  ) : (
                    <span className="uppercase tracking-widest text-sm">Deploy Squad</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}