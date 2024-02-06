export type TFileTree = {
  [key: string]:
    | TFileTree
    | {
        content: string | Uint8Array;
        blob?: string;
      };
}

export type ZipEntry = {
  name: string;
  content: string | Uint8Array;
}

export type FileTreeDisplayProps = {
  fileTree: TFileTree;
  setFilesTree: (value: 'folder' | 'file', path: string, key: string) => void;
  setSelectedFile: (
    value: React.SetStateAction<{
      content?: string | undefined;
      blob?: string | undefined;
    }>,
  ) => void;
  setSelectedTab: (value: React.SetStateAction<string>) => void;
  tabs: string[];
  setTabs: (value: React.SetStateAction<string[]>) => void;
  selectedTab: string;
  createNewType: 'folder' | 'file' | '';
  setCreateNewType: (value: React.SetStateAction<'folder' | 'file' | ''>) => void;
  selectedFolder: string;
  setSelectedFolder: (value: React.SetStateAction<string>) => void;
  onEditFileTree: () => void;
}
