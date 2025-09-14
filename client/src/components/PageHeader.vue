<script setup lang="ts">
import {onMounted, ref} from "vue";

const dark = ref(false)

function click() {
  dark.value = !dark.value
  changeTheme()
}

function mounted() {
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
  dark.value = darkThemeMq.matches
  changeTheme()
  darkThemeMq.addEventListener('change', e => {
    dark.value = e.matches;
    changeTheme()
  });
}

onMounted(mounted)

function changeTheme() {
  if (dark.value) {
    window.document.body.setAttribute('arco-theme', 'dark')
  } else {
    window.document.body.removeAttribute('arco-theme');
  }
}
</script>

<template>
  <a-page-header class="page-header" :show-back="false">
    <template #title>
      <div
          style="display: flex;align-items: center;"
      >
        <p style="display: inline-block">Minecraft Server Panel</p>
      </div>
    </template>
    <template #extra>
      <a-button class="btn" shape="circle" @click="click">
        <icon-moon-fill v-if="dark"/>
        <icon-sun-fill v-else/>
      </a-button>
    </template>
  </a-page-header>
</template>

<style scoped>
.btn {
  margin-left: 10px;
  margin-right: 10px;
}

.page-header {
  height: 48px;
}
</style>