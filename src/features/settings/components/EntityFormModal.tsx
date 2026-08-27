import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import type { SettingsItem } from '@/store/useSettingsStore';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export interface EntityFormModalProps {
  open: boolean;
  onClose: () => void;
  /** Rótulo no singular, ex.: "categoria". */
  entityLabel: string;
  /** Item em edição; ausente/`null` → modo de adição. */
  item?: SettingsItem | null;
  /** Nomes já existentes na coleção (para checar duplicidade). */
  existingNames: string[];
  onSubmit: (name: string) => void;
}

/**
 * Modal único de adicionar/editar um item de taxonomia. Um só campo (nome),
 * com validação de vazio e de nome duplicado.
 */
export function EntityFormModal({
  open,
  onClose,
  entityLabel,
  item,
  existingNames,
  onSubmit,
}: EntityFormModalProps) {
  const isEditing = Boolean(item);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (open) {
      setName(item?.name ?? '');
      setError(undefined);
    }
  }, [open, item]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = name.trim();
    if (!value) {
      setError('Informe um nome');
      return;
    }
    const duplicate = existingNames.some(
      (n) =>
        n.toLowerCase() === value.toLowerCase() &&
        n.toLowerCase() !== item?.name.toLowerCase(),
    );
    if (duplicate) {
      setError('Já existe um item com esse nome');
      return;
    }
    onSubmit(value);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${isEditing ? 'Editar' : 'Adicionar'} ${entityLabel}`}
    >
      <Form onSubmit={handleSubmit} noValidate>
        <Field
          id="entity-name"
          label="Nome"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(undefined);
          }}
          placeholder={`Nome da ${entityLabel}`}
          error={error}
        />
        <Actions>
          <Button type="button" $variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">{isEditing ? 'Salvar' : 'Adicionar'}</Button>
        </Actions>
      </Form>
    </Modal>
  );
}
