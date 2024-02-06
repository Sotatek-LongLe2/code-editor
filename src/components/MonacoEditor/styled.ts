import styled from 'styled-components';

export const StyledContainer = styled.div`
  background-color: #292a2d;
  height: 100vh;
  width: 100%;
  display: flex;
  overflow-y: hidden;
`;

export const StyledTabFeatures = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledTabsContent = styled.div`
  overflow: hidden;
  width: 100%;
`;

export const StyledWrapIconFeature = styled.div`
  display: flex;
  gap: 16px;
  width: 300px;
  height: 52px;
  align-items: center;
  margin-left: 16px;
`;

export const StyledWrapTreeFile = styled.div`
  border-top: 1px solid #464659;
  border-right: 1px solid #464659;
  height: 100%;
  overflow: auto;
`;

export const StyledWrapTabContent = styled.div`
  background-color: #2e2e3a;
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledIconFile = styled.div`
  width: 50px;
  height: 50px;
  background-color: #464659;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledTabContent = styled.div`
  height: 42px;
  min-width: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 10px;
  position: relative;
  & > .icon {
    color: transparent;
    position: absolute;
    right: 16px;
  }
  &:hover {
    & > .icon {
      color: #778181;
    }
  }
`;

export const StyledLabel = styled.label`
  height: 20px;
  position: relative;
  &:hover {
    & > div {
      display: block;
    }
  }
  button {
    background-color: transparent;
    border: none;
    padding: 0;
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

export const StyledTooltip = styled.div`
  position: absolute;
  width: fit-content;
  background-color: #292a2d;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  text-align: center;
  padding: 6px;
  border: 1px solid white;
  white-space: nowrap;
  display: none;
`;
