import { useEffect } from 'react';
import * as monaco from 'monaco-editor';

import { onCheckLanguage } from 'utils';

const useInitiateEditor = (
  editorRef: React.RefObject<HTMLDivElement>,
  editorInstance: monaco.editor.IStandaloneCodeEditor | null,
  selectedFile: {
    content?: string;
    blob?: string;
  },
  selectedTab: string,
) => {
  useEffect(() => {
    if (editorRef && editorRef.current) {
      editorInstance = monaco.editor.create(editorRef.current, {
        value: selectedFile.content || '',
        language: onCheckLanguage(selectedTab.split('/').pop() || ''),
      });

      monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#292a2d',
        },
      });

      monaco.editor.setTheme('myCustomTheme');
    }

    // Cleanup function
    return () => {
      if (editorInstance) {
        editorInstance.dispose();
      }
    };
  }, [selectedFile.content, selectedTab]); // Dependencies for useEffect
};

export default useInitiateEditor;
