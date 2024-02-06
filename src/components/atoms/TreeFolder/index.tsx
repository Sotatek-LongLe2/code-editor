import { FC, SetStateAction } from 'react';

import { StyledFolderSource, StyledText } from 'components/modules/FileTree/styled';

import FolderIcon from 'assets/icons/folder-icon.svg';
import ArrowIcon from 'assets/icons/arrow-icon.svg';

import Image from 'components/atoms/Image';

type TProps = {
  currentPath: string;
  selectedFolder: string;
  depth: number;
  hiddenItems: {
    [key: string]: boolean;
  };
  name: string;
  onToggleVisibility: (key: string) => void;
  setSelectedFolder: (value: SetStateAction<string>) => void;
  setSelectedTab: (value: SetStateAction<string>) => void;
};

const TreeFolder: FC<TProps> = ({
  onToggleVisibility,
  setSelectedFolder,
  setSelectedTab,
  currentPath,
  selectedFolder,
  depth,
  hiddenItems,
  name,
}) => {
  return (
    <StyledFolderSource
      onClick={() => {
        onToggleVisibility(currentPath);
        setSelectedFolder(currentPath);
        setSelectedTab('');
      }}
      style={{
        backgroundColor: selectedFolder === currentPath ? '#464659' : '',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '16px',
          paddingLeft: `${depth * 10}px`,
        }}
      >
        <Image src={FolderIcon} height={24} width={24} />
        <StyledText data-test-id='text-test'>{name}</StyledText>
      </div>
      <div
        style={{
          transform: hiddenItems[currentPath] ? '' : 'rotate(3.142rad)',
        }}
      >
        <Image src={ArrowIcon} height={24} width={24} />
      </div>
    </StyledFolderSource>
  );
};

export default TreeFolder;
