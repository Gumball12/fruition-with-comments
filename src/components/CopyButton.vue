<template>
  <div
    class="
      bg-white
      border-1 border-gray-300 border-solid
      cursor-pointer
      duration-150
      flex
      h-9
      items-center
      justify-center
      rounded-md
      text-gray-400
      w-9
      hover:bg-gray-100 hover:text-gray-500
    "
    :class="{
      'hover:bg-gray-200': isClicked,
      'hover:cursor-not-allowed': isError,
    }"
    @mousedown="handleMousedown"
    @mouseup="isClicked = false"
  >
    <span class="material-icons-outlined text-xl">
      {{ isDone ? 'done' : 'content_copy' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, toRefs } from '@vue/reactivity';

const CLICKED_DEBOUNCING_TIMEOUT = 1000;

const props = defineProps<{
  isError?: boolean;
}>();
const { isError } = toRefs(reactive(props));

const isClicked = ref(false);
const isDone = ref(false);

const handleMousedown = (() => {
  let storedTimeoutInd: number | null;

  return () => {
    if (isError?.value) {
      return;
    }

    isClicked.value = true;
    isDone.value = true;

    if (storedTimeoutInd) {
      clearInterval(storedTimeoutInd);
    }

    storedTimeoutInd = setTimeout(() => {
      isDone.value = false;
      storedTimeoutInd = null;
    }, CLICKED_DEBOUNCING_TIMEOUT);
  };
})();
</script>
