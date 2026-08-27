import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { IconButton } from './IconButton';
import { XIcon } from '@/components/icons';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing(4)};
  background: rgba(4, 4, 4, 0.62);
`;

const DIALOG_WIDTHS = { sm: '400px', md: '480px', lg: '940px' } as const;

const Dialog = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  width: min(${({ $size }) => DIALOG_WIDTHS[$size]}, 100%);
  max-height: calc(100vh - ${({ theme }) => theme.spacing(8)});
  overflow: auto;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(6)};
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
`;

const Title = styled.h2`
  margin: 0;
  margin-right: auto;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.heading};
  letter-spacing: -0.01em;
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
`;

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Largura do diálogo: 'sm' (confirmações), 'md' (padrão) ou 'lg' (largo). */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Modal centralizado no topo da elevação (padrão `.dialog` do Modernist).
 * Fecha no Esc e no clique fora; trava o scroll do fundo; devolve o foco ao
 * abrir. Renderizado via portal no `<body>`.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Foca o primeiro campo do diálogo ao abrir.
    dialogRef.current
      ?.querySelector<HTMLElement>(
        'input, select, textarea, button, [tabindex]',
      )
      ?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <Backdrop
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Dialog
        ref={dialogRef}
        $size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <Header>
          <Title id={titleId}>{title}</Title>
          <IconButton type="button" onClick={onClose} aria-label="Fechar">
            <XIcon />
          </IconButton>
        </Header>
        <Body>{children}</Body>
      </Dialog>
    </Backdrop>,
    document.body,
  );
}
