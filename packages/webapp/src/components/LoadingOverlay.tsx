import {  Spinner } from "@blueprintjs/core"
import styled from "styled-components"

export function LoadingOverlay() {
  return (
    <OverlayContainer>
      <Spinner size={50} />
    </OverlayContainer>
  );
}

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index:999;
  background: rgba(252, 253, 255, 0.5);
  display: flex;
  justify-content: center;
`;

