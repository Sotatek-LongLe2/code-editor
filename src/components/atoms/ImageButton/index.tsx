import React from 'react';

import { TFileTree } from 'types/types';

import Image from 'components/atoms/Image';
import { StyledLabel, StyledTooltip } from 'components/modules/MonacoEditor/styled';

type TProps = {
  files: TFileTree;
  type: 'file' | 'folder';
  icon: string;
  tooltip: string;
  onClick: () => void;
};

const ImageButton: React.FC<TProps> = ({ files, type, icon, tooltip, onClick }) => {
  return (
    <StyledLabel htmlFor='create-file'>
      <button onClick={onClick} disabled={!Object.keys(files).length}>
        <Image src={icon} width={20} height={20} disabled={!Object.keys(files).length} />
      </button>
      <StyledTooltip>{tooltip}</StyledTooltip>
    </StyledLabel>
  );
};

export default ImageButton;
