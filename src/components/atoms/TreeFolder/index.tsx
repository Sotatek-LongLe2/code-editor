import { FC, SetStateAction } from 'react';

import { StyledFolderSource, StyledText } from 'components/modules/FileTree/styled';

import FolderIcon from 'assets/icons/folder-icon.svg';
import ArrowIcon from 'assets/icons/arrow-icon.svg';

import Image from 'components/atoms/Image';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { toggleVisibility } from 'store/features/tree/treeSlice';

type TProps = {
  currentPath: string;
  selectedFolder: string;
  depth: number;
  name: string;
  setSelectedFolder: (value: SetStateAction<string>) => void;
  setSelectedTab: (value: SetStateAction<string>) => void;
};

const TreeFolder: FC<TProps> = ({ setSelectedFolder, setSelectedTab, currentPath, selectedFolder, depth, name }) => {
  const dispatch = useDispatch();
  const treeStructure = useSelector((state: RootState) => state.tree.treeStructure);

  return (
    <StyledFolderSource
      onClick={() => {
        dispatch(toggleVisibility({ key: currentPath, value: !treeStructure[currentPath] }));
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
          transform: treeStructure[currentPath] ? '' : 'rotate(3.142rad)',
        }}
      >
        <Image src={ArrowIcon} height={24} width={24} />
      </div>
    </StyledFolderSource>
  );
};

export default TreeFolder;
