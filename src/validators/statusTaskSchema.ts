import * as yup from 'yup'

export const statusTaskSchema = yup.object({
  name: yup.string().trim().required('Informe o nome do status.'),
  slug: yup.string().trim().optional(),
})
