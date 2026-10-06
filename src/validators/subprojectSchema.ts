import * as yup from 'yup'

export const subprojectSchema = yup.object({
  name: yup.string().trim().required('Informe o nome do subprojeto.'),
})
