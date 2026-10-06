import * as yup from 'yup'

export const projectSchema = yup.object({
  name: yup.string().trim().required('Informe o nome do projeto.'),
})
