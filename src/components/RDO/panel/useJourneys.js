import { useEffect, useState } from "react";
import apiMobileJourney from "../../../services/apiMobileJourney";
import { readArray } from "../../../utils/storageSafe";



const JOURNEYS_KEY = "atendimentos_v3";

export function useJourneys() {
  const [journeys, setJourneys] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 fonte única do offline
  const loadLocal = () => readArray(JOURNEYS_KEY);

  const mergeJourneys = (apiJourneys = [], localJourneys = []) => {
    const map = new Map();

    localJourneys.forEach((j) => {
      if (j?.id) map.set(j.id, { ...j, source: "local" });
    });

    apiJourneys.forEach((j) => {
      if (j?.id) {
        map.set(j.id, {
          ...j,
          source: "api",
          sync_status: "synced",
        });
      }
    });

    return Array.from(map.values());
  };

  const load = async () => {
    const local = loadLocal();
    setJourneys(local);     // UX imediato
    setLoading(true);

    try {
      const apiJourneys = await apiMobileJourney.getMobileJourneys();
      setJourneys(mergeJourneys(apiJourneys, local));
    } catch {
      setJourneys(local);  // fallback offline
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return {
    getAll: () => journeys,
    loading,
    reload: load,
  };
}