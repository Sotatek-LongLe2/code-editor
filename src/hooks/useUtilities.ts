import { useCallback } from 'react';

const useUtilities = () => {
  const onCheckFileType = useCallback((tab: string) => {
    switch (tab.split('.').pop()) {
      case 'png':
      case 'jpeg':
      case 'jpg':
        return true;
      default:
        return false;
    }
  }, []);

  const onCheckLanguage = useCallback((lang: string) => {
    switch (lang.split('.').pop()) {
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      default:
        return '';
    }
  }, []);

  return { onCheckFileType, onCheckLanguage };
};

export default useUtilities;
