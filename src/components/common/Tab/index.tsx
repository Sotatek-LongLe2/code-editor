import React from 'react';
import * as monaco from 'monaco-editor';

import { StyledTabContent } from 'components/layout/MonacoEditor/styles';

type TProps = {
  selectedTab: string;
  item: string;
  tabRefs: React.RefObject<HTMLDivElement>[];
  index: number;
  setSelectedTab: (value: React.SetStateAction<string>) => void;
  onEditFileTree: (path: string, newValue: string) => void;
  editorInstance: monaco.editor.IStandaloneCodeEditor | null;
  onSelectTab: (tab: string) => void;
  setSelectedFolder: (value: React.SetStateAction<string>) => void;
  onCloseTab: (tab: string) => void;
};

const Tab: React.FC<TProps> = ({
  selectedTab,
  item,
  tabRefs,
  index,
  setSelectedTab,
  onEditFileTree,
  editorInstance,
  onSelectTab,
  setSelectedFolder,
  onCloseTab,
}) => {
  return (
    <StyledTabContent
      style={{
        backgroundColor: selectedTab === item ? '#292a2d' : '#2e2e3a',
        color: selectedTab === item ? '#f8f8f8' : '#778181',
      }}
      ref={tabRefs[index]}
      key={index}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedTab(item);
        onEditFileTree(selectedTab, editorInstance?.getValue() || '');
        onSelectTab(item);
        setSelectedFolder('');
      }}
      data-testid='tab-content'
    >
      <div>{item.split('/').pop()}</div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onCloseTab(item);
        }}
        style={{
          color: selectedTab === item ? 'white' : '',
        }}
        className='icon'
      >
        ✖
      </div>
    </StyledTabContent>
  );
};

export default Tab;
