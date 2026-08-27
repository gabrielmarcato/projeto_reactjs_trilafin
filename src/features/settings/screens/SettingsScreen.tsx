import styled from 'styled-components';
import { Tabs } from '@/components/ui/Tabs';
import type { TabDefinition } from '@/components/ui/Tabs';
import { Kicker } from '@/components/ui/Text';
import { EntityListManager } from '../components/EntityListManager';

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.title};
  letter-spacing: ${({ theme }) => theme.tracking.display};
`;

const tabs: TabDefinition[] = [
  {
    id: 'categories',
    label: 'Categorias',
    content: (
      <EntityListManager
        collectionKey="categories"
        title="Categorias"
        description="Classificam cada lançamento (Moradia, Alimentação, Receita…). Alimentam os relatórios e o quadro “Para onde foi”."
        entityLabel="categoria"
      />
    ),
  },
  {
    id: 'budgetTypes',
    label: 'Tipos de orçamento',
    content: (
      <EntityListManager
        collectionKey="budgetTypes"
        title="Tipos de orçamento"
        description="Como cada orçamento se comporta (Fixo, Variável, Meta, Sazonal…)."
        entityLabel="tipo de orçamento"
      />
    ),
  },
  {
    id: 'paymentMethods',
    label: 'Formas de pagamento',
    content: (
      <EntityListManager
        collectionKey="paymentMethods"
        title="Formas de pagamento"
        description="Tipos de movimentação: Crédito, Débito, Pix, Dinheiro, Boleto, Parcelamento, Transferência…"
        entityLabel="forma de pagamento"
      />
    ),
  },
  {
    id: 'tags',
    label: 'Etiquetas',
    content: (
      <EntityListManager
        collectionKey="tags"
        title="Etiquetas"
        description="Marcadores livres para cruzar com categorias (Recorrente, Dedutível, Reembolsável…)."
        entityLabel="etiqueta"
      />
    ),
  },
  {
    id: 'currencies',
    label: 'Moedas',
    content: (
      <EntityListManager
        collectionKey="currencies"
        title="Moedas"
        description="Moedas aceitas em contas e lançamentos, para quem lida com mais de uma."
        entityLabel="moeda"
      />
    ),
  },
];

/**
 * Configurações do sistema em abas — cada aba cadastra uma taxonomia
 * (categorias, tipos de orçamento, formas de pagamento, etiquetas, moedas).
 * Renderiza no miolo da casca (Topbar + Sidebar permanecem).
 */
export function SettingsScreen() {
  return (
    <>
      <Header>
        <Kicker>Sistema</Kicker>
        <Title>Configurações</Title>
      </Header>

      <Tabs tabs={tabs} />
    </>
  );
}
