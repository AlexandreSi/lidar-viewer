import styled from 'styled-components';
import { Button as AntButton } from 'antd';

import { style } from 'theme/style';

const fadeDuration = "1.2s";


export const Title = styled.h1`
  color: ${style['@primary-color']};
  font-size: 40px;
  font-family: ${style.fonts.primary};
  animation: fade-down ${fadeDuration} ease-out forwards;
`;


export const Button = styled(AntButton)`
  opacity: 0;
  animation: fade ${fadeDuration} ease-out 1s forwards;
`;
