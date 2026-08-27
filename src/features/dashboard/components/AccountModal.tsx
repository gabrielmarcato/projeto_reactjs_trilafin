import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Field } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/SelectField';
import { useAccountsStore } from '@/store/useAccountsStore';
import type { Account } from '@/store/useAccountsStore';
import {
  ACCOUNT_TYPE_OPTIONS,
  accountFormSchema,
  emptyAccountForm,
} from '../accountSchema';
import type { AccountFormValues } from '../accountSchema';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(5)};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing(4)};

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const Spacer = styled.div`
  margin-left: auto;
`;

const ConfirmBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  background: ${({ theme }) => theme.colors.accentSoft};
`;

const ConfirmText = styled.span`
  margin-right: auto;
  font-size: ${({ theme }) => theme.type.small};
  color: ${({ theme }) => theme.colors.text};
`;

/** Converte uma conta da store nos valores do formulário. */
function accountToForm(account: Account): AccountFormValues {
  return {
    name: account.name,
    type: account.type,
    bank: account.bank,
    agency: account.agency ?? '',
    number: account.number,
    initialBalance: account.balance,
    holder: account.holder ?? '',
    includeInNetWorth: account.includeInNetWorth,
  };
}

export interface AccountModalProps {
  open: boolean;
  onClose: () => void;
  /** Conta a editar. Ausente/`null` → modo de criação. */
  account?: Account | null;
}

/**
 * Modal de conta em dois modos: cria (sem `account`) ou edita (com `account`).
 * Persiste na store Zustand e permite remover a conta em edição (com
 * confirmação em dois passos).
 */
export function AccountModal({ open, onClose, account }: AccountModalProps) {
  const addAccount = useAccountsStore((s) => s.addAccount);
  const updateAccount = useAccountsStore((s) => s.updateAccount);
  const removeAccount = useAccountsStore((s) => s.removeAccount);
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const isEditing = Boolean(account);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: emptyAccountForm,
    mode: 'onBlur',
  });

  // Sincroniza os campos ao abrir (valores da conta em edição, ou vazios).
  useEffect(() => {
    if (open) {
      reset(account ? accountToForm(account) : emptyAccountForm);
      setConfirmingRemove(false);
    }
  }, [open, account, reset]);

  const close = () => {
    onClose();
  };

  const onSubmit = handleSubmit((values) => {
    const payload = {
      name: values.name,
      type: values.type,
      bank: values.bank,
      agency: values.agency || undefined,
      number: values.number,
      balance: values.initialBalance,
      holder: values.holder || undefined,
      includeInNetWorth: values.includeInNetWorth,
    };
    if (account) {
      updateAccount(account.id, payload);
    } else {
      addAccount(payload);
    }
    close();
  });

  const handleRemove = () => {
    if (account) removeAccount(account.id);
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={isEditing ? 'Editar conta' : 'Cadastrar conta'}
    >
      <Form onSubmit={onSubmit} noValidate>
        <Field
          label="Nome da conta"
          placeholder="Ex.: Conta corrente, Reserva de emergência"
          error={errors.name?.message}
          {...register('name')}
        />

        <Grid>
          <SelectField
            label="Tipo"
            options={ACCOUNT_TYPE_OPTIONS}
            error={errors.type?.message}
            {...register('type')}
          />
          <Field
            label="Banco / instituição"
            placeholder="Ex.: Itaú, Nubank"
            error={errors.bank?.message}
            {...register('bank')}
          />
        </Grid>

        <Grid>
          <Field
            label="Agência"
            placeholder="0001"
            error={errors.agency?.message}
            {...register('agency')}
          />
          <Field
            label="Número da conta"
            placeholder="12345-6"
            error={errors.number?.message}
            {...register('number')}
          />
        </Grid>

        <Grid>
          <Field
            label={isEditing ? 'Saldo (R$)' : 'Saldo inicial (R$)'}
            type="number"
            step="0.01"
            min="0"
            error={errors.initialBalance?.message}
            {...register('initialBalance')}
          />
          <Field
            label="Titular (opcional)"
            placeholder="Nome do titular"
            error={errors.holder?.message}
            {...register('holder')}
          />
        </Grid>

        <Checkbox
          label="Incluir no patrimônio líquido"
          {...register('includeInNetWorth')}
        />

        {confirmingRemove ? (
          <ConfirmBar role="alertdialog" aria-label="Confirmar remoção">
            <ConfirmText>Remover esta conta? Não dá para desfazer.</ConfirmText>
            <Button
              type="button"
              $variant="secondary"
              onClick={() => setConfirmingRemove(false)}
            >
              Cancelar
            </Button>
            <Button type="button" $variant="primary" onClick={handleRemove}>
              Sim, remover
            </Button>
          </ConfirmBar>
        ) : (
          <Actions>
            {isEditing ? (
              <Button
                type="button"
                $variant="danger"
                onClick={() => setConfirmingRemove(true)}
              >
                Remover conta
              </Button>
            ) : null}
            <Spacer />
            <Button type="button" $variant="secondary" onClick={close}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? 'Salvar alterações' : 'Salvar conta'}
            </Button>
          </Actions>
        )}
      </Form>
    </Modal>
  );
}
