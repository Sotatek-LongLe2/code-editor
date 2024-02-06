import { RefObject, SetStateAction, useEffect } from 'react';

const useAbortCreating = (
  inputRef: RefObject<HTMLInputElement | null>,
  setCreateNewType: (value: SetStateAction<'' | 'folder' | 'file'>) => void,
) => {
  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setCreateNewType('');
      }
    };

    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [inputRef, setCreateNewType]);
};

export default useAbortCreating;
