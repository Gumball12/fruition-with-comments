<template>
  <div
    class="
      duration-150
      max-w-screen-lg
      relative
      transform
      w-full
      hover:-translate-y-2px
    "
  >
    <textarea
      class="
        border border-gray-200
        duration-150
        h-240px
        max-w-screen-lg
        outline-none
        p-4
        resize-none
        rounded-md
        shadow-md
        text-xs
        w-full
        hover:shadow-lg
      "
      :class="{
        'cursor-default': isReadonly,
        'cursor-not-allowed': isError,
        'text-gray-500': isReadonly,
      }"
      :placeholder="placeholder"
      :value="isReadonly ? workerScript : modelValue"
      :isReadonly="isReadonly"
      :readonly="isReadonly"
      @input="handleChange"
      @click="selectAll"
    />
    <CopyButton
      class="absolute right-4 top-4"
      v-if="isReadonly"
      @click="copyWorkerScript"
      :isError="isError"
    />
  </div>
</template>

<script setup lang="ts">
import CopyButton from './CopyButton.vue';

import {
  UserDatas,
  genWorkerScriptFromUserDatas,
} from '../composables/useGiscus';
import { computed, reactive, toRefs } from '@vue/reactivity';

const props = defineProps<{
  placeholder?: string;
  isReadonly?: boolean;
  modelValue?: string;
  isError?: boolean;
  userDatas?: UserDatas;
}>();
const { isReadonly, isError, userDatas } = toRefs(reactive(props));
const emit = defineEmits(['update:modelValue']);

const workerScript = computed(() => {
  if (!userDatas?.value || isError?.value) {
    return 'Generated Cloudflare Worker Script';
  }

  // always of `UserDatas` type
  const script = genWorkerScriptFromUserDatas(userDatas.value);

  return script;
});

const copyWorkerScript = () => {
  if (isError?.value) {
    return;
  }

  console.log(workerScript.value);
  // navigator.clipboard.writeText(workerScript.value);
};

const handleChange = ({ currentTarget }: Event) =>
  emit('update:modelValue', (currentTarget as HTMLInputElement).value);

const selectAll = ({ currentTarget }: Event) => {
  if (isReadonly?.value) {
    return;
  }

  (currentTarget as HTMLInputElement).select();
};
</script>
