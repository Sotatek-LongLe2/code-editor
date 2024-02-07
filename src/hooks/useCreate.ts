import { RefObject, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toggleVisibility } from 'store/features/tree/treeSlice';

const useCreate = (
  createNewType: 'folder' | 'file' | '',
  selectedTab: string,
  inputRef: RefObject<HTMLInputElement | null>,
) => {
  const dispatch = useDispatch();

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
          dispatch(toggleVisibility({ key: res, value: false }));
        });
      }

      setTimeout(() => {
        inputRef.current && inputRef.current.focus();
        inputRef.current && inputRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [createNewType, selectedTab, inputRef]);
};

export default useCreate;
