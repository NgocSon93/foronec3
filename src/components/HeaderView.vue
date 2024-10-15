<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/components/store";
import { storeToRefs } from "pinia";

const router = useRouter();
const store = useStore();
const { notifications } = storeToRefs(store);

watch(notifications, (newVal, oldVal) => {
  console.log(newVal);
  console.log(oldVal);
});
const userMenuItems = ref([{ title: "Logout" }]);
const logout = () => {
  localStorage.removeItem("currentUser");
  router.push("/login");
};

const recentNotifications = computed(() => {
  return notifications.value.slice(0, 5);
});

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

onMounted(() => {
  store.fetchNotifications();
  store.startPolling(); // Start polling for new notifications
});
</script>

<template>
  <v-app-bar app color="#2b2d42" elevation="1" fixed class="py-2">
    <v-app-bar-title class="text-h5 font-weight-bold">
      <div class="d-flex align-center">
        <RouterLink
          class="text-primary ms-2 d-flex align-center text-decoration-none"
          :to="{ name: 'home' }"
        >
          <img src="@/assets/PNG64.png" alt="MunPOD" class="mr-2 image-logo" />
          <span class="text-white text-decoration-none"> 3C</span>
        </RouterLink>
      </div>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <RouterLink :to="{ name: 'home' }">
      <v-btn
        class="mx-2 text-white"
        :class="{ 'v-btn--active': $route.name === 'home' }"
      >
        Trang chủ
      </v-btn>
    </RouterLink>

    <RouterLink :to="{ name: 'book-ticket' }">
      <v-btn
        class="mx-2 text-white"
        :class="{ 'v-btn--active': $route.name === 'book-ticket' }"
      >
        Đặt vé
      </v-btn>
    </RouterLink>
    <RouterLink :to="{ name: 'shipping' }">
      <v-btn
        class="mx-2 text-white"
        :class="{ 'v-btn--active': $route.name === 'shipping' }"
      >
        Gửi hàng
      </v-btn>
    </RouterLink>
    <RouterLink :to="{ name: 'activitys' }">
      <v-btn
        class="mx-2 text-white"
        :class="{ 'v-btn--active': $route.name === 'activitys' }"
      >
        Hoạt động
      </v-btn>
    </RouterLink>
    <RouterLink :to="{ name: 'incentives' }">
      <v-btn
        class="mx-2 text-white"
        :class="{ 'v-btn--active': $route.name === 'incentives' }"
      >
        Khuyến mãi
      </v-btn>
    </RouterLink>
    <RouterLink :to="{ name: 'news' }">
      <v-btn
        class="mx-2 text-white"
        :class="{ 'v-btn--active': $route.name === 'news' }"
      >
        Tin tức
      </v-btn>
    </RouterLink>
    <RouterLink :to="{ name: 'user-profiles' }">
      <v-btn
        class="mx-2 text-white"
        :class="{ 'v-btn--active': $route.name === 'user-profiles' }"
      >
        Người dùng
      </v-btn>
    </RouterLink>
    <v-spacer></v-spacer>

    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <v-badge :content="notifications.length.toString()" color="error">
          <v-btn v-bind="props" icon="mdi-bell"></v-btn>
        </v-badge>
      </template>
      <v-list width="300">
        <v-list-subheader>
          <strong>Thông báo</strong>
        </v-list-subheader>
        <v-list-item
          v-for="notification in recentNotifications"
          :key="notification.id"
          :value="notification.id"
        >
          <v-list-item-title>{{ notification.title }}</v-list-item-title>
          <v-list-item-subtitle>{{
            notification.message
          }}</v-list-item-subtitle>
          <v-list-item-subtitle class="text-caption text-grey">
            {{ formatDate(notification.timestamp) }}
          </v-list-item-subtitle>
        </v-list-item>
        <v-list-item v-if="notifications.length === 0">
          <v-list-item-title>Không có thông báo mới</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon class="ml-2">
          <v-avatar size="32">
            <v-img
              src="https://as1.ftcdn.net/v2/jpg/06/10/67/26/1000_F_610672683_y96qBDBzvFOaJHQs5W3xl2GWq7NpFe6T.jpg"
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
          <v-list-item-title @click="logout" class="text-decoration-none">{{
            item.title
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.v-btn {
  text-transform: none;
}
.v-list-item {
  border-bottom: 1px solid #e0e0e0;
}
.v-list-item:last-child {
  border-bottom: none;
}
:deep(.v-main) {
  padding-top: 64px;
}

.image-logo {
  object-fit: cover;
  width: 3rem;
  height: 3rem;
}

.v-btn--active {
  background-color: rgba(255, 255, 255, 0.2) !important;
  font-weight: bold;
}
</style>
