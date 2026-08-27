import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Field } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/SelectField';
import type { SelectOption } from '@/components/ui/SelectField';
import { useAccountsStore } from '@/store/useAccountsStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Transaction } from '@/store/useTransactionsStore';
import { TYPE_OPTIONS, transactionSchema } from '../transactionSchema';
import type { TransactionFormValues } from '../transactionSchema';

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

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const GroupLabel = styled.span`
  font-size: ${({ theme }) => theme.type.micro};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.type.kicker};
  color: ${({ theme }) => theme.colors.danger};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
`;

function transactionToForm(
  t: Transaction | null,
  fallbackAccount: string,
): TransactionFormValues {
  return {
    description: t?.description ?? '',
    date: t?.date ?? '2026-08-26',
    type: t?.type ?? 'saida',
    amount: t?.amount ?? ('' as unknown as number),
    account: t?.account || fallbackAccount,
    categories: t?.categories ?? [],
    tags: t?.tags ?? [],
    paymentMethod: t?.paymentMethod ?? '',
    budgetType: t?.budgetType ?? '',
  };
}

export interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  onSubmit: (values: TransactionFormValues) => void;
}

/**
 * Modal único de adicionar/editar transação. As categorias são um grupo de
 * checkboxes (seleção múltipla); conta, categorias e forma de pagamento vêm
 * das stores de contas e de configurações.
 */
export function TransactionModal({
  open,
  onClose,
  transaction,
  onSubmit,
}: TransactionModalProps) {
  const accounts = useAccountsStore((s) => s.accounts);
  const categories = useSettingsStore((s) => s.collections.categories);
  const paymentMethods = useSettingsStore((s) => s.collections.paymentMethods);
  const budgetTypes = useSettingsStore((s) => s.collections.budgetTypes);
  const tags = useSettingsStore((s) => s.collections.tags);

  const isEditing = Boolean(transaction);
  const fallbackAccount = accounts[0]?.name ?? '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transactionToForm(transaction ?? null, fallbackAccount),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (open) reset(transactionToForm(transaction ?? null, fallbackAccount));
  }, [open, transaction, fallbackAccount, reset]);

  const accountOptions: SelectOption[] = accounts.map((a) => ({
    value: a.name,
    label: a.name,
  }));
  const paymentOptions: SelectOption[] = [
    { value: '', label: '—' },
    ...paymentMethods.map((p) => ({ value: p.name, label: p.name })),
  ];
  const budgetTypeOptions: SelectOption[] = [
    { value: '', label: '—' },
    ...budgetTypes.map((b) => ({ value: b.name, label: b.name })),
  ];

  const submit = handleSubmit((values) => {
    onSubmit(values);
    onClose();
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${isEditing ? 'Editar' : 'Novo'} lançamento`}
    >
      <Form onSubmit={submit} noValidate>
        <Field
          label="Descrição"
          placeholder="Ex.: Mercado, Salário…"
          error={errors.description?.message}
          {...register('description')}
        />

        <Grid>
          <SelectField
            label="Tipo"
            options={TYPE_OPTIONS}
            error={errors.type?.message}
            {...register('type')}
          />
          <Field
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </Grid>

        <Grid>
          <Field
            label="Data"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
          <SelectField
            label="Conta"
            options={accountOptions}
            error={errors.account?.message}
            {...register('account')}
          />
        </Grid>

        <Grid>
          <SelectField
            label="Forma de pagamento"
            options={paymentOptions}
            error={errors.paymentMethod?.message}
            {...register('paymentMethod')}
          />
          <SelectField
            label="Tipo de orçamento"
            options={budgetTypeOptions}
            error={errors.budgetType?.message}
            {...register('budgetType')}
          />
        </Grid>

        <Group>
          <GroupLabel>Categorias</GroupLabel>
          <Categories>
            {categories.map((c) => (
              <Checkbox
                key={c.id}
                label={c.name}
                value={c.name}
                {...register('categories')}
              />
            ))}
          </Categories>
          {errors.categories ? (
            <ErrorText role="alert">{errors.categories.message}</ErrorText>
          ) : null}
        </Group>

        <Group>
          <GroupLabel>Etiquetas</GroupLabel>
          <Categories>
            {tags.map((t) => (
              <Checkbox
                key={t.id}
                label={t.name}
                value={t.name}
                {...register('tags')}
              />
            ))}
          </Categories>
        </Group>

        <Actions>
          <Button type="button" $variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? 'Salvar' : 'Adicionar'}
          </Button>
        </Actions>
      </Form>
    </Modal>
  );
}
