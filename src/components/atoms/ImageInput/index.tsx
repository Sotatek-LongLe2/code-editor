import { ChangeEvent, FC, Ref } from 'react';

import Image from 'components/atoms/Image';
import { StyledLabel, StyledTooltip } from 'components/modules/MonacoEditor/styled';

type TProp = {
  icon: string;
  fileInputRef: Ref<HTMLInputElement>;
  onClick: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
};

const ImageInput: FC<TProp> = ({ icon, onClick, onChange, fileInputRef }) => {
  return (
    <StyledLabel htmlFor='file-upload'>
      <div onClick={onClick}>
        <Image src={icon} width={20} height={20} />
      </div>
      <input
        type='file'
        id='zipFileInput'
        accept='.zip'
        onChange={onChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <StyledTooltip>Upload zip file</StyledTooltip>
    </StyledLabel>
  );
};

export default ImageInput;
