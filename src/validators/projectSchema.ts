import * as yup from 'yup'

export const projectSchema = yup.object({
  name: yup.string().trim().required('Informe o nome do projeto.'),
  responsible: yup.string().trim().required('Informe o responsável.'),
  startDate: yup.string().required('Informe a data de início.'),
  status: yup.string().required('Selecione um status.'),
  description: yup.string().default(''),
})
