<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const bookings = ref([]);
const shippings = ref([]);
const currentTab = ref(0);

const fetchBookings = async () => {
  try {
    const response = await axios.get("http://localhost:3001/bookings");
    bookings.value = response.data.sort(
      (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate)
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
  }
};

const fetchShippings = async () => {
  try {
    const response = await axios.get("http://localhost:3001/shippings");
    shippings.value = response.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error("Error fetching shippings:", error);
  }
};

onMounted(() => {
  fetchBookings();
  fetchShippings();
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("vi-VN");
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};
</script>

<template>
  <v-container>
    <v-card class="pa-4">
      <h1 class="text-h4 mb-4 font-bold">Lịch sử hoạt động</h1>
      <v-tabs v-model="currentTab">
        <v-tab value="0">Lịch sử đặt vé</v-tab>
        <v-tab value="1">Lịch sử gửi hàng</v-tab>
      </v-tabs>

      <v-window v-model="currentTab">
        <v-window-item value="0">
          <div class="card-container">
            <v-card
              v-for="booking in bookings"
              :key="booking.id"
              class="pa-4 card-large"
              :to="{ name: 'booking-infor', params: { id: booking.id } }"
            >
              <v-card-title class="text-h5">{{
                booking.destinations
              }}</v-card-title>
              <v-card-subtitle class="text-subtitle-1"
                >Mã đặt vé: {{ booking.ticketCode }}</v-card-subtitle
              >
              <v-card-text class="text-body-1">
                <p>
                  <strong>Ngày đặt:</strong>
                  {{ formatDate(booking.bookingDate) }}
                </p>
                <p>
                  <strong>Loại vé:</strong>
                  {{ booking.tripType === "oneWay" ? "Một chiều" : "Khứ hồi" }}
                </p>
                <p><strong>Số lượng vé:</strong> {{ booking.ticketCount }}</p>
                <p>
                  <strong>Tổng tiền:</strong>
                  {{ formatCurrency(booking.totalPrice) }}
                </p>
                <p><strong>Trạng thái:</strong> {{ booking.status }}</p>
              </v-card-text>
            </v-card>
          </div>
        </v-window-item>

        <v-window-item value="1">
          <div class="card-container">
            <v-card
              v-for="shipping in shippings"
              :key="shipping.id"
              class="pa-4 card-large"
              :to="{
                name: 'ShippingConfirmation',
                params: { id: shipping.id },
              }"
            >
              <v-card-title class="text-h5"
                >{{ shipping.pickupLocation }} -
                {{ shipping.dropoffLocation }}</v-card-title
              >
              <v-card-subtitle class="text-subtitle-1"
                >Mã gửi hàng: {{ shipping.id }}</v-card-subtitle
              >
              <v-card-text class="text-body-1">
                <p>
                  <strong>Ngày gửi:</strong>
                  {{ formatDate(shipping.createdAt) }}
                </p>
                <p>
                  <strong>Người gửi:</strong> {{ shipping.senderName }} ({{
                    shipping.senderPhone
                  }})
                </p>
                <p>
                  <strong>Người nhận:</strong> {{ shipping.recipientName }} ({{
                    shipping.recipientPhone
                  }})
                </p>
                <p><strong>Trọng lượng:</strong> {{ shipping.weight }} kg</p>
                <p><strong>Tổng tiền:</strong> {{ shipping.finalPrice }} VNĐ</p>
                <p><strong>Trạng thái:</strong> {{ shipping.status }}</p>
              </v-card-text>
            </v-card>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  margin: 1rem;
}

.card-large {
  width: calc(50% - 10px);
  min-width: 300px;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  font-size: 1.5rem !important;
  font-weight: bold;
}

.v-card-subtitle {
  font-size: 1.1rem !important;
}

.v-card-text {
  font-size: 1rem !important;
}

.v-card-text p {
  margin-bottom: 8px;
}

@media (max-width: 960px) {
  .card-large {
    width: 100%;
  }
}
</style>
