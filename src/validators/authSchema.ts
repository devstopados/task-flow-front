import * as yup from 'yup'

export const loginSchema = yup.object({
  email: yup.string().trim().required('Informe seu e-mail.').email('Informe um e-mail válido.'),
  password: yup
    .string()
    .required('Informe a senha.')
    .min(8, 'A senha deve ter ao menos 8 caracteres.'),
})
