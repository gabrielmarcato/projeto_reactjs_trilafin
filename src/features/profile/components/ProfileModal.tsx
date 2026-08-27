import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { SelectField } from '@/components/ui/SelectField';
import type { SelectOption } from '@/components/ui/SelectField';
import { Label } from '@/components/ui/Text';
import { useProfileStore } from '@/store/useProfileStore';
import type { Profile } from '@/store/useProfileStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { profileSchema, UFS } from '../profileSchema';
import type { ProfileFormValues } from '../profileSchema';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

// Layout horizontal: as 3 seções ficam lado a lado (sem scroll vertical).
const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing(8)};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing(3)};
`;

function profileToForm(p: Profile): ProfileFormValues {
  return {
    name: p.name,
    email: p.email,
    cpf: p.cpf ?? '',
    phone: p.phone ?? '',
    birthDate: p.birthDate ?? '',
    cep: p.cep ?? '',
    street: p.street ?? '',
    number: p.number ?? '',
    complement: p.complement ?? '',
    district: p.district ?? '',
    city: p.city ?? '',
    uf: p.uf ?? '',
    defaultCurrency: p.defaultCurrency ?? '',
    closingDay: p.closingDay,
    monthlyIncome: p.monthlyIncome,
  };
}

const clean = (s?: string) => (s && s.trim() ? s.trim() : undefined);

export interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal de Conta: dados pessoais, endereço e preferências financeiras do
 * usuário. Persiste no `useProfileStore` (que alimenta o avatar do topo).
 */
export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const profile = useProfileStore((s) => s.profile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const currencies = useSettingsStore((s) => s.collections.currencies);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileToForm(profile),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (open) reset(profileToForm(profile));
  }, [open, profile, reset]);

  const ufOptions: SelectOption[] = [
    { value: '', label: '—' },
    ...UFS.map((uf) => ({ value: uf, label: uf })),
  ];
  const currencyOptions: SelectOption[] = [
    { value: '', label: '—' },
    ...currencies.map((c) => ({ value: c.name, label: c.name })),
  ];

  const onSubmit = handleSubmit((values) => {
    updateProfile({
      name: values.name,
      email: values.email,
      cpf: clean(values.cpf),
      phone: clean(values.phone),
      birthDate: clean(values.birthDate),
      cep: clean(values.cep),
      street: clean(values.street),
      number: clean(values.number),
      complement: clean(values.complement),
      district: clean(values.district),
      city: clean(values.city),
      uf: clean(values.uf),
      defaultCurrency: clean(values.defaultCurrency),
      closingDay: values.closingDay,
      monthlyIncome: values.monthlyIncome,
    });
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose} title="Minha conta" size="lg">
      <Form onSubmit={onSubmit} noValidate>
        <Columns>
          <Section>
            <Label as="div">Dados pessoais</Label>
            <Field
              label="Nome completo"
              error={errors.name?.message}
              {...register('name')}
            />
            <Field
              label="E-mail"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Field
              label="CPF"
              placeholder="000.000.000-00"
              error={errors.cpf?.message}
              {...register('cpf')}
            />
            <Field
              label="Telefone / celular"
              placeholder="(11) 99999-0000"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Field
              label="Data de nascimento"
              type="date"
              error={errors.birthDate?.message}
              {...register('birthDate')}
            />
          </Section>

          <Section>
            <Label as="div">Endereço</Label>
            <Field
              label="CEP"
              placeholder="00000-000"
              error={errors.cep?.message}
              {...register('cep')}
            />
            <Field
              label="Logradouro"
              placeholder="Rua, avenida…"
              error={errors.street?.message}
              {...register('street')}
            />
            <Field
              label="Número"
              error={errors.number?.message}
              {...register('number')}
            />
            <Field
              label="Complemento"
              placeholder="Apto, bloco…"
              error={errors.complement?.message}
              {...register('complement')}
            />
            <Field
              label="Bairro"
              error={errors.district?.message}
              {...register('district')}
            />
            <Field
              label="Cidade"
              error={errors.city?.message}
              {...register('city')}
            />
            <SelectField
              label="UF"
              options={ufOptions}
              error={errors.uf?.message}
              {...register('uf')}
            />
          </Section>

          <Section>
            <Label as="div">Preferências financeiras</Label>
            <SelectField
              label="Moeda padrão"
              options={currencyOptions}
              error={errors.defaultCurrency?.message}
              {...register('defaultCurrency')}
            />
            <Field
              label="Dia de fechamento do mês"
              type="number"
              min="1"
              max="31"
              error={errors.closingDay?.message}
              {...register('closingDay')}
            />
            <Field
              label="Renda mensal (R$)"
              type="number"
              step="0.01"
              min="0"
              error={errors.monthlyIncome?.message}
              {...register('monthlyIncome')}
            />
          </Section>
        </Columns>

        <Actions>
          <Button type="button" $variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Salvar
          </Button>
        </Actions>
      </Form>
    </Modal>
  );
}
