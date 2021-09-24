<template>
  <main
    class="
      antialiased
      break-words
      flex flex-col
      gap-12
      justify-center
      pt-20
      px-4
      pb-12
      select-none
      text-center
    "
  >
    <HeaderPanel />
    <section class="flex flex-col gap-8 px-12">
      <ScriptPanel v-model="giscusScript" :placeholder="inputPlaceholder" />
      <ScriptPanel
        :userDatas="userDatas"
        :isReadonly="true"
        :isError="!isValidGiscusScript"
      />
    </section>
    <section class="flex font-bold gap-2 justify-center text-blue-500">
      <a
        class="hover:underline"
        href="https://github.com/Gumball12/fruition-with-giscus"
        target="_blank"
        >GitHub</a
      >
      <a
        class="hover:underline"
        href="https://fruition-with-giscus.shj.rip"
        target="_blank"
        >Notion</a
      >
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity';
import { watch } from '@vue/runtime-core';

import HeaderPanel from './components/HeaderPanel.vue';
import ScriptPanel from './components/ScriptPanel.vue';

import {
  userDatas,
  updateUserDatasFromScriptElem,
  isValidScriptElem,
} from './composables/useGiscus';

const inputPlaceholder = `<script
    src="https://giscus.app/client.js"
    data-repo="[ENTER REPO HERE]"
    data-repo-id="[ENTER REPO ID HERE]"
    data-category="[ENTER CATEGORY NAME HERE]"
    data-category-id="[ENTER CATEGORY ID HERE]"
    data-mapping="url"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-theme="light"
    crossorigin="anonymous"
    async>
<\/script>`;

const giscusScript = ref('');
const isValidGiscusScript = ref(false);

watch(giscusScript, giscusScript => {
  const template = document.createElement('template');
  template.innerHTML = giscusScript;
  const scriptElem = template.content.firstElementChild;

  if (!isValidScriptElem({ userDatas, scriptElem })) {
    isValidGiscusScript.value = false;
    return;
  }

  updateUserDatasFromScriptElem({ scriptElem: scriptElem!, userDatas });
  isValidGiscusScript.value = true;
  return;
});
</script>
