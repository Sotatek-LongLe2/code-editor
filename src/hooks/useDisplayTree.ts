import { Dispatch, SetStateAction, useEffect } from 'react';

const useDisplayTree = (
  selectedTab: string,
  setHiddenItems: Dispatch<
    SetStateAction<{
      [key: string]: boolean;
    }>
  >,
) => {
  useEffect(() => {
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
  }, [selectedTab, setHiddenItems]);
};

export default useDisplayTree;
