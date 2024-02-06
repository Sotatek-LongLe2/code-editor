import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';

const useCreate = (
  createNewType: 'folder' | 'file' | '',
  selectedTab: string,
  setHiddenItems: Dispatch<
    SetStateAction<{
      [key: string]: boolean;
    }>
  >,
  inputRef: RefObject<HTMLInputElement | null>,
) => {
  useEffect(() => {
    if (createNewType) {
      if (selectedTab) {
        const parts = selectedTab.split('/');

        let result = [];
        let currentPath = '';

        for (let i = 0; i < parts.length - 1; i++) {
          if (i > 0) {
            currentPath += '/';
          }
          currentPath += parts[i];
          result.push(currentPath);
        }

        result.forEach((res) => {
          setHiddenItems((prev) => ({ ...prev, [res]: false }));
        });
      }

      setTimeout(() => {
        inputRef.current && inputRef.current.focus();
        inputRef.current && inputRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [createNewType, selectedTab, setHiddenItems, inputRef]);
};

export default useCreate;
