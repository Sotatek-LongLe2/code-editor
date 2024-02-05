import styled from 'styled-components';

export const StyledFolderSource = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  &:hover {
    background-color: #464659;
  }
`;

export const StyledText = styled.div`
  color: #a3a3a5;
  font-size: 16px;
`;

export const StyledFileSource = styled.div`
  display: flex;
  gap: 16px;
  padding-left: 16px;
  height: 50px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #464659;
  }
`;
