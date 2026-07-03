<template>
  <div :class="wrapperClasses">
    <label v-if="label" :for="textAreaId" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-rose-500">*</span>
    </label>

    <textarea
      :id="textAreaId"
      ref="textAreaRef"
      v-bind="attrs"
      :name="name"
      :value="normalizedValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :maxlength="maxLength"
      :aria-invalid="Boolean(error)"
      :aria-describedby="descriptionId"
      :class="textAreaClasses"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keyup="handleKeyup"
    />

    <div class="flex items-center justify-between gap-3">
      <p
        v-if="error || hint"
        :id="descriptionId"
        :class="['text-xs', error ? 'text-rose-600' : 'text-slate-500']"
      >
        {{ error || hint }}
      </p>

      <p v-if="showCounter" class="ml-auto text-xs font-medium" :class="counterClasses">
        {{ characterCount }}<span v-if="maxLength"> / {{ maxLength }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";

defineOptions({
  name: "TaskTextArea",
  inheritAttrs: false,
});

type TextAreaSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    id?: string;
    name?: string;
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    rows?: number;
    maxLength?: number;
    size?: TextAreaSize;
    fullWidth?: boolean;
    showCounter?: boolean;
  }>(),
  {
    modelValue: "",
    rows: 4,
    size: "md",
    fullWidth: true,
    showCounter: true,
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
}>();

const attrs = useAttrs();
const textAreaRef = ref<HTMLTextAreaElement | null>(null);
const generatedId = `task-textarea-${Math.random().toString(36).slice(2, 10)}`;

const textAreaId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() => `${textAreaId.value}-description`);
const normalizedValue = computed(() => String(props.modelValue ?? ""));
const characterCount = computed(() => normalizedValue.value.length);

const wrapperClasses = computed(() => ["flex flex-col gap-2", props.fullWidth && "w-full"]);

const sizeClasses: Record<TextAreaSize, string> = {
  sm: "rounded-lg px-3 py-2 text-sm",
  md: "rounded-xl px-4 py-3 text-sm",
  lg: "rounded-2xl px-4 py-4 text-base",
};

const textAreaClasses = computed(() => [
  "w-full border bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-4",
  sizeClasses[props.size],
  props.error
    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
    : "border-slate-300 focus:border-sky-500 focus:ring-sky-100",
  props.disabled && "cursor-not-allowed bg-slate-100 text-slate-500",
  props.readonly && "bg-slate-50",
]);

const counterClasses = computed(() => [
  props.maxLength && characterCount.value >= props.maxLength ? "text-rose-600" : "text-slate-500",
]);

function valueFromEvent(event: Event): string {
  return (event.target as HTMLTextAreaElement).value;
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
</script>
