import { useRef, useState } from 'react';
import type { ComponentType } from 'react';
import styled from 'styled-components';
import { useClickOutside } from '@/hooks/useClickOutside';
import { LogOutIcon, SettingsIcon, UserIcon } from '@/components/icons';

const Wrapper = styled.div`
  position: relative;
`;

const Avatar = styled.button<{ $open: boolean }>`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  padding: 0;
  background: ${({ theme }) => theme.colors.avatar};
  border: 1px solid
    ${({ theme, $open }) => ($open ? theme.colors.accent : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.micro};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Panel = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing(2)});
  right: 0;
  z-index: 20;
  min-width: 210px;
  padding: ${({ theme }) => theme.spacing(1)} 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Item = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  width: 100%;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.small};
  text-align: left;
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.textFaint};
    flex: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
  &:hover svg {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Divider = styled.div`
  height: 1px;
  margin: ${({ theme }) => theme.spacing(1)} 0;
  background: ${({ theme }) => theme.colors.borderSubtle};
`;

interface MenuAction {
  label: string;
  icon: ComponentType<{ size?: number }>;
  onSelect: () => void;
  /** Insere um divisor acima deste item (padrão de sistemas). */
  divided?: boolean;
}

export interface UserMenuProps {
  /** Iniciais exibidas no avatar. */
  initials?: string;
  onSettings?: () => void;
  onAccount?: () => void;
  onLogout?: () => void;
}

/**
 * Avatar do topo com menu dropdown (Configurações / Conta / Sair).
 * Abre ao clicar, fecha no Esc, no clique fora e ao escolher uma opção.
 */
export function UserMenu({
  initials = 'MR',
  onSettings,
  onAccount,
  onLogout,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpen(false);
  useClickOutside(wrapperRef, close, open);

  const run = (handler?: () => void) => () => {
    handler?.();
    close();
    avatarRef.current?.focus();
  };

  const actions: MenuAction[] = [
    { label: 'Configurações', icon: SettingsIcon, onSelect: run(onSettings) },
    { label: 'Conta', icon: UserIcon, onSelect: run(onAccount) },
    { label: 'Sair', icon: LogOutIcon, onSelect: run(onLogout), divided: true },
  ];

  return (
    <Wrapper
      ref={wrapperRef}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          close();
          avatarRef.current?.focus();
        }
      }}
    >
      <Avatar
        ref={avatarRef}
        type="button"
        $open={open}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Menu do usuário"
      >
        {initials}
      </Avatar>

      {open ? (
        <Panel role="menu">
          {actions.map(({ label, icon: Icon, onSelect, divided }) => (
            <div key={label}>
              {divided ? <Divider /> : null}
              <Item type="button" role="menuitem" onClick={onSelect}>
                <Icon size={16} />
                {label}
              </Item>
            </div>
          ))}
        </Panel>
      ) : null}
    </Wrapper>
  );
}
