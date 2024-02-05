import React from 'react';

import { StyledImg } from './styles';

interface IProps {
  src: string;
  height: number;
  width: number;
  disabled?: boolean;
}

const Image: React.FC<IProps> = ({ src, height, width, disabled }) => {
  return (
    <StyledImg src={src} alt='' height={height} width={width} style={{ cursor: disabled ? 'unset' : 'pointer' }} />
  );
};

export default Image;
