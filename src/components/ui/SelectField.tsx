import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.type.micro};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StyledSelect = styled.select<{ $hasError?: boolean }>`
  min-height: 38px;
  padding: 0 ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ theme }) => theme.type.small};

  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.accent};
  }
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.type.kicker};
  color: ${({ theme }) => theme.colors.danger};
`;

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[];
  error?: string | undefined;
}

/**
 * Select rotulado com mensagem de erro. Encaminha a ref para o `<select>`,
 * então é compatível com `register()` do React Hook Form.
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, id, ...selectProps }, ref) => {
    const selectId = id ?? selectProps.name;
    return (
      <Wrapper>
        <Label htmlFor={selectId}>{label}</Label>
        <StyledSelect
          id={selectId}
          ref={ref}
          $hasError={Boolean(error)}
          aria-invalid={Boolean(error)}
          {...selectProps}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
        {error ? <ErrorText role="alert">{error}</ErrorText> : null}
      </Wrapper>
    );
  },
);

SelectField.displayName = 'SelectField';
