<template>
  <div :class="wrapperClasses">
    <label :for="checkboxId" :class="labelClasses">
      <input
        :id="checkboxId"
        ref="checkboxRef"
        v-bind="attrs"
        :name="name"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-invalid="Boolean(error)"
        :aria-describedby="descriptionId"
        :class="checkboxClasses"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
      />

      <span class="flex flex-col">
        <span class="text-sm font-medium text-slate-800">
          <slot>{{ label }}</slot>
        </span>
        <span v-if="secondaryLabel" class="text-xs text-slate-500">{{ secondaryLabel }}</span>
      </span>
    </label>

    <p
      v-if="error || hint"
      :id="descriptionId"
      :class="['text-xs', error ? 'text-rose-600' : 'text-slate-500']"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";

defineOptions({
  name: "TaskCheckbox",
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    id?: string;
    name?: string;
    label?: string;
    secondaryLabel?: string;
    hint?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    fullWidth?: boolean;
  }>(),
  {
    modelValue: false,
    disabled: false,
    required: false,
    fullWidth: true,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "change", value: boolean, nativeEvent: Event): void;
  (event: "focus", nativeEvent: FocusEvent): void;
  (event: "blur", nativeEvent: FocusEvent): void;
  (event: "keydown", nativeEvent: KeyboardEvent): void;
  (event: "keyup", nativeEvent: KeyboardEvent): void;
  (event: "enter", value: boolean, nativeEvent: KeyboardEvent): void;
}>();

const attrs = useAttrs();
const checkboxRef = ref<HTMLInputElement | null>(null);
const generatedId = `task-checkbox-${Math.random().toString(36).slice(2, 10)}`;

const checkboxId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() => `${checkboxId.value}-description`);

const wrapperClasses = computed(() => ["flex flex-col gap-2", props.fullWidth && "w-full"]);
const labelClasses = computed(() => [
  "flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition",
  props.disabled
    ? "cursor-not-allowed bg-slate-100"
    : "cursor-pointer hover:border-sky-300 hover:bg-sky-50/40",
]);

const checkboxClasses = computed(() => [
  "mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-300",
  props.disabled && "cursor-not-allowed",
  props.error && "border-rose-400 focus:ring-rose-200",
]);

function handleChange(event: Event) {
  const value = (event.target as HTMLInputElement).checked;
  emit("update:modelValue", value);
  emit("change", value, event);
}

function handleFocus(event: FocusEvent) {
  emit("focus", event);
}

function handleBlur(event: FocusEvent) {
  emit("blur", event);
}

function handleKeydown(event: KeyboardEvent) {
  emit("keydown", event);

  if (event.key === "Enter") {
    emit("enter", props.modelValue ?? false, event);
  }
}

function handleKeyup(event: KeyboardEvent) {
  emit("keyup", event);
}
</script>
