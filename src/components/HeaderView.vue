<template>
  <v-app>
    <v-app-bar app color="#2b2d42" elevation="1" fixed>
      <!-- <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon> -->

      <v-app-bar-title class="text-h5 font-weight-bold">
        <div class="d-flex align-center">
          <RouterLink
            class="text-primary ms-2 d-flex align-center"
            :to="{ name: 'home' }"
          >
            <img
              src="@/assets/PNG64.png"
              alt="MunPOD"
              class="mr-2 image-logo"
            />
            <span class="text-white text-decoration-none"> FOR ONE </span>
          </RouterLink>
        </div>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn
        prepend-icon="mdi-clipboard-text-outline"
        class="mx-2 font-weight-bold"
        color="#fca311"
      >
        Orders
      </v-btn>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="mx-2">
            Manage
            <v-icon icon="mdi-chevron-down" end></v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in manageItems"
            :key="index"
            :value="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn class="mx-2">Transaction</v-btn>
      <v-btn class="mx-2">User</v-btn>
      <v-btn class="mx-2">Designer</v-btn>
      <v-btn class="mx-2">Hướng dẫn sử dụng</v-btn>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-brightness-4"></v-btn>

      <v-badge content="50" color="error">
        <v-btn icon="mdi-bell"></v-btn>
      </v-badge>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon class="ml-2">
            <v-avatar size="32">
              <v-img
                src="https://cdn.vuetifyjs.com/images/john.jpg"
                alt="User"
              ></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in userMenuItems"
            :key="index"
            :value="index"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <!-- Drawer content -->
    </v-navigation-drawer>

    <v-main>
      <!-- Rest of your app content -->
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(false);
const manageItems = ref([
  { title: "Manage Item 1" },
  { title: "Manage Item 2" },
  { title: "Manage Item 3" },
]);
const userMenuItems = ref([
  { title: "Profile" },
  { title: "Settings" },
  { title: "Logout" },
]);
</script>

<style scoped>
.v-btn {
  text-transform: none;
}

/* Thêm padding-top cho v-main để tránh nội dung bị che bởi fixed app bar */
:deep(.v-main) {
  padding-top: 64px; /* Điều chỉnh giá trị này tùy thuộc vào chiều cao của app bar */
}

.image-logo {
  object-fit: cover;
  width: 3rem;
  height: 3rem;
}
</style>
