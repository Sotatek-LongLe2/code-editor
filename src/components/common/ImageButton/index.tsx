import React from 'react';

import { TFileTree } from 'libs/zip/types';

import { StyledLabel, StyledTooltip } from 'components/layout/MonacoEditor/styles';
import Image from 'components/common/Image';

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
