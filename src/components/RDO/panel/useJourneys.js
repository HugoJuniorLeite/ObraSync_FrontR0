// export function useJourneys() {
//   const load = () => {
//     try {
//       return JSON.parse(localStorage.getItem("obra_sync_jornadas")) || [];
//     } catch {
//       return [];
//     }
//   };

//   const getAll = () => load();

//   const filterByDate = (date) => {
//     if (!date) return load();
//     return load().filter(j => j.date === date);
//   };

//   return { getAll, filterByDate };
// }

// //versão nova teste -------------------------
// import { useEffect, useState } from "react";
// import { getCurrentJourneyId } from "../../../utils/journeyStore";
// import apiMobileJourney from "../../../services/apiMobileJourney";


// export function useJourneys() {
//   const [journeys, setJourneys] = useState([]);

//   // 🔥 LOAD LOCAL (fallback)
//   const loadLocal = () => {
//     try {
//       return getCurrentJourneyId();
//     } catch {
//       return [];
//     }
//   };

//   // 🔥 MERGE DENTRO DO HOOK
//   const mergeJourneys = (apiJourneys = [], localJourneys = []) => {
//     const map = new Map();

//     // 1️⃣ local primeiro
//     localJourneys.forEach((j) => {
//       map.set(j.id, {
//         ...j,
//         source: "local",
//       });
//     });

//     // 2️⃣ API sobrescreve
//     apiJourneys.forEach((j) => {
//       map.set(j.id, {
//         ...j,
//         source: "api",
//         sync_status: "synced",
//       });
//     });

//     return Array.from(map.values());
//   };

//   // 🔥 LOAD COMPLETO
//   const load = async () => {
//     // 1️⃣ mostra local imediatamente
//     const local = loadLocal();
//     setJourneys(local);

//     try {
//       // 2️⃣ busca API
//       const api = await apiMobileJourney.getMobileJourneys();

//       // 3️⃣ merge
//       const merged = mergeJourneys(api, local);
//       setJourneys(merged);
//     } catch {
//       // fallback local
//       setJourneys(local);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   // 🔹 API pública (mantém compatibilidade)
//   const getAll = () => journeys;

//   const filterByDate = (date) => {
//     if (!date) return journeys;
//     return journeys.filter((j) => j.date === date);
//   };

//   return {
//     getAll,
//     filterByDate,
//     reload: load,
//   };
// }


// versão 2

//---------------------------------------

// import { useEffect, useState } from "react";
// import apiMobileJourney from "../../../services/apiMobileJourney";
// import { loadSavedJourneys } from "../../../services/jornadaStorage";
// // import { useContext } from "react";
// // import { AuthContext } from "../../../contexts/AuthContext";



// export function useJourneys() {
//   const [journeys, setJourneys] = useState([]);
// //  const { user } = useContext(AuthContext);  // ✅ AQUI é o local correto

//   // 🔹 LOCAL: jornadas salvas offline (sempre array)
//   // const loadLocal = () => {
//   //   try {
//   //     return loadSavedJourneys();
//   //   } catch {
//   //     return [];
//   //   }
//   // };

//   const loadLocal = () => {
//   try {
//     const data = loadSavedJourneys();
//     return Array.isArray(data) ? data : [];
//   } catch {
//     return [];
//   }
// };

//   // 🔹 MERGE: API tem prioridade
//   // const mergeJourneys = (apiJourneys = [], localJourneys = []) => {
//   //   const map = new Map();

//   //   // local primeiro
//   //   localJourneys.forEach((j) => {
//   //     if (j && j.id) {
//   //       map.set(j.id, { ...j, source: "local" });
//   //     }
//   //   });

//   //   // api sobrescreve
//   //   apiJourneys.forEach((j) => {
//   //     if (j && j.id) {
//   //       map.set(j.id, {
//   //         ...j,
//   //         source: "api",
//   //         sync_status: "synced",
//   //       });
//   //     }
//   //   });

//   //   return Array.from(map.values());
//   // };

//   const mergeJourneys = (apiJourneys = [], localJourneys = []) => {
//   const localArr = Array.isArray(localJourneys) ? localJourneys : [];
//   const apiArr = Array.isArray(apiJourneys) ? apiJourneys : [];

//   const map = new Map();

//   localArr.forEach((j) => {
//     if (j?.id) map.set(j.id, { ...j, source: "local" });
//   });

//   apiArr.forEach((j) => {
//     if (j?.id) {
//       map.set(j.id, {
//         ...j,
//         source: "api",
//         sync_status: "synced",
//       });
//     }
//   });

//   return Array.from(map.values());
// };


//   // 🔹 LOAD PRINCIPAL
//   const load = async () => {
//     const local = loadLocal();
//     setJourneys(local); // UX imediato

//     try {
//       // ✅ ENDPOINT CORRETO
//       const apiJourneys = await apiMobileJourney.getMobileJourneys();

//       const merged = mergeJourneys(apiJourneys, local);
//       setJourneys(merged);
//     } catch (err) {
//       console.warn("API indisponível, usando jornadas locais");
//       setJourneys(local);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   // 🔹 API PÚBLICA DO HOOK
//   // const getAll = () => journeys;
//   const getAll = () => (Array.isArray(journeys) ? journeys : []);


//   const filterByDate = (date) => {
//     if (!date) return journeys;
//     return journeys.filter((j) => j.date === date);
//   };

//   return {
//     getAll,
//     filterByDate,
//     reload: load,
//   };
// }





//--------------------------------------------------------------------
//versão 3
//--------------------------------------------------------------------


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