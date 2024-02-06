import { MutableRefObject, RefObject, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import useUtilities from './useUtilities';

const useInitializeEditor = (
  editorRef: RefObject<HTMLDivElement>,
  editorInstance: MutableRefObject<monaco.editor.IStandaloneCodeEditor>,
  selectedFile: {
    content?: string;
    blob?: string;
  },
  selectedTab: string,
) => {
  const { onCheckLanguage } = useUtilities();

  useEffect(() => {
    if (editorRef && editorRef.current) {
      editorInstance.current = monaco.editor.create(editorRef.current, {
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

    return () => {
      if (editorInstance) {
        editorInstance.current.dispose();
      }
    };
  }, [selectedFile.content, selectedTab]);
};

export default useInitializeEditor;
