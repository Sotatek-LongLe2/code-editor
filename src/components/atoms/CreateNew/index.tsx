import { ChangeEvent, FC, KeyboardEvent, RefObject } from 'react';

import Image from 'components/atoms/Image';
import { StyledFileSource } from 'components/modules/FileTree/styled';

import FolderIcon from 'assets/icons/folder-icon.svg';
import FileCodeIcon from 'assets/icons/file-code-icon.svg';

type TProps = {
  style: {
    marginLeft: string;
  };
  createNewType: 'folder' | 'file';
  inputRef: RefObject<HTMLInputElement>;
  currentPath: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEnterKeyDown: (e: KeyboardEvent<HTMLInputElement>, type: 'folder' | 'file', path: string) => void;
};

const CreateNew: FC<TProps> = ({ style, createNewType, inputRef, onInputChange, onEnterKeyDown, currentPath }) => {
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
