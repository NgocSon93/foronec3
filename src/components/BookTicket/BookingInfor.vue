<!-- src/components/BookTicket/BookingConfirmation.vue -->

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const booking = ref({});

    onMounted(async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/bookings/${route.params.id}`
        );
        booking.value = response.data;
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    };

    const generateTicketCode = () => {
      return Math.floor(1000000000 + Math.random() * 9000000000);
    };

    const goToHomePage = () => {
      router.push("/home");
    };

    return {
      booking,
      formatCurrency,
      generateTicketCode,
      goToHomePage,
    };
  },
};
</script>
<template>
  <v-container class="booking-confirmation">
    <v-card class="mx-auto" max-width="500">
      <v-card-title class="text-center white--text blue darken-2 py-4">
        Đặt vé thành công!
      </v-card-title>
      <v-card-text>
        <h3 class="mb-4">Thông tin hành trình</h3>
        <v-list dense>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                >Tên hành khách: {{ booking.passengerName }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                >Số điện thoại: {{ booking.passengerPhone }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <span>Điểm đi: {{ booking.startPoint }}</span>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <span>Điểm xuống: {{ booking.endPoint }}</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="d-flex justify-space-between">
              <v-list-item-title
                >Giờ đi: {{ booking.startTime }}</v-list-item-title
              >
              <v-list-item-title class="mr-10"
                >Giờ về: {{ booking.endTime }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content class="d-flex justify-space-between">
              <v-list-item-title
                >Ngày đi: {{ booking.startDate }}</v-list-item-title
              >
              <v-list-item-title class="mr-10"
                >Ngày về: {{ booking.endDate }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title
                >Mã vé: {{ booking.ticketCode }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold"
                >Tổng tiền thanh toán:
                {{ formatCurrency(booking.totalPrice) }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="booking.discountCode">
            <v-list-item-content>
              <v-list-item-title
                >Mã giảm giá: {{ booking.discountCode }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="booking.discountAmount">
            <v-list-item-content>
              <v-list-item-title
                >Giảm giá:
                {{ formatCurrency(booking.discountAmount) }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                Tổng tiền thanh toán: {{ formatCurrency(booking.finalPrice) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="goToHomePage">Trang chủ</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.booking-confirmation {
  padding-top: 2rem;
}
</style>
