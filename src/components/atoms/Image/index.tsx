import { FC } from 'react';

import { StyledImg } from './styled';

type TProps = {
  src: string;
  height: number;
  width: number;
  disabled?: boolean;
};

const Image: FC<TProps> = ({ src, height, width, disabled }) => {
  return (
    <StyledImg src={src} alt='' height={height} width={width} style={{ cursor: disabled ? 'unset' : 'pointer' }} />
  );
};

export default Image;
