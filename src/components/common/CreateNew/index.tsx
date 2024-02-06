import React from 'react';

import { StyledFileSource } from 'components/layout/FileTree/styles';
import Image from 'components/common/Image';

import FolderIcon from 'assets/icons/folder-icon.svg';
import FileCodeIcon from 'assets/icons/file-code-icon.svg';

type TProps = {
  style: {
    marginLeft: string;
  };
  createNewType: 'folder' | 'file';
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, type: 'folder' | 'file', path: string) => void;
  currentPath: string;
};

const CreateNew: React.FC<TProps> = ({
  style,
  createNewType,
  inputRef,
  onInputChange,
  onEnterKeyDown,
  currentPath,
}) => {
  return (
    <StyledFileSource>
      <div style={style}>
        <Image src={createNewType === 'folder' ? FolderIcon : FileCodeIcon} height={24} width={24} />
      </div>
      <input ref={inputRef} onChange={onInputChange} onKeyDown={(e) => onEnterKeyDown(e, createNewType, currentPath)} />
    </StyledFileSource>
  );
};

export default CreateNew;
