import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  min-height: 38px;
  padding: ${({ theme }) => `0 ${theme.spacing(3)}`};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.small};
  caret-color: ${({ theme }) => theme.colors.accent};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.accent};
  }
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.danger};
`;

export interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | undefined;
}

/**
 * Campo de formulário controlado com label e mensagem de erro.
 * Encaminha a ref para o `<input>`, o que o torna compatível com o
 * `register()` do React Hook Form: `<Field label="Nome" {...register('name')} />`.
 */
export const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, id, ...inputProps }, ref) => {
    const inputId = id ?? inputProps.name;
    return (
      <Wrapper>
        <Label htmlFor={inputId}>{label}</Label>
        <StyledInput
          id={inputId}
          ref={ref}
          $hasError={Boolean(error)}
          aria-invalid={Boolean(error)}
          {...inputProps}
        />
        {error ? <ErrorText role="alert">{error}</ErrorText> : null}
      </Wrapper>
    );
  },
);

Field.displayName = 'Field';
