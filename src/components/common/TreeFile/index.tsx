import React from 'react';

import { StyledFileSource, StyledText } from 'components/layout/FileTree/styles';
import Image from 'components/common/Image';

import ImageIcon from 'assets/icons/image-icon.svg';
import FileCodeIcon from 'assets/icons/file-code-icon.svg';

type TProps = {
  currentPath: string;
  onOpenFile: (currentPath: string, isNew: boolean) => void;
  setSelectedFolder: (value: React.SetStateAction<string>) => void;
  onEditFileTree: () => void;
  selectedTab: string;
  style: {
    marginLeft: string;
  };
  onCheckFileType: (tab: string) => boolean;
  name: string;
};

const TreeFile: React.FC<TProps> = ({
  onOpenFile,
  currentPath,
  setSelectedFolder,
  onEditFileTree,
  selectedTab,
  style,
  onCheckFileType,
  name,
}) => {
  return (
    <StyledFileSource
      onClick={() => {
        onOpenFile(currentPath, false);
        setSelectedFolder('');
        onEditFileTree();
      }}
      style={{ backgroundColor: selectedTab === currentPath ? '#464659' : '' }}
    >
      <div style={style}>
        <Image
          src={onCheckFileType(currentPath.split('/').pop() || '') ? ImageIcon : FileCodeIcon}
          height={24}
          width={24}
        />
      </div>
      <StyledText>{name}</StyledText>
    </StyledFileSource>
  );
};

export default TreeFile;
