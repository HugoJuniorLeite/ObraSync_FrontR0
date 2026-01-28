// src/utils/redirectByRole.js

export const HOME_BY_ROLE = {
  1: "/rdo/gasista",        // 🔧 Gasista (fullscreen)
  7: "/rdo/minhas-notas",
  8: "/rdo/minhas-notas",
  6: "/funcionarios",
  3: "/rdo/minhas-notas",
  2: "/home",
  4: "/home",
  5: "/home",
};

export function getHomeRouteByOccupation(occupation) {
  return HOME_BY_ROLE[occupation] || "/home";
}
