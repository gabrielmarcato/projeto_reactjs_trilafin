import styled from 'styled-components';
import { SectionTitle } from '@/components/ui/Text';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { categories } from '../data';

const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Sub = styled.div`
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
  margin-top: 4px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: 14px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const Name = styled.span`
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textBright};
`;

const Amount = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** "Para onde foi": ranking de despesas por categoria com barras. */
export function CategoriesCard() {
  return (
    <Card>
      <div>
        <SectionTitle>Para onde foi</SectionTitle>
        <Sub>R$ 12.480 em despesas</Sub>
      </div>
      <List>
        {categories.map((c) => (
          <Row key={c.label}>
            <Head>
              <Name>{c.label}</Name>
              <Amount>{c.amount}</Amount>
            </Head>
            <ProgressBar pct={c.pct} tone={c.tone} height={4} />
          </Row>
        ))}
      </List>
    </Card>
  );
}
