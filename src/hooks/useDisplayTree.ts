import { Dispatch, SetStateAction, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleVisibility } from 'store/features/tree/treeSlice';

const useDisplayTree = (selectedTab: string) => {
  const dispatch = useDispatch();

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
        dispatch(toggleVisibility({ key: res, value: false }));
      });
    }
  }, [selectedTab]);
};

export default useDisplayTree;
