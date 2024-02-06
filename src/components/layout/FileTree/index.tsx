import { useState, Fragment, useRef } from 'react';
import { onCheckFileType } from 'utils';
import { FileTreeDisplayProps, TFileTree } from 'libs/zip/types';

import useUpdateHiddenItems from 'hooks/useSetHiddenTree';
import useCreateNewTypeEffect from 'hooks/useCreateNewFileOrFolder';
import useOnClickOutside from 'hooks/useOnClickOutside';

import { StyledWrapTreeFile } from '../MonacoEditor/styles';

import TreeFolder from 'components/common/TreeFolder';
import CreateNew from 'components/common/CreateNew';
import TreeFile from 'components/common/TreeFile';

const FileTree: React.FC<FileTreeDisplayProps> = ({
  fileTree,
  setFilesTree,
  setSelectedFile,
  setSelectedTab,
  tabs,
  setTabs,
  selectedTab,
  createNewType,
  setCreateNewType,
  selectedFolder,
  setSelectedFolder,
  onEditFileTree,
}) => {
  const [hiddenItems, setHiddenItems] = useState<{ [key: string]: boolean }>({});
  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const firstFileInTree = Object.keys(fileTree['fileTree'] || {}).find(
    (key) => key.includes('.') && !key.includes('/'),
  );

  let clonedFileTree = JSON.parse(JSON.stringify(fileTree));

  useUpdateHiddenItems(selectedTab, setHiddenItems);

  useCreateNewTypeEffect(createNewType, selectedTab, setHiddenItems, inputRef);

  useOnClickOutside(inputRef, setCreateNewType);

  const onOpenFile = (currentPath: string, isNew: boolean) => {
    const pathParts = currentPath.split('/');

    let currentElement: any = isNew ? clonedFileTree.fileTree : fileTree.fileTree;

    for (const part of pathParts) {
      if (currentElement[part] && typeof currentElement[part] === 'object') {
        currentElement = currentElement[part] as TFileTree | { content: string | Uint8Array; blob?: string };
      } else {
        currentElement = null;
        break;
      }
    }

    if (currentElement) {
      setSelectedFile(currentElement);
      setSelectedTab(currentPath);
    }
    if (tabs.every((tab) => tab !== currentPath)) {
      setTabs([...tabs, currentPath]);
    }
  };

  const onToggleVisibility = (key: string) => {
    setHiddenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // HANDLE CREATE NEW FILE OR FOLDER AFTER PRESSING ENTER
  const onEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, type: 'folder' | 'file', path: string) => {
    if (e.key === 'Enter') {
      setFilesTree(type, path, inputValue);
      setCreateNewType('');
      onEditFileTree();

      const onAddFileTree = () => {
        let pathsArray = path.split('/').filter((p) => p);

        if (pathsArray[pathsArray.length - 1].includes('.')) {
          pathsArray = pathsArray.slice(0, -1);
        }

        const getValueBasedOnType = (type: 'folder' | 'file') => {
          return type === 'file' ? { content: '// Your code start here' } : {};
        };

        const updateNestedObject = (
          obj: { [inputValue: string]: any },
          pathIndex: number,
        ): { [inputValue: string]: any } => {
          if (pathIndex === pathsArray.length) {
            return { ...obj, [inputValue]: getValueBasedOnType(type) };
          }

          const currentPath = pathsArray[pathIndex];
          return {
            ...obj,
            [currentPath]: updateNestedObject(obj[currentPath] || {}, pathIndex + 1),
          };
        };

        return updateNestedObject(fileTree.fileTree, 0);
      };

      clonedFileTree.fileTree = onAddFileTree();

      type === 'folder' && setSelectedFolder(path.includes('.') ? inputValue : `${path}/${inputValue}`);
      if (type === 'file') {
        onOpenFile(
          path.includes('.')
            ? path.split('/').slice(0, -1).join('/').length
              ? `${path.split('/').slice(0, -1).join('/')}/${inputValue}`
              : inputValue
            : `${path}/${inputValue}`,
          true,
        );
        setSelectedFolder('');
      }
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const renderTree = (
    tree: TFileTree | { content: string | Uint8Array; blob?: string },
    path = '',
    depth: number = 0,
  ): JSX.Element[] => {
    return Object.keys(tree).map((key) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isFile = key.includes('.');
      const item = (tree as TFileTree)[key];
      const style = { marginLeft: `${depth * 10}px` };
      const childStyle = { marginLeft: `${(depth + 1) * 10}px` };

      console.log('key: ', key);

      // GENERATE FOLDER
      if (typeof item === 'object' && item !== null && !isFile) {
        return (
          <Fragment key={currentPath}>
            <TreeFolder
              onToggleVisibility={onToggleVisibility}
              setSelectedFolder={setSelectedFolder}
              setSelectedTab={setSelectedTab}
              currentPath={currentPath}
              selectedFolder={selectedFolder}
              depth={depth}
              hiddenItems={hiddenItems}
              name={key}
            />
            {!hiddenItems[currentPath] && renderTree(item as TFileTree, currentPath, depth + 1)}
            {/* DETERMINE NEW FILE TYPE */}
            {createNewType && selectedFolder && selectedFolder === currentPath && (
              <CreateNew
                style={childStyle}
                createNewType={createNewType}
                inputRef={inputRef}
                onInputChange={onInputChange}
                onEnterKeyDown={onEnterKeyDown}
                currentPath={currentPath}
              />
            )}
          </Fragment>
        );
      } else {
        // GENERATE FILE
        return (
          <Fragment key={currentPath}>
            {/* IN CASE FILE IS NOT SELECTED */}
            {createNewType && !selectedTab && !selectedFolder && firstFileInTree && firstFileInTree === currentPath && (
              <CreateNew
                style={style}
                createNewType={createNewType}
                inputRef={inputRef}
                onInputChange={onInputChange}
                onEnterKeyDown={onEnterKeyDown}
                currentPath={currentPath}
              />
            )}
            {/* IF FILE IS SELECTED */}
            {createNewType && selectedTab && selectedTab === currentPath && (
              <CreateNew
                style={style}
                createNewType={createNewType}
                inputRef={inputRef}
                onInputChange={onInputChange}
                onEnterKeyDown={onEnterKeyDown}
                currentPath={currentPath}
              />
            )}
            <TreeFile
              onOpenFile={onOpenFile}
              currentPath={currentPath}
              setSelectedFolder={setSelectedFolder}
              onEditFileTree={onEditFileTree}
              selectedTab={selectedTab}
              style={style}
              onCheckFileType={onCheckFileType}
              name={key}
            />
          </Fragment>
        );
      }
    });
  };

  const innerFileTree = fileTree['fileTree'] || {};

  return <StyledWrapTreeFile>{renderTree(innerFileTree)}</StyledWrapTreeFile>;
};

export default FileTree;
