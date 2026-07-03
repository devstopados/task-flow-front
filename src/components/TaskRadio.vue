<template>
  <fieldset :class="wrapperClasses" :disabled="disabled">
    <legend v-if="label" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-rose-500">*</span>
    </legend>

    <div :class="groupClasses">
      <label
        v-for="option in normalizedOptions"
        :key="String(option.value)"
        :class="optionClasses(Boolean(option.disabled))"
      >
        <input
          :id="getOptionId(option.value)"
          type="radio"
          :name="name"
          :value="String(option.value)"
          :checked="normalizedValue === String(option.value)"
          :disabled="disabled || option.disabled"
          :required="required"
          :aria-invalid="Boolean(error)"
          :aria-describedby="descriptionId"
          class="h-4 w-4 border-slate-300 text-sky-700 focus:ring-sky-300"
          @change="handleChange(option.value, $event)"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown"
          @keyup="handleKeyup"
        />

        <span class="flex flex-col">
          <span class="font-medium text-slate-800">{{ option.label }}</span>
          <span v-if="option.description" class="text-xs text-slate-500">{{
            option.description
          }}</span>
        </span>
      </label>
    </div>

    <p
      v-if="error || hint"
      :id="descriptionId"
      :class="['text-xs', error ? 'text-rose-600' : 'text-slate-500']"
    >
      {{ error || hint }}
    </p>
  </fieldset>
</template>

<script setup lang="ts">
import { computed } from "vue";

defineOptions({
  name: "TaskRadio",
});

type RadioSize = "sm" | "md" | "lg";
type RadioPrimitive = string | number;
type RadioOptionObject = {
  label: string;
  value: RadioPrimitive;
  description?: string;
  disabled?: boolean;
};
type RadioOption = RadioPrimitive | RadioOptionObject;
type RadioOrientation = "vertical" | "horizontal";

const props = withDefaults(
  defineProps<{
    modelValue?: RadioPrimitive | null;
    options?: RadioOption[];
    id?: string;
    name?: string;
    label?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    size?: RadioSize;
    orientation?: RadioOrientation;
    fullWidth?: boolean;
  }>(),
  {
    modelValue: "",
    options: () => [],
    required: false,
    disabled: false,
    size: "md",
    orientation: "vertical",
    fullWidth: true,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "change", value: string, nativeEvent: Event): void;
  (event: "focus", nativeEvent: FocusEvent): void;
  (event: "blur", nativeEvent: FocusEvent): void;
  (event: "keydown", nativeEvent: KeyboardEvent): void;
  (event: "keyup", nativeEvent: KeyboardEvent): void;
  (event: "enter", value: string, nativeEvent: KeyboardEvent): void;
}>();

const generatedId = `task-radio-${Math.random().toString(36).slice(2, 10)}`;
const baseId = computed(() => props.id ?? generatedId);
const descriptionId = computed(() => `${baseId.value}-description`);
const normalizedValue = computed(() => String(props.modelValue ?? ""));

const normalizedOptions = computed<RadioOptionObject[]>(() =>
  props.options.map((option) => {
    if (typeof option === "string" || typeof option === "number") {
      return { label: String(option), value: option, description: "", disabled: false };
    }

    return {
      label: option.label,
      value: option.value,
      description: option.description ?? "",
      disabled: Boolean(option.disabled),
    };
  }),
);

const wrapperClasses = computed(() => ["flex flex-col gap-2", props.fullWidth && "w-full"]);
const groupClasses = computed(() => [
  "flex gap-3",
  props.orientation === "vertical" ? "flex-col" : "flex-wrap items-center",
]);

const sizeClasses: Record<RadioSize, string> = {
  sm: "rounded-lg px-3 py-2 text-sm",
  md: "rounded-xl px-4 py-3 text-sm",
  lg: "rounded-2xl px-4 py-4 text-base",
};

function getOptionId(value: RadioPrimitive) {
  return `${baseId.value}-${String(value)}`;
}

function optionClasses(isDisabled: boolean) {
  return [
    "flex cursor-pointer items-start gap-3 border border-slate-200 bg-white transition",
    "hover:border-sky-300 hover:bg-sky-50/40",
    sizeClasses[props.size],
    isDisabled &&
      "cursor-not-allowed bg-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-100",
  ];
}

function valueFromEvent(event: Event): string {
  return (event.target as HTMLInputElement).value;
}

function handleChange(value: RadioPrimitive, event: Event) {
  const normalized = String(value);
  emit("update:modelValue", normalized);
  emit("change", normalized, event);
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
