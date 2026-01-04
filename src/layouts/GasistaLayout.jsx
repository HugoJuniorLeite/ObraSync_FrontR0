import { Outlet } from "react-router-dom";
import styled from "styled-components";

const FullscreenContainer = styled.div`
  width: 100vw;
  height: 100dvh; /* melhor que 100vh em mobile */
  background: radial-gradient(
    ellipse at top,
    #0b1e2d 0%,
    #06141f 60%,
    #050e16 100%
  );

  display: flex;
  justify-content: center;
  align-items: flex-start;

  /* 🔽 reduz espaço superior */
  padding-top: env(safe-area-inset-top, 8px);
`;

export default function GasistaLayout() {
  return (
    <FullscreenContainer>
      <Outlet />
    </FullscreenContainer>
  );
}
