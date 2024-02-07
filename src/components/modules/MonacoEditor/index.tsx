import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';

import * as monaco from 'monaco-editor';

import {
  StyledContainer,
  StyledIconFile,
  StyledTabsContent,
  StyledTabFeatures,
  StyledWrapIconFeature,
  StyledWrapTabContent,
} from './styled';

import { TFileTree } from 'types/types';

import { ZipReader } from 'services/zip-reader';
import { ZipWriter } from 'services/zip-writer';

import Image from 'components/atoms/Image';
import ImageButton from 'components/atoms/ImageButton';
import FileTree from 'components/modules/FileTree';
import ImageInput from 'components/atoms/ImageInput';
import Tab from 'components/atoms/Tab';
import ImageEditor from 'components/atoms/ImageEditor';

import AddIcon from 'assets/icons/add-icon.svg';
import FileIcon from 'assets/icons/file-icon.svg';
import UploadIcon from 'assets/icons/upload-icon.svg';
import DownloadIcon from 'assets/icons/download-icon.svg';
import FileWrapIcon from 'assets/icons/file-wrap-icon.svg';
import ReloadIcon from 'assets/icons/reload-icon.svg';
import MenuIcon from 'assets/icons/menu-icon.svg';

import useScrollToActiveTab from 'hooks/useScrollToActiveTab';
import useTabRefs from 'hooks/useTabRefs';
import useUtilities from 'hooks/useUtilities';
import useInitializeEditor from 'hooks/useInitializeEditor';

type TProps = {};

const MonacoEditor: FC<TProps> = () => {
  const [files, setFiles] = useState<TFileTree>({});
  const [tabs, setTabs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{
    content?: string;
    blob?: string;
  }>({});
  const [createNewType, setCreateNewType] = useState<'folder' | 'file' | ''>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  const { onCheckFileType, onCheckLanguage } = useUtilities();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const tabRefs = useTabRefs(tabs);

  useScrollToActiveTab(selectedTab, tabRefs, tabs);

  // useInitializeEditor(editorRef, editorInstance, selectedFile, selectedTab);

  useEffect(() => {
    if (editorRef.current) {
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
      editorInstance.current && editorInstance.current.dispose();
    };
  }, [selectedFile.content, selectedTab, onCheckLanguage]);

  const onEditFileTree = (path: string, newValue: string) => {
    if (path && newValue) {
      const pathsArray = path.split('/').filter((p) => p);

      const updateObject = (obj: { [key: string]: any }, pathIndex: number): { [key: string]: any } => {
        if (pathIndex === pathsArray.length - 1) {
          return { ...obj, [pathsArray[pathIndex]]: { content: newValue } };
        }

        const currentPath = pathsArray[pathIndex];
        const nextObj = obj[currentPath] || {};

        return {
          ...obj,
          [currentPath]: updateObject(nextObj, pathIndex + 1),
        };
      };

      setFiles((prevState: TFileTree) => ({
        ...prevState,
        fileTree: updateObject(prevState.fileTree, 0),
      }));
    }
  };

  const onChangeZip = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const zipFile = event.target.files[0];
      const zipReader = new ZipReader();
      const fileTree = await zipReader.readFile(zipFile);
      setFiles(fileTree);
      setTabs([]);
    }
  };

  const onUploadZip = () => {
    fileInputRef.current?.click();
  };

  const onSelectTab = (tab: string) => {
    const pathParts = tab?.split('/');
    let currentElement: any = files.fileTree;
    if (pathParts) {
      for (const part of pathParts) {
        if (currentElement[part] && typeof currentElement[part] === 'object') {
          currentElement = currentElement[part] as TFileTree | { content: string | Uint8Array; blob?: string };
        } else {
          currentElement = null;
          break;
        }
      }

      if (currentElement && 'content' in currentElement) {
        setSelectedFile(currentElement);
      }
    } else {
      setSelectedFile({});
    }
  };

  const onCloseTab = (tab: string) => {
    const tabsArray = tabs.filter((item) => item !== tab);
    setTabs(tabsArray);
    if (tab === selectedTab) {
      setSelectedTab(tabsArray[0]);
      onSelectTab(tabsArray[0]);
    }
  };

  const onDownloadZip = (content: string, file: string) => {
    console.log('content: ', content);

    setFiles((prevFileTree: TFileTree) => {
      const parts = file.split('/');
      let currentLevel: any = {
        ...prevFileTree.fileTree,
      };

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!(part in currentLevel)) {
          return prevFileTree;
        }

        if (typeof currentLevel[part] === 'object' && currentLevel[part] !== null) {
          currentLevel[part] = { ...currentLevel[part] };
        }

        currentLevel = currentLevel[part] as TFileTree;
      }

      const lastPart = parts[parts.length - 1];
      if (typeof currentLevel[lastPart] === 'object' && currentLevel[lastPart] !== null) {
        (
          currentLevel[lastPart] as {
            content: string | Uint8Array;
            blob?: string;
          }
        ).content = content;
      }

      if (Object.keys({ ...prevFileTree }).length > 0) {
        const zipWriter = new ZipWriter('export.zip');
        zipWriter.generateFromFileTree(files.fileTree as TFileTree);
      }
      return { ...prevFileTree };
    });
  };

  const onAddFileTree = (path: string, key: string, type: 'folder' | 'file') => {
    let pathsArray = path.split('/').filter((p) => p);

    if (pathsArray[pathsArray.length - 1].includes('.')) {
      pathsArray = pathsArray.slice(0, -1);
    }

    const getValueBasedOnType = (type: 'folder' | 'file') => {
      return type === 'file' ? { content: '// Your code start here' } : {};
    };

    const updateNestedObject = (obj: { [key: string]: any }, pathIndex: number): { [key: string]: any } => {
      if (pathIndex === pathsArray.length) {
        return { ...obj, [key]: getValueBasedOnType(type) };
      }

      const currentPath = pathsArray[pathIndex];
      return {
        ...obj,
        [currentPath]: updateNestedObject(obj[currentPath] || {}, pathIndex + 1),
      };
    };

    setFiles((prevState: TFileTree) => ({
      ...prevState,
      fileTree: updateNestedObject(prevState.fileTree, 0),
    }));
  };

  return (
    <StyledContainer data-test-id='app-main' className='monaco-editor'>
      <StyledTabFeatures>
        <StyledWrapIconFeature>
          <ImageButton
            files={files}
            type='file'
            icon={AddIcon}
            tooltip='Add new file'
            onClick={() => setCreateNewType('file')}
          />
          <ImageButton
            files={files}
            type='folder'
            icon={FileIcon}
            tooltip='Add new folder'
            onClick={() => setCreateNewType('folder')}
          />
          <ImageInput icon={UploadIcon} onClick={onUploadZip} onChange={onChangeZip} fileInputRef={fileInputRef} />
          <ImageButton
            files={files}
            type='folder'
            icon={DownloadIcon}
            tooltip='Download zip file'
            onClick={() =>
              Object.keys(files).length && onDownloadZip(editorInstance.current?.getValue() as string, selectedTab)
            }
          />
        </StyledWrapIconFeature>
        <FileTree
          fileTree={files}
          setFilesTree={(type, path, key) => {
            onAddFileTree(path, key, type);
          }}
          setSelectedFile={setSelectedFile}
          setSelectedTab={setSelectedTab}
          tabs={tabs}
          setTabs={setTabs}
          selectedTab={selectedTab}
          createNewType={createNewType}
          setCreateNewType={setCreateNewType}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          onEditFileTree={() => {
            onEditFileTree(selectedTab, editorInstance.current?.getValue() || '');
          }}
        />
      </StyledTabFeatures>
      <StyledTabsContent>
        <StyledWrapTabContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
            }}
          >
            <div>
              <StyledIconFile>
                <Image src={FileWrapIcon} width={24} height={24} />
              </StyledIconFile>
            </div>
            <div style={{ overflowY: 'auto', display: 'flex', width: 'calc(100vw - 450px)' }}>
              {tabs.map((item, index) => {
                return (
                  <Tab
                    key={index}
                    selectedTab={selectedTab}
                    item={item}
                    tabRefs={tabRefs}
                    index={index}
                    setSelectedTab={setSelectedTab}
                    onEditFileTree={onEditFileTree}
                    editorInstance={editorInstance.current}
                    onSelectTab={onSelectTab}
                    setSelectedFolder={setSelectedFolder}
                    onCloseTab={onCloseTab}
                  />
                );
              })}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <Image src={ReloadIcon} width={16} height={16} />
            <div
              style={{
                margin: '0 16px',
              }}
            >
              <Image src={MenuIcon} width={16} height={16} />
            </div>
          </div>
        </StyledWrapTabContent>
        {tabs.length ? (
          <>
            {onCheckFileType(selectedTab.split('/').pop() || '') ? (
              <ImageEditor selectedFile={selectedFile} selectedTab={selectedTab} />
            ) : (
              <div ref={editorRef} style={{ height: '95%', width: '100%', paddingTop: '12px', paddingLeft: '12px' }} />
            )}
          </>
        ) : null}
      </StyledTabsContent>
    </StyledContainer>
  );
};

export default MonacoEditor;
