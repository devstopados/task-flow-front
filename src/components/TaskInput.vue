<template>
  <div :class="wrapperClasses">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-rose-500">*</span>
    </label>

    <div class="relative">
      <div
        v-if="$slots.prepend"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"
      >
        <slot name="prepend" />
      </div>

      <input
        :id="inputId"
        ref="inputRef"
        v-bind="attrs"
        :name="name"
        :type="type"
        :value="normalizedValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :min="min"
        :max="max"
        :step="step"
        :minlength="minlength"
        :maxlength="maxlength"
        :pattern="pattern"
        :aria-invalid="Boolean(error)"
        :aria-describedby="descriptionId"
        :class="inputClasses"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
      />

      <button
        v-if="showClearButton"
        type="button"
        class="absolute inset-y-0 right-2 my-auto h-8 rounded-lg px-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
        @click="clearValue"
      >
        Limpar
      </button>

      <div
        v-if="$slots.append"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400"
      >
        <slot name="append" />
      </div>
    </div>

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
import { computed, ref, useAttrs, useSlots } from "vue";

defineOptions({
  name: "TaskInput",
  inheritAttrs: false,
});

type InputSize = "sm" | "md" | "lg";
type InputMode = "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    id?: string;
    name?: string;
    label?: string;
    hint?: string;
    error?: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    autocomplete?: string;
    inputmode?: InputMode;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    minlength?: number;
    maxlength?: number;
    pattern?: string;
    size?: InputSize;
    clearable?: boolean;
    fullWidth?: boolean;
  }>(),
  {
    modelValue: "",
    type: "text",
    size: "md",
    clearable: false,
    fullWidth: true,
    disabled: false,
    readonly: false,
    required: false,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "input", value: string, nativeEvent: Event): void;
  (event: "change", value: string, nativeEvent: Event): void;
  (event: "focus", nativeEvent: FocusEvent): void;
  (event: "blur", nativeEvent: FocusEvent): void;
  (event: "keydown", nativeEvent: KeyboardEvent): void;
  (event: "keyup", nativeEvent: KeyboardEvent): void;
  (event: "enter", value: string, nativeEvent: KeyboardEvent): void;
  (event: "clear"): void;
}>();

const attrs = useAttrs();
const slots = useSlots();
const inputRef = ref<HTMLInputElement | null>(null);
const generatedId = `task-input-${Math.random().toString(36).slice(2, 10)}`;

const inputId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() => `${inputId.value}-description`);
const normalizedValue = computed(() => String(props.modelValue ?? ""));

const wrapperClasses = computed(() => ["flex flex-col gap-2", props.fullWidth && "w-full"]);

const sizeClasses: Record<InputSize, string> = {
  sm: "h-9 rounded-lg px-3 text-sm",
  md: "h-11 rounded-xl px-4 text-sm",
  lg: "h-12 rounded-xl px-4 text-base",
};

const inputClasses = computed(() => {
  const hasPrepend = Boolean(slots.prepend);
  const hasAppend = Boolean(slots.append);

  return [
    "w-full border bg-white text-slate-900 placeholder:text-slate-400 outline-none transition",
    "focus:ring-4",
    sizeClasses[props.size],
    hasPrepend && "pl-10",
    (hasAppend || showClearButton.value) && "pr-16",
    props.error
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
      : "border-slate-300 focus:border-sky-500 focus:ring-sky-100",
    props.disabled && "cursor-not-allowed bg-slate-100 text-slate-500",
    props.readonly && "bg-slate-50",
  ];
});

const showClearButton = computed(
  () => props.clearable && !props.disabled && !props.readonly && normalizedValue.value.length > 0,
);

function valueFromEvent(event: Event): string {
  return (event.target as HTMLInputElement).value;
}

function handleInput(event: Event) {
  const value = valueFromEvent(event);
  emit("update:modelValue", value);
  emit("input", value, event);
}

function handleChange(event: Event) {
  emit("change", valueFromEvent(event), event);
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
    emit("enter", normalizedValue.value, event);
  }
}

function handleKeyup(event: KeyboardEvent) {
  emit("keyup", event);
}

function clearValue() {
  emit("update:modelValue", "");
  emit("clear");
  inputRef.value?.focus();
}
</script>
