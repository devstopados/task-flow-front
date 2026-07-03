<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b border-neutral">
          <th
            v-for="col in columns"
            :key="col.key"
            class="pb-2 pr-6 text-left text-sm font-semibold text-secondary"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-if="rows.length === 0"
        >
          <td
            :colspan="columns.length"
            class="py-8 text-center text-sm text-gray"
          >
            {{ emptyMessage }}
          </td>
        </tr>

        <tr
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          class="border-b border-neutral/50 last:border-0"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="py-3 pr-6 text-slate-700"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="rowIndex">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TaskTable',
})

export interface TableColumn {
  key: string
  label: string
}

defineProps<{
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  emptyMessage?: string
}>()
</script>
