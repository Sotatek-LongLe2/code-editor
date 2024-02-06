import { FC } from 'react';

type TProp = {
  selectedFile: {
    content?: string | undefined;
    blob?: string | undefined;
  };
  selectedTab: string;
};

const ImageEditor: FC<TProp> = ({ selectedFile, selectedTab }) => {
  return (
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
  );
};

export default ImageEditor;
