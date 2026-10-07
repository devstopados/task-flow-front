import type { FunctionalComponent } from 'vue'

export interface MenuItemChild {
  name: string
  label: string
  to: string
  icon?: FunctionalComponent
}

export interface MenuItem {
  name: string
  label: string
  to?: string
  icon: FunctionalComponent
  children?: MenuItemChild[]
}
