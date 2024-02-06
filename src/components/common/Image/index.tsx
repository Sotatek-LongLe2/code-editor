import React from 'react';

import { StyledImg } from './styles';

type TProps = {
  src: string;
  height: number;
  width: number;
  disabled?: boolean;
}

const Image: React.FC<TProps> = ({ src, height, width, disabled }) => {
  return (
    <StyledImg src={src} alt='' height={height} width={width} style={{ cursor: disabled ? 'unset' : 'pointer' }} />
  );
};

export default Image;
