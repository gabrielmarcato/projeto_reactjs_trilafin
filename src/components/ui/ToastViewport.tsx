import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { CheckIcon, XIcon } from '@/components/icons';
import { useToastStore, type ToastType } from '@/store/useToastStore';

/**
 * Pilha de notificações (toasts) fixada no canto inferior direito. Renderizada
 * via portal no `document.body` para não sofrer clipping do shell (que tem
 * `overflow: hidden`) e ficar acima de modais.
 *
 * Estilo Modernist: superfície reta, régua forte de 2px à esquerda colorida por
 * tipo (verde = sucesso, coral = erro/info) e rótulo em caixa-alta.
 */
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Viewport = styled.div`
  position: fixed;
  right: ${({ theme }) => theme.spacing(6)};
  bottom: ${({ theme }) => theme.spacing(6)};
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  width: min(360px, calc(100vw - 32px));
  pointer-events: none;
`;

const Item = styled.div<{ $type: ToastType }>`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(4)}`};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: ${({ theme }) => theme.rule.hairline} solid
    ${({ theme }) => theme.colors.borderStrong};
  border-left: 2px solid
    ${({ theme, $type }) =>
      $type === 'success' ? theme.colors.success : theme.colors.accent};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${slideIn} 160ms ease-out;
`;

const IconWrap = styled.span<{ $type: ToastType }>`
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 1px;
  color: ${({ theme, $type }) =>
    $type === 'success' ? theme.colors.success : theme.colors.accent};
`;

const Message = styled.p`
  flex: 1;
  margin: 0;
  font-size: ${({ theme }) => theme.type.body};
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  transition: color 120ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <Viewport role="region" aria-label="Notificações" aria-live="polite">
      {toasts.map((t) => (
        <Item key={t.id} $type={t.type} role="status">
          <IconWrap $type={t.type}>
            {t.type === 'success' ? (
              <CheckIcon size={18} />
            ) : (
              <XIcon size={18} />
            )}
          </IconWrap>
          <Message>{t.message}</Message>
          <CloseButton
            type="button"
            aria-label="Fechar notificação"
            onClick={() => dismiss(t.id)}
          >
            <XIcon size={16} />
          </CloseButton>
        </Item>
      ))}
    </Viewport>,
    document.body,
  );
}
