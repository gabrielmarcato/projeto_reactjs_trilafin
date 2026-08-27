import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IconButton } from '@/components/ui/IconButton';
import { Tag } from '@/components/ui/Tag';
import { Kicker } from '@/components/ui/Text';
import { TrashIcon, UploadIcon } from '@/components/icons';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { shortDate } from '@/lib/format';
import { useImportsStore } from '@/store/useImportsStore';
import type { ImportRecord, ImportStatus } from '@/store/useImportsStore';
import { ImportModal } from '../components/ImportModal';

const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing(8)};
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.title};
  letter-spacing: ${({ theme }) => theme.tracking.display};
`;

const Card = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  flex-wrap: wrap;
`;

const Search = styled.input`
  flex: 1;
  min-width: 200px;
  height: 38px;
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

const PerPage = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const PerPageSelect = styled.select`
  height: 38px;
  padding: 0 ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.small};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const TableScroll = styled.div`
  overflow-x: auto;
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
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td<{ $right?: boolean }>`
  padding: 14px ${({ theme }) => theme.spacing(6)};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-size: ${({ theme }) => theme.type.small};
  vertical-align: middle;
`;

const FileName = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const RowActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-end;
`;

const Empty = styled.div`
  padding: ${({ theme }) => theme.spacing(10)};
  text-align: center;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textFaint};
`;

const Foot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(6)};
  border-top: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
  flex-wrap: wrap;
`;

const Pager = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const PageBtn = styled.button<{ $active?: boolean }>`
  min-width: 32px;
  padding: 6px ${({ theme }) => theme.spacing(3)};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.text : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.text : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onAccent : theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.micro};
  font-weight: ${({ theme, $active }) =>
    $active ? theme.fontWeights.semibold : theme.fontWeights.regular};
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PAGE_SIZES = [10, 30, 60, 100];

const STATUS_LABEL: Record<ImportStatus, string> = {
  concluida: 'Concluída',
  processando: 'Processando',
  erro: 'Erro',
};

function statusVariant(status: ImportStatus): 'neutral' | 'outline' | 'accent' {
  if (status === 'concluida') return 'neutral';
  if (status === 'erro') return 'accent';
  return 'outline';
}

function pageWindow(current: number, total: number): number[] {
  const size = 7;
  if (total <= size) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  let start = Math.max(1, current - Math.floor(size / 2));
  const end = Math.min(total, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Tela de Importações — mesmo padrão da de Transações: header + busca +
 * registros por página + tabela paginada com o histórico de importações.
 */
export function ImportsScreen() {
  const navigate = useNavigate();
  const imports = useImportsStore((s) => s.imports);
  const removeImport = useImportsStore((s) => s.removeImport);

  const [removing, setRemoving] = useState<ImportRecord | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return imports;
    return imports.filter((i) =>
      [i.fileName, i.format, i.account, i.source, STATUS_LABEL[i.status]]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [imports, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return (
    <>
      <Header>
        <HeaderText>
          <Kicker>Dados</Kicker>
          <Title>Importações</Title>
        </HeaderText>
        <Button type="button" onClick={() => setImportOpen(true)}>
          <UploadIcon />
          Importar
        </Button>
      </Header>

      <Card>
        <Toolbar>
          <Search
            type="search"
            placeholder="Buscar por arquivo, conta, formato ou status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar importações"
          />
          <PerPage>
            Registros por página
            <PerPageSelect
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Registros por página"
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </PerPageSelect>
          </PerPage>
        </Toolbar>

        {imports.length === 0 ? (
          <Empty>Nenhuma importação ainda.</Empty>
        ) : filtered.length === 0 ? (
          <Empty>Nenhum resultado para “{search}”.</Empty>
        ) : (
          <>
            <TableScroll>
              <Table>
                <thead>
                  <tr>
                    <Th>Data</Th>
                    <Th>Arquivo</Th>
                    <Th>Formato</Th>
                    <Th>Conta</Th>
                    <Th>Origem</Th>
                    <Th $right>Registros</Th>
                    <Th>Status</Th>
                    <Th $right>Ações</Th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((imp) => (
                    <Tr key={imp.id}>
                      <Td>
                        <Muted>{shortDate(imp.date)}</Muted>
                      </Td>
                      <Td>
                        <FileName>{imp.fileName}</FileName>
                      </Td>
                      <Td>
                        <Tag $variant="outline">{imp.format}</Tag>
                      </Td>
                      <Td>
                        <Muted>{imp.account}</Muted>
                      </Td>
                      <Td>
                        <Muted>{imp.source}</Muted>
                      </Td>
                      <Td $right>
                        <Muted>{imp.records}</Muted>
                      </Td>
                      <Td>
                        <Tag $variant={statusVariant(imp.status)}>
                          {STATUS_LABEL[imp.status]}
                        </Tag>
                      </Td>
                      <Td $right>
                        <RowActions>
                          <IconButton
                            type="button"
                            onClick={() => setRemoving(imp)}
                            aria-label={`Remover ${imp.fileName}`}
                          >
                            <TrashIcon />
                          </IconButton>
                        </RowActions>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableScroll>
            <Foot>
              <span>
                Mostrando {start + 1}–
                {Math.min(start + pageSize, filtered.length)} de{' '}
                {filtered.length}
              </span>
              <Pager>
                <PageBtn
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </PageBtn>
                {pageWindow(page, totalPages).map((n) => (
                  <PageBtn
                    key={n}
                    type="button"
                    $active={n === page}
                    aria-current={n === page ? 'page' : undefined}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </PageBtn>
                ))}
                <PageBtn
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </PageBtn>
              </Pager>
            </Foot>
          </>
        )}
      </Card>

      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onConfirm={() => navigate({ to: '/importacoes/revisar' })}
      />

      <ConfirmDialog
        open={removing !== null}
        title="Remover importação"
        message={
          <>
            Remover o registro de <strong>{removing?.fileName}</strong> do
            histórico? Esta ação não pode ser desfeita.
          </>
        }
        confirmLabel="Sim, remover"
        onConfirm={() => {
          if (removing) removeImport(removing.id);
        }}
        onClose={() => setRemoving(null)}
      />
    </>
  );
}
