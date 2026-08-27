import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Kicker } from '@/components/ui/Text';
import { useAuthStore } from '@/store/useAuthStore';

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.colors.background};
`;

const Card = styled.div`
  width: min(400px, 100%);
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(8)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const Brand = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
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

const Head = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.type.title};
  letter-spacing: ${({ theme }) => theme.tracking.display};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const FormError = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.dangerSurface};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.type.small};
`;

const Hint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.type.micro};
  color: ${({ theme }) => theme.colors.textFaint};
`;

/**
 * Tela de login (fora da casca). Demo: `teste` / `teste`. Ao autenticar,
 * navega para a home; as rotas protegidas passam a liberar o acesso.
 */
export function LoginScreen() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(user, password)) {
      navigate({ to: '/' });
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  return (
    <Page>
      <Card>
        <Brand>
          <BrandMark />
          <BrandName>
            TRILHA<span>.</span>FIN
          </BrandName>
        </Brand>

        <Head>
          <Kicker>Acesso</Kicker>
          <Title>Entrar</Title>
        </Head>

        <Form onSubmit={onSubmit} noValidate>
          {error ? <FormError role="alert">{error}</FormError> : null}
          <Field
            label="Usuário"
            name="user"
            placeholder="teste"
            autoComplete="username"
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              if (error) setError(undefined);
            }}
          />
          <Field
            label="Senha"
            name="password"
            type="password"
            placeholder="••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(undefined);
            }}
          />
          <Button type="submit" $block>
            Entrar
          </Button>
        </Form>

        <Hint>Use as credenciais de teste: teste / teste.</Hint>
      </Card>
    </Page>
  );
}
