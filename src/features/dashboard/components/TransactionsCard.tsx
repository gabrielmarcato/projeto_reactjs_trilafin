import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { SectionTitle } from '@/components/ui/Text';
import { transactions } from '../data';

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(6)};
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  flex-wrap: wrap;
`;

const Search = styled.input`
  height: 36px;
  width: 220px;
  padding: 0 ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.small};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ $right?: boolean }>`
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  font-size: ${({ theme }) => theme.type.label};
  letter-spacing: ${({ theme }) => theme.tracking.kicker};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textFaint};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderStrong};
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

const Td = styled.td<{ $right?: boolean }>`
  padding: 14px ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-size: ${({ theme }) => theme.type.small};
`;

const Desc = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Amount = styled.span<{ $tone: string }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.body};
  letter-spacing: ${({ theme }) => theme.tracking.snug};
  color: ${({ $tone }) => $tone};
`;

const Foot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  border-top: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
`;

const Pager = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Page = styled.span<{ $active?: boolean }>`
  padding: 6px ${({ theme }) => theme.spacing(3)};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.text : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.text : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onAccent : theme.colors.textMuted};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.regular};
`;

/** Tabela de transações recentes com busca, filtros e paginação (visual). */
export function TransactionsCard() {
  return (
    <Card>
      <Head>
        <SectionTitle style={{ marginRight: 'auto' }}>
          Transações recentes
        </SectionTitle>
        <Search
          placeholder="Buscar lançamento"
          aria-label="Buscar lançamento"
        />
        <Button $variant="secondary">Filtros</Button>
      </Head>

      <Table>
        <thead>
          <tr>
            <Th>Data</Th>
            <Th>Descrição</Th>
            <Th>Categoria</Th>
            <Th>Conta</Th>
            <Th $right>Valor</Th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <Tr key={`${t.date}-${t.desc}`}>
              <Td>
                <Muted style={{ whiteSpace: 'nowrap' }}>{t.date}</Muted>
              </Td>
              <Td>
                <Desc>{t.desc}</Desc>
              </Td>
              <Td>
                <Tag $variant="outline">{t.cat}</Tag>
              </Td>
              <Td>
                <Muted>{t.account}</Muted>
              </Td>
              <Td $right>
                <Amount $tone={t.tone}>{t.amount}</Amount>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      <Foot>
        <span>Mostrando 6 de 248 lançamentos</span>
        <Pager>
          <Page>Anterior</Page>
          <Page $active>1</Page>
          <Page>2</Page>
          <Page>Próxima</Page>
        </Pager>
      </Foot>
    </Card>
  );
}
