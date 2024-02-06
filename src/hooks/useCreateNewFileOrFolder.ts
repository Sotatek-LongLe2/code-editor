import { useEffect } from 'react';

const useCreateNewTypeEffect = (
  createNewType: 'folder' | 'file' | '',
  selectedTab: string,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>,
  setHiddenItems: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean;
    }>
  >,
  inputRef: React.RefObject<HTMLInputElement | null>,
) => {
  useEffect(() => {
    if (createNewType) {
      setIsEditing(true);

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
  }, [createNewType, selectedTab, setIsEditing, setHiddenItems, inputRef]);
};

export default useCreateNewTypeEffect;
