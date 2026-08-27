import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { ProfileModal } from '@/features/profile/components/ProfileModal';
import { initialsFromName, useProfileStore } from '@/store/useProfileStore';
import { useAuthStore } from '@/store/useAuthStore';
import { UserMenu } from './UserMenu';

const Bar = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(8)};
  padding: 0 ${({ theme }) => theme.spacing(8)};
  height: 64px;
  flex: none;
  border-bottom: ${({ theme }) => theme.rule.strong} solid
    ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  position: relative;
  z-index: 5;
`;

const Brand = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-right: auto;
`;

const BrandMark = styled.div`
  width: 14px;
  height: 14px;
  background: ${({ theme }) => theme.colors.accent};
`;

const BrandName = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: 18px;
  letter-spacing: ${({ theme }) => theme.tracking.snug};

  span {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 28px;
  font-size: ${({ theme }) => theme.type.small};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  letter-spacing: 0.02em;
`;

const NavLink = styled.a<{ $active?: boolean; $disabled?: boolean }>`
  color: ${({ theme, $active, $disabled }) =>
    $disabled
      ? theme.colors.textFaintest
      : $active
        ? theme.colors.text
        : theme.colors.textMuted};
  border-bottom: ${({ theme, $active }) =>
    $active ? `2px solid ${theme.colors.accent}` : '2px solid transparent'};
  padding-bottom: 3px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    color: ${({ theme, $disabled }) =>
      $disabled ? theme.colors.textFaintest : theme.colors.text};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const NAV_ITEMS: { label: string; to?: string; disabled?: boolean }[] = [
  { label: 'Painel', to: '/' },
  { label: 'Transações', to: '/transacoes' },
  { label: 'Relatórios', to: '/relatorios' },
  { label: 'Importações', to: '/importacoes' },
  { label: 'Orçamentos', disabled: true },
];

/** Barra superior global: marca, navegação principal e ações rápidas. */
export function Topbar() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const profileName = useProfileStore((s) => s.profile.name);
  const logout = useAuthStore((s) => s.logout);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <Bar>
      <Brand>
        <BrandMark />
        <BrandName>
          TRILHA<span>.</span>FIN
        </BrandName>
      </Brand>
      <Nav>
        {NAV_ITEMS.map((item) => {
          const active = item.to === pathname;
          return (
            <NavLink
              key={item.label}
              href="#"
              $active={active}
              $disabled={item.disabled}
              aria-current={active ? 'page' : undefined}
              aria-disabled={item.disabled || undefined}
              title={item.disabled ? 'Em breve' : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (item.disabled) return;
                if (item.to) navigate({ to: item.to });
              }}
            >
              {item.label}
            </NavLink>
          );
        })}
      </Nav>
      <Actions>
        <UserMenu
          initials={initialsFromName(profileName)}
          onSettings={() => navigate({ to: '/configuracoes' })}
          onAccount={() => setProfileOpen(true)}
          onLogout={() => {
            logout();
            navigate({ to: '/login' });
          }}
        />
      </Actions>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </Bar>
  );
}
