import * as yup from 'yup'

export const taskSchema = yup.object({
  name: yup.string().trim().required('Informe o nome da tarefa.'),
  project: yup.string().required('Selecione um projeto.'),
  startDate: yup.string().required('Informe a data de início.'),
  status: yup.string().required('Selecione um status.'),
  description: yup.string().default(''),
})
