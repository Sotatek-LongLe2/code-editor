export type TFileTree = {
  [key: string]:
    | TFileTree
    | {
        content: string | Uint8Array;
        blob?: string;
      };
};

export type TZipEntry = {
  name: string;
  content: string | Uint8Array;
};

export type TFileTreeDisplayProps = {
  fileTree: TFileTree;
  tabs: string[];
  selectedTab: string;
  createNewType: 'folder' | 'file' | '';
  selectedFolder: string;
  setFilesTree: (value: 'folder' | 'file', path: string, key: string) => void;
  setSelectedFile: (
    value: React.SetStateAction<{
      content?: string | undefined;
      blob?: string | undefined;
    }>,
  ) => void;
  setSelectedTab: (value: React.SetStateAction<string>) => void;
  setTabs: (value: React.SetStateAction<string[]>) => void;
  setCreateNewType: (value: React.SetStateAction<'folder' | 'file' | ''>) => void;
  setSelectedFolder: (value: React.SetStateAction<string>) => void;
  onEditFileTree: () => void;
};
