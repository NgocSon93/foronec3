<template>
  <v-app>
    <v-main>
      <HeaderView />
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
//
import HeaderView from "@/components/HeaderView.vue";
</script>
<style>
body {
  background-color: white;
}
</style>
