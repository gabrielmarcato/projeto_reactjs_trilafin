import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Topbar } from './Topbar';

// Casca de altura fixa: nada aqui rola. O scroll fica só no <Main>.
const Shell = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Body = styled.div`
  flex: 1;
  min-height: 0; /* permite que os filhos rolem em vez de esticar a casca */
  display: grid;
  grid-template-columns: 232px 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Aside = styled.aside`
  border-right: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  padding: ${({ theme }) => theme.spacing(7)} 0;
  background: ${({ theme }) => theme.colors.surface};
  overflow-y: auto; /* sidebar rola sozinha se ficar alta demais */

  @media (max-width: 900px) {
    display: none;
  }
`;

// Única região com scroll da tela.
const Main = styled.main`
  min-height: 0;
  overflow-y: auto;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(8)};
  max-width: 1240px;
  padding: ${({ theme }) => theme.spacing(8)}
    ${({ theme }) => theme.spacing(10)} ${({ theme }) => theme.spacing(16)};
`;

export interface AppShellProps {
  /** Conteúdo da barra lateral (chrome persistente do app). */
  sidebar: ReactNode;
  children: ReactNode;
}

/**
 * Estrutura da aplicação: Topbar e Sidebar FIXOS; apenas o miolo (`Main`)
 * rola. É o chrome persistente reutilizado por todas as telas.
 */
export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <Shell>
      <Topbar />
      <Body>
        <Aside>{sidebar}</Aside>
        <Main>
          <Content>{children}</Content>
        </Main>
      </Body>
    </Shell>
  );
}
