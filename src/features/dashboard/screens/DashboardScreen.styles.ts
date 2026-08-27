import styled from 'styled-components';

export const Hero = styled.section`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(8)};
  flex-wrap: wrap;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.display};
  line-height: 1.04;
  letter-spacing: ${({ theme }) => theme.tracking.display};

  @media (max-width: 720px) {
    font-size: 40px;
  }
`;

/** Grade do meio: fluxo de caixa (largo) + categorias (estreito). */
export const SplitRow = styled.section`
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: ${({ theme }) => theme.spacing(6)};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Divider = styled.div`
  height: ${({ theme }) => theme.rule.strong};
  background: ${({ theme }) => theme.colors.borderStrong};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;
