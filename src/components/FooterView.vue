<script setup>
import { ref } from "vue";
const infoItems = ref(["Bảng Giá Xe", "Bảng Giá Xe Máy", "Xe Khách", "Bến Xe"]);
</script>
<template>
  <v-footer class="custom-footer pa-0">
    <v-container>
      <v-row no-gutters>
        <!-- Tin tức xe cộ -->
        <v-col cols="12" sm="4" class="pa-4">
          <h2 class="text-h4 font-weight-bold red--text mb-2">TIN TỨC XE CỘ</h2>
          <p class="subtitle-1 grey--text text--lighten-1">
            XE CỘ - TIN TỨC - VIỆT NAM
          </p>
          <p class="body-2 white--text">
            Tin tức xe cộ Trang tin tức về xe máy, ô tô, bảng giá xe, đánh giá
            xe, luật giao thông, mua bán xe, việc làm lái xe, tâm sự lái xe ở
            Việt Nam.
          </p>
        </v-col>

        <!-- Thông tin -->
        <v-col cols="12" sm="4" class="pa-4">
          <h3 class="text-h6 font-weight-bold white--text mb-4">
            <v-icon color="red" left>mdi-information-outline</v-icon>
            THÔNG TIN
          </h3>
          <div class="color">
            <RouterLink :to="{ name: 'book-ticket' }">
              <p
                class="mx-2 text-black text-decoration-none"
                :class="{ 'v-btn--active': $route.name === 'book-ticket' }"
              >
                Đặt vé
              </p>
            </RouterLink>
            <RouterLink :to="{ name: 'shipping' }">
              <p
                class="mx-2 text-black text-decoration-none"
                :class="{ 'v-btn--active': $route.name === 'shipping' }"
              >
                Gửi hàng
              </p>
            </RouterLink>
            <RouterLink :to="{ name: 'activitys' }">
              <p
                class="mx-2 text-black text-decoration-none"
                :class="{ 'v-btn--active': $route.name === 'activitys' }"
              >
                Hoạt động
              </p>
            </RouterLink>
            <RouterLink :to="{ name: 'incentives' }">
              <p
                class="mx-2 text-black text-decoration-none"
                :class="{ 'v-btn--active': $route.name === 'incentives' }"
              >
                Khuyến mãi
              </p>
            </RouterLink>
            <RouterLink :to="{ name: 'news' }">
              <p
                class="mx-2 text-black text-decoration-none"
                :class="{ 'v-btn--active': $route.name === 'news' }"
              >
                Tin tức
              </p>
            </RouterLink>
          </div>
        </v-col>

        <!-- Liên hệ -->
        <v-col cols="12" sm="4" class="pa-4">
          <h3 class="text-h6 font-weight-bold white--text mb-4">
            <v-icon color="red" left>mdi-phone</v-icon>
            LIÊN HỆ
          </h3>
          <p class="body-2 white--text">
            - Văn phòng giao dịch: Thanh Xuân Trung, Thanh Xuân, Hà Nội. - Trụ
            sở chính: Thanh Xuân, Hà Nội 100000
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.custom-footer,
.color {
  background-color: #dac4c4 !important;
}
.v-list-item {
  min-height: 32px !important;
}
.v-list-item__title {
  font-size: 0.875rem !important;
}
</style>
