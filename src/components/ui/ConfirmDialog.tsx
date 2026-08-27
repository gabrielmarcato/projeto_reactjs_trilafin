import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { Modal } from './Modal';

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(6)};
`;

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Diálogo pequeno de confirmação (padrão para ações destrutivas).
 * Reaproveita o `Modal` no tamanho `sm`.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Remover',
  cancelLabel = 'Cancelar',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <Message>{message}</Message>
      <Actions>
        <Button type="button" $variant="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          $variant="primary"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </Actions>
    </Modal>
  );
}
