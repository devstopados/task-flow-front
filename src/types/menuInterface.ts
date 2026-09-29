import type { FunctionalComponent } from 'vue'

export interface MenuItem {
  name: string
  label: string
  to: string
  icon: FunctionalComponent
}
