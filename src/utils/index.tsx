export const onCheckFileType = (tab: string) => {
  switch (tab.split('.').pop()) {
    case 'png':
    case 'jpeg':
    case 'jpg':
      return true;
    default:
      return false;
  }
};

export const onCheckLanguage = (lang: string) => {
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
};
