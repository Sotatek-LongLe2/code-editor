import { useState, Fragment, useRef } from 'react';
import { StyledFolderSource, StyledFileSource, StyledText } from './styles';
import { onCheckFileType } from 'utils';
import Image from 'components/common/Image';
import { FileTreeDisplayProps, IFileTree } from 'libs/zip/types';

import FolderIcon from 'assets/icons/folder-icon.svg';
import ArrowIcon from 'assets/icons/arrow-icon.svg';
import FileCodeIcon from 'assets/icons/file-code-icon.svg';
import ImageIcon from 'assets/icons/image-icon.svg';
import useUpdateHiddenItems from 'hooks/useSetHiddenTree';
import useCreateNewTypeEffect from 'hooks/useCreateNewFileOrFolder';
import useOnClickOutside from 'hooks/useOnClickOutside';

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
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  const firstFileInTree = Object.keys(fileTree['fileTree'] || {}).find(
    (key) => key.includes('.') && !key.includes('/'),
  );

  let clonedFileTree = JSON.parse(JSON.stringify(fileTree));

  useUpdateHiddenItems(selectedTab, setHiddenItems);

  useCreateNewTypeEffect(createNewType, selectedTab, setIsEditing, setHiddenItems, inputRef);

  useOnClickOutside(inputRef, setCreateNewType);

  const onOpenFile = (currentPath: string, isNew: boolean) => {
    const pathParts = currentPath.split('/');

    let currentElement: any = isNew ? clonedFileTree.fileTree : fileTree.fileTree;

    for (const part of pathParts) {
      if (currentElement[part] && typeof currentElement[part] === 'object') {
        currentElement = currentElement[part] as IFileTree | { content: string | Uint8Array; blob?: string };
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
      setIsEditing(false);
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
    tree: IFileTree | { content: string | Uint8Array; blob?: string },
    path = '',
    depth: number = 0,
  ): JSX.Element[] => {
    return Object.keys(tree).map((key) => {
      const currentPath = path ? `${path}/${key}` : key;
      const isFile = key.includes('.');
      const item = (tree as IFileTree)[key];
      const style = { marginLeft: `${depth * 10}px` };
      const childStyle = { marginLeft: `${(depth + 1) * 10}px` };

      // GENERATE FOLDER
      if (typeof item === 'object' && item !== null && !isFile) {
        return (
          <Fragment key={currentPath}>
            <StyledFolderSource
              onClick={() => {
                onToggleVisibility(currentPath);
                setSelectedFolder(currentPath);
                setSelectedTab('');
              }}
              style={{
                backgroundColor: selectedFolder === currentPath ? '#464659' : '',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  paddingLeft: `${depth * 10}px`,
                }}
              >
                <Image src={FolderIcon} height={24} width={24} />
                <StyledText data-testid='text-test'>{key}</StyledText>
              </div>
              <div
                style={{
                  transform: hiddenItems[currentPath] ? '' : 'rotate(3.142rad)',
                }}
              >
                <Image src={ArrowIcon} height={24} width={24} />
              </div>
            </StyledFolderSource>
            {!hiddenItems[currentPath] && renderTree(item as IFileTree, currentPath, depth + 1)}
            {/* DETERMINE NEW FILE TYPE */}
            {createNewType && selectedFolder && selectedFolder === currentPath && (
              <StyledFileSource>
                <div style={childStyle}>
                  <Image src={createNewType === 'folder' ? FolderIcon : FileCodeIcon} height={24} width={24} />
                </div>
                {isEditing ? (
                  <input
                    ref={inputRef}
                    onChange={onInputChange}
                    onKeyDown={(e) => onEnterKeyDown(e, createNewType, currentPath)}
                  />
                ) : (
                  <StyledText>{inputValue}</StyledText>
                )}
              </StyledFileSource>
            )}
          </Fragment>
        );
      } else {
        // GENERATE FILE
        return (
          <Fragment key={currentPath}>
            {/* IN CASE FILE IS NOT SELECTED */}
            {createNewType && !selectedTab && !selectedFolder && firstFileInTree && firstFileInTree === currentPath && (
              <StyledFileSource>
                <div style={style}>
                  <Image src={createNewType === 'folder' ? FolderIcon : FileCodeIcon} height={24} width={24} />
                </div>
                <input
                  ref={inputRef}
                  onChange={onInputChange}
                  onKeyDown={(e) => onEnterKeyDown(e, createNewType, currentPath)}
                />
              </StyledFileSource>
            )}
            {/* IF FILE IS SELECTED */}
            {createNewType && selectedTab && selectedTab === currentPath && (
              <StyledFileSource>
                <div style={style}>
                  <Image src={createNewType === 'folder' ? FolderIcon : FileCodeIcon} height={24} width={24} />
                </div>
                <input
                  ref={inputRef}
                  onChange={onInputChange}
                  onKeyDown={(e) => onEnterKeyDown(e, createNewType, currentPath)}
                />
              </StyledFileSource>
            )}
            <StyledFileSource
              onClick={() => {
                onOpenFile(currentPath, false);
                setSelectedFolder('');
                onEditFileTree();
              }}
              style={{ backgroundColor: selectedTab === currentPath ? '#464659' : '' }}
            >
              <div style={style}>
                <Image
                  src={onCheckFileType(currentPath.split('/').pop() || '') ? ImageIcon : FileCodeIcon}
                  height={24}
                  width={24}
                />
              </div>
              <StyledText>{key}</StyledText>
            </StyledFileSource>
          </Fragment>
        );
      }
    });
  };

  const innerFileTree = fileTree['fileTree'] || {};

  return <>{renderTree(innerFileTree)}</>;
};

export default FileTree;
