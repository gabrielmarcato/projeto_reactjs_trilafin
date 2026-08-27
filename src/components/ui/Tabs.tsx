import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(6)};
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing(3)} 0;
  border: none;
  background: transparent;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.text : theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.small};
  letter-spacing: 0.02em;
  white-space: nowrap;
  cursor: pointer;
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme, $active }) => ($active ? theme.colors.accent : 'transparent')};
  margin-bottom: -${({ theme }) => theme.rule.strong};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Panel = styled.div`
  padding-top: ${({ theme }) => theme.spacing(6)};
`;

export interface TabDefinition {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps {
  tabs: TabDefinition[];
  /** Id da aba inicial (padrão: a primeira). */
  defaultTabId?: string;
}

/**
 * Abas no estilo Modernist (sublinhado de acento no item ativo).
 * Autogerencia a aba ativa. Acessível: tablist / tab / tabpanel.
 */
export function Tabs({ tabs, defaultTabId }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const baseId = useId();
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div>
      <TabList role="tablist">
        {tabs.map((tab) => {
          const selected = tab.id === active?.id;
          return (
            <TabButton
              key={tab.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              $active={selected}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.label}
            </TabButton>
          );
        })}
      </TabList>

      {active ? (
        <Panel
          role="tabpanel"
          id={`${baseId}-panel-${active.id}`}
          aria-labelledby={`${baseId}-tab-${active.id}`}
        >
          {active.content}
        </Panel>
      ) : null}
    </div>
  );
}
