import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Field } from '@/components/ui/Field';
import { IconButton } from '@/components/ui/IconButton';
import { Modal } from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/SelectField';
import type { SelectOption } from '@/components/ui/SelectField';
import { FileIcon, UploadIcon, XIcon } from '@/components/icons';
import { useAccountsStore } from '@/store/useAccountsStore';
import { useImportsStore } from '@/store/useImportsStore';

const ACCEPT = '.ofx,.csv,.pdf,.qif,.txt,.xls,.xlsx';

const SOURCE_OPTIONS: readonly SelectOption[] = [
  { value: 'extrato', label: 'Extrato bancário' },
  { value: 'fatura', label: 'Fatura de cartão' },
];

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
`;

const Dropzone = styled.button<{ $drag: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  padding: ${({ theme }) => theme.spacing(8)};
  border: 1px dashed
    ${({ theme, $drag }) => ($drag ? theme.colors.accent : theme.colors.border)};
  background: ${({ theme, $drag }) =>
    $drag ? theme.colors.accentSoftHover : theme.colors.background};
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.textFaint};
  }
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const DropTitle = styled.span`
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.text};
`;

const DropHint = styled.span`
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.border};

  svg {
    color: ${({ theme }) => theme.colors.accent};
    flex: none;
  }
`;

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: auto;
  min-width: 0;
`;

const FileName = styled.span`
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileMeta = styled.span`
  font-size: ${({ theme }) => theme.type.kicker};
  color: ${({ theme }) => theme.colors.textFaint};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
`;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileFormat(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    ofx: 'OFX',
    csv: 'CSV',
    pdf: 'PDF',
    qif: 'QIF',
    txt: 'Texto',
    xls: 'Excel',
    xlsx: 'Excel',
  };
  return map[ext] ?? ext.toUpperCase();
}

export interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  /** Chamado após escolher o arquivo — navega para a tela de revisão. */
  onConfirm: () => void;
}

/**
 * Etapa 1 da importação: escolher o arquivo (OFX, CSV, PDF, QIF, Excel, TXT) e
 * as opções. Ao confirmar, registra o "import pendente" na store e dispara
 * `onConfirm` (que leva à tela de revisão).
 */
export function ImportModal({ open, onClose, onConfirm }: ImportModalProps) {
  const accounts = useAccountsStore((s) => s.accounts);
  const setPendingImport = useImportsStore((s) => s.setPendingImport);
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [account, setAccount] = useState('');
  const [source, setSource] = useState('extrato');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [avoidDuplicates, setAvoidDuplicates] = useState(true);
  const [autoCategorize, setAutoCategorize] = useState(true);

  useEffect(() => {
    if (open) {
      setFile(null);
      setDrag(false);
      setAccount(accounts[0]?.name ?? '');
      setSource('extrato');
      setDateFrom('');
      setDateTo('');
      setAvoidDuplicates(true);
      setAutoCategorize(true);
    }
  }, [open, accounts]);

  const accountOptions: SelectOption[] = accounts.map((a) => ({
    value: a.name,
    label: a.name,
  }));

  const onDrop = (e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDrag(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  const submit = () => {
    if (!file || !account) return;
    setPendingImport({
      fileName: file.name,
      format: fileFormat(file.name),
      account,
      source: source === 'fatura' ? 'Fatura de cartão' : 'Extrato bancário',
    });
    onConfirm();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Importar registros">
      <Body>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          hidden
          aria-label="Arquivo de importação"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        {file ? (
          <FileRow>
            <FileIcon size={20} />
            <FileInfo>
              <FileName>{file.name}</FileName>
              <FileMeta>
                {fileFormat(file.name)} · {formatBytes(file.size)}
              </FileMeta>
            </FileInfo>
            <IconButton
              type="button"
              onClick={() => setFile(null)}
              aria-label="Remover arquivo"
            >
              <XIcon />
            </IconButton>
          </FileRow>
        ) : (
          <Dropzone
            type="button"
            $drag={drag}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
          >
            <UploadIcon size={22} />
            <DropTitle>Arraste o arquivo ou clique para buscar</DropTitle>
            <DropHint>
              Formatos aceitos: OFX, CSV, PDF, QIF, Excel, TXT
            </DropHint>
          </Dropzone>
        )}

        <Grid>
          <SelectField
            label="Conta de destino"
            options={accountOptions}
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <SelectField
            label="Origem"
            options={SOURCE_OPTIONS}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </Grid>

        <Grid>
          <Field
            label="Período — de (opcional)"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Field
            label="Período — até (opcional)"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </Grid>

        <Options>
          <Checkbox
            label="Ignorar lançamentos duplicados"
            checked={avoidDuplicates}
            onChange={(e) => setAvoidDuplicates(e.target.checked)}
          />
          <Checkbox
            label="Categorizar automaticamente pela descrição"
            checked={autoCategorize}
            onChange={(e) => setAutoCategorize(e.target.checked)}
          />
        </Options>

        <Actions>
          <Button type="button" $variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={submit} disabled={!file || !account}>
            Continuar
          </Button>
        </Actions>
      </Body>
    </Modal>
  );
}
