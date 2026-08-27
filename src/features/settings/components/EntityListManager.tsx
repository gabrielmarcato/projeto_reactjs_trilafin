import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IconButton } from '@/components/ui/IconButton';
import { PencilIcon, PlusIcon, TrashIcon } from '@/components/icons';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { CollectionKey, SettingsItem } from '@/store/useSettingsStore';
import { EntityFormModal } from './EntityFormModal';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
  max-width: 620px;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-right: auto;
`;

const Title = styled.h2`
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing(2)};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.heading};
`;

const Count = styled.span`
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const List = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.borderSubtle};

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderSubtle};
  }
`;

const Name = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textBright};
`;

const RowActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Empty = styled.p`
  padding: ${({ theme }) => theme.spacing(6)};
  text-align: center;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textFaint};
  border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
`;

export interface EntityListManagerProps {
  collectionKey: CollectionKey;
  title: string;
  description: string;
  /** Rótulo no singular usado nos modais (ex.: "categoria"). */
  entityLabel: string;
}

/**
 * Gerencia uma taxonomia da store de configurações. Adicionar e editar usam o
 * mesmo modal (`EntityFormModal`); remover pede confirmação (`ConfirmDialog`).
 */
export function EntityListManager({
  collectionKey,
  title,
  description,
  entityLabel,
}: EntityListManagerProps) {
  const items = useSettingsStore((s) => s.collections[collectionKey]);
  const addItem = useSettingsStore((s) => s.addItem);
  const renameItem = useSettingsStore((s) => s.renameItem);
  const removeItem = useSettingsStore((s) => s.removeItem);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SettingsItem | null>(null);
  const [removing, setRemoving] = useState<SettingsItem | null>(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (item: SettingsItem) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleSubmit = (name: string) => {
    if (editing) {
      renameItem(collectionKey, editing.id, name);
    } else {
      addItem(collectionKey, name);
    }
  };

  return (
    <Wrapper>
      <Header>
        <HeaderText>
          <Title>
            {title}
            <Count>{items.length} itens</Count>
          </Title>
          <Description>{description}</Description>
        </HeaderText>
        <Button type="button" onClick={openAdd}>
          <PlusIcon />
          Adicionar
        </Button>
      </Header>

      {items.length === 0 ? (
        <Empty>Nenhum item cadastrado ainda.</Empty>
      ) : (
        <List>
          {items.map((it) => (
            <Row key={it.id}>
              <Name>{it.name}</Name>
              <RowActions>
                <IconButton
                  type="button"
                  onClick={() => openEdit(it)}
                  aria-label={`Editar ${it.name}`}
                >
                  <PencilIcon />
                </IconButton>
                <IconButton
                  type="button"
                  onClick={() => setRemoving(it)}
                  aria-label={`Remover ${it.name}`}
                >
                  <TrashIcon />
                </IconButton>
              </RowActions>
            </Row>
          ))}
        </List>
      )}

      <EntityFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        entityLabel={entityLabel}
        item={editing}
        existingNames={items.map((it) => it.name)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={removing !== null}
        title={`Remover ${entityLabel}`}
        message={
          <>
            Tem certeza que deseja remover <strong>{removing?.name}</strong>?
            Esta ação não pode ser desfeita.
          </>
        }
        confirmLabel="Sim, remover"
        onConfirm={() => {
          if (removing) removeItem(collectionKey, removing.id);
        }}
        onClose={() => setRemoving(null)}
      />
    </Wrapper>
  );
}
