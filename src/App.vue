<template>
  <v-app>
    <HeaderView v-if="showHeader" />

    <v-main class="pt-18">
      <!-- Thêm pt-14 để tạo khoảng cách cho header cố định -->
      <router-view />
    </v-main>
    <FooterView class="mt-9" />
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import HeaderView from "@/components/HeaderView.vue";
import FooterView from "@/components/FooterView.vue";
const route = useRoute();

const showHeader = computed(() => {
  return !["login", "register"].includes(route.name);
});
</script>

<style>
.v-main {
  display: flex;
  flex-direction: column;
}

.v-main > .v-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding-top: 24px; /* Thêm padding phía trên */
}
</style>
