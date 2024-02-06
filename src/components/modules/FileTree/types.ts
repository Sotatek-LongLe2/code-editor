import { SetStateAction } from 'react';
import { TFileTree } from 'types/types';

export type TTree = {
  fileTree: TFileTree;
  tabs: string[];
  selectedTab: string;
  createNewType: 'folder' | 'file' | '';
  selectedFolder: string;
  setFilesTree: (value: 'folder' | 'file', path: string, key: string) => void;
  setSelectedFile: (
    value: SetStateAction<{
      content?: string | undefined;
      blob?: string | undefined;
    }>,
  ) => void;
  setSelectedTab: (value: SetStateAction<string>) => void;
  setTabs: (value: SetStateAction<string[]>) => void;
  setCreateNewType: (value: SetStateAction<'folder' | 'file' | ''>) => void;
  setSelectedFolder: (value: SetStateAction<string>) => void;
  onEditFileTree: () => void;
};
