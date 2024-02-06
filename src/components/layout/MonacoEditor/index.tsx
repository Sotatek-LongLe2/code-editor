import { useRef, useState } from 'react';

import * as monaco from 'monaco-editor';

import {
  StyledContainer,
  StyledIconFile,
  StyledLabel,
  StyledTabContent,
  StyledTooltip,
  StyledTabsContent,
  StyledTabFeatures,
  StyledWrapIconFeature,
  StyledWrapTabContent,
  StyledWrapTreeFile,
} from './styles';

import Image from 'components/common/Image';
import { onCheckFileType } from 'utils';
import { IFileTree } from 'libs/zip/types';
import { ZipReader, ZipWriter } from 'libs';
import FileTree from '../FileTree';

import AddIcon from 'assets/icons/add-icon.svg';
import FileIcon from 'assets/icons/file-icon.svg';
import UploadIcon from 'assets/icons/upload-icon.svg';
import DownloadIcon from 'assets/icons/download-icon.svg';
import FileWrapIcon from 'assets/icons/file-wrap-icon.svg';
import ReloadIcon from 'assets/icons/reload-icon.svg';
import MenuIcon from 'assets/icons/menu-icon.svg';

import useScrollToActiveTab from 'hooks/useScrollToActiveTab';
import useInitiateEditor from 'hooks/useInitiateEditor';
import useTabRefs from 'hooks/useTabRefs';

interface IProps {}

const MonacoEditor: React.FC<IProps> = () => {
  const [files, setFiles] = useState<IFileTree>({});
  const [tabs, setTabs] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{
    content?: string;
    blob?: string;
  }>({});
  const [createNewType, setCreateNewType] = useState<'folder' | 'file' | ''>('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const tabRefs = useTabRefs(tabs);

  useScrollToActiveTab(selectedTab, tabRefs, tabs);

  useInitiateEditor(editorRef, editorInstance.current, selectedFile, selectedTab);

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

      setFiles((prevState: IFileTree) => ({
        ...prevState,
        fileTree: updateObject(prevState.fileTree, 0),
      }));
    }
  };

  const onChangeZip = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          currentElement = currentElement[part] as IFileTree | { content: string | Uint8Array; blob?: string };
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
    setFiles((prevFileTree: IFileTree) => {
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

        currentLevel = currentLevel[part] as IFileTree;
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
        zipWriter.generateFromFileTree(files.fileTree as IFileTree);
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

    setFiles((prevState: IFileTree) => ({
      ...prevState,
      fileTree: updateNestedObject(prevState.fileTree, 0),
    }));
  };

  return (
    <StyledContainer data-testid='app-main' className='monaco-editor'>
      <StyledTabFeatures>
        <StyledWrapIconFeature>
          <StyledLabel htmlFor='create-file'>
            <button onClick={() => setCreateNewType('file')} disabled={!Object.keys(files).length}>
              <Image src={AddIcon} width={20} height={20} disabled={!Object.keys(files).length} />
            </button>
            <StyledTooltip>Add new file</StyledTooltip>
          </StyledLabel>
          <StyledLabel htmlFor='create-folder'>
            <button onClick={() => setCreateNewType('folder')} disabled={!Object.keys(files).length}>
              <Image src={FileIcon} width={20} height={20} disabled={!Object.keys(files).length} />
            </button>
            <StyledTooltip>Add new folder</StyledTooltip>
          </StyledLabel>

          <StyledLabel htmlFor='file-upload'>
            <div onClick={onUploadZip}>
              <Image src={UploadIcon} width={20} height={20} />
            </div>
            <input
              type='file'
              id='zipFileInput'
              accept='.zip'
              onChange={onChangeZip}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <StyledTooltip>Upload zip file</StyledTooltip>
          </StyledLabel>
          <StyledLabel htmlFor='file-download'>
            <button
              disabled={!Object.keys(files).length}
              onClick={() =>
                Object.keys(files).length && onDownloadZip(editorInstance.current?.getValue() as string, selectedTab)
              }
            >
              <Image src={DownloadIcon} width={20} height={20} disabled={!Object.keys(files).length} />
            </button>
            <StyledTooltip>Download zip file</StyledTooltip>
          </StyledLabel>
        </StyledWrapIconFeature>
        <StyledWrapTreeFile>
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
        </StyledWrapTreeFile>
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
                      onEditFileTree(selectedTab, editorInstance.current?.getValue() || '');
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
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img style={{ maxHeight: '500px' }} src={selectedFile.blob} alt={selectedTab.split('/').pop()} />
              </div>
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
