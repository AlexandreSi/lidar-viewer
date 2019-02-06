import styled from 'styled-components';
import { style } from 'theme/style';


export const Title = styled.div`
  color: ${style['@primary-color']};
  font-size: 40px;
  font-family: ${style.fonts.primary};
  margin-bottom: 30px;
`;

export const WelcomeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
