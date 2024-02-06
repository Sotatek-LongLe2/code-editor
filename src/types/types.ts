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
