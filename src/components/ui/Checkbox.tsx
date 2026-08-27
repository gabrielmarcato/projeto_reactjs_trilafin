import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

const Row = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  user-select: none;
`;

const Box = styled.input`
  appearance: none;
  width: 16px;
  height: 16px;
  flex: none;
  margin: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  display: grid;
  place-items: center;
  cursor: pointer;

  &:checked {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accent};
  }

  /* marca (✓) desenhada com um pseudo-elemento */
  &:checked::after {
    content: '';
    width: 4px;
    height: 8px;
    margin-top: -2px;
    border: solid ${({ theme }) => theme.colors.onAccent};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label: string;
}

/** Checkbox temático (sem raio) com rótulo. Compatível com RHF `register()`. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => (
    <Row>
      <Box type="checkbox" ref={ref} {...props} />
      {label}
    </Row>
  ),
);

Checkbox.displayName = 'Checkbox';
