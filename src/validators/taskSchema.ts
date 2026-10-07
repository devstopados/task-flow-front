import * as yup from 'yup'

export const taskSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Informe o nome da tarefa.')
    .max(255, 'O nome deve ter no máximo 255 caracteres.'),
  code: yup
    .string()
    .trim()
    .nullable()
    .max(50, 'O código deve ter no máximo 50 caracteres.')
    .default(''),
  status_id: yup
    .number()
    .typeError('Selecione um status.')
    .required('Selecione um status.'),
  subproject_id: yup
    .number()
    .typeError('Selecione um subprojeto.')
    .transform((val, orig) => (orig === '' || orig === null ? undefined : val))
    .required('Selecione um subprojeto.'),
  start_date: yup.string().nullable().default(''),
  end_date: yup.string().nullable().default(''),
  hours: yup
    .number()
    .nullable()
    .transform((val, orig) => (orig === '' || orig === null ? null : val))
    .min(0, 'Horas não podem ser negativas.'),
  branch: yup.string().trim().nullable().default(''),
  link: yup.string().trim().nullable().default(''),
})
