<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useStore } from "@/components/store";

const store = useStore();
const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);
const company = ref(null);
const ticketCount = ref(1);
const passengerName = ref("");
const passengerPhone = ref("");
const destinations = ref("");
const tripType = ref("oneWay");
const error = ref(null);
const success = ref(false);
const loading = ref(false);

const discountCoupons = ref([]);
const selectedCoupon = ref(null);

const fetchCompanyDetails = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3001/transportCompanies/${id.value}`
    );
    company.value = response.data;
  } catch (error) {
    console.error("Error fetching company details:", error);
    error.value = "Không thể tải thông tin công ty. Vui lòng thử lại sau.";
  }
};

const fetchDiscountCoupons = async () => {
  try {
    const response = await axios.get("http://localhost:3001/discountCoupons");
    discountCoupons.value = response.data;
  } catch (error) {
    console.error("Error fetching discount coupons:", error);
  }
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([fetchCompanyDetails(), fetchDiscountCoupons()]);
  loading.value = false;

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    passengerName.value = user.username;
    passengerPhone.value = user.phone;
  }
});

const generateTicketCode = () =>
  Math.floor(1000000000 + Math.random() * 9000000000);

const incrementTickets = () => ticketCount.value++;
const decrementTickets = () => {
  if (ticketCount.value > 1) ticketCount.value--;
};

const calculateTotalPrice = computed(() => {
  if (company.value) {
    const basePrice =
      tripType.value === "oneWay"
        ? parseFloat(company.value.priceOneWay.replace(/[.,]/g, ""))
        : parseFloat(company.value.priceRoundTrip.replace(/[.,]/g, ""));
    return basePrice * ticketCount.value;
  }
  return 0;
});

const discountAmount = computed(() => {
  if (!selectedCoupon.value) return 0;
  const coupon = discountCoupons.value.find(
    (c) => c.id === selectedCoupon.value
  );
  if (!coupon) return 0;
  if (coupon.discountAmount) return coupon.discountAmount;
  if (coupon.discountPercent) {
    const discount = calculateTotalPrice.value * (coupon.discountPercent / 100);
    return Math.min(discount, coupon.maxDiscount || Infinity);
  }
  return 0;
});

const finalPrice = computed(() =>
  Math.max(calculateTotalPrice.value - discountAmount.value, 0)
);

const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const formattedTotalPrice = computed(() =>
  formatPrice(calculateTotalPrice.value)
);
console.log(formattedTotalPrice.value);
const formattedDiscountAmount = computed(() =>
  formatPrice(discountAmount.value)
);
const formattedFinalPrice = computed(() => formatPrice(finalPrice.value));

const bookTicket = async () => {
  error.value = null;
  success.value = false;

  if (!passengerName.value || !passengerPhone.value || !destinations.value) {
    error.value = "Vui lòng điền đầy đủ thông tin.";
    return;
  }

  loading.value = true;
  try {
    const bookingData = {
      companyId: id.value,
      ticketCount: ticketCount.value,
      passengerName: passengerName.value,
      passengerPhone: passengerPhone.value,
      totalPrice: calculateTotalPrice.value,
      tripType: tripType.value,
      destinations: destinations.value,
      startPoint: company.value.departureRoute,
      endPoint: destinations.value,
      startDate: company.value.departureDate,
      endDate: company.value.returnDate,
      startTime: company.value.departureTime,
      endTime: company.value.arrivalTime,
      licensePlate: company.value.licensePlate,
      bookingDate: new Date().toISOString(),
      status: "Pending",
      ticketCode: generateTicketCode(),
      discountCode: selectedCoupon.value
        ? discountCoupons.value.find((c) => c.id === selectedCoupon.value).code
        : null,
      discountAmount: discountAmount.value,
      finalPrice: finalPrice.value,
    };

    const response = await axios.post(
      "http://localhost:3001/bookings",
      bookingData
    );
    console.log("Booking successful:", response.data);
    success.value = true;
    await createNotification(response.data);
    setTimeout(() => {
      router.push({ name: "booking-infor", params: { id: response.data.id } });
    }, 2000);
  } catch (error) {
    console.error("Error booking ticket:", error);
    error.value = "Đã xảy ra lỗi khi đặt vé. Vui lòng thử lại sau.";
  } finally {
    loading.value = false;
  }
};

const createNotification = async (bookingData) => {
  try {
    const newNotification = {
      title: "Đặt vé thành công",
      message: `Bạn đã đặt vé thành công cho ${bookingData.passengerName}. Mã đặt vé: ${bookingData.ticketCode}`,
      timestamp: new Date().toISOString(),
    };
    await axios.post("http://localhost:3001/notifications", newNotification);
    store.addNotification(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
</script>

<template>
  <v-container>
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <template v-else-if="company">
      <v-row>
        <v-col cols="12">
          <h2 class="text-center mb-4">Đặt vé {{ company.name }}</h2>
          <v-img :src="company.image" height="200" contain class="mb-4"></v-img>
        </v-col>
      </v-row>

      <v-form @submit.prevent="bookTicket">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="company.departureRoute"
              label="Điểm xuất phát"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="company.returnRoute"
              label="Điểm đến"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="company.departureDate"
              label="Ngày đi"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="company.returnDate"
              label="Ngày về"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="company.departureTime"
              label="Giờ đi"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="company.arrivalTime"
              label="Giờ về"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-row>
          <v-col cols="12" md="6">
            <v-radio-group v-model="tripType" row>
              <v-radio label="Một chiều" value="oneWay"></v-radio>
              <v-radio label="Khứ hồi" value="roundTrip"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-text-field
              v-model="ticketCount"
              label="Số lượng vé"
              readonly
              class="mr-2"
            ></v-text-field>
            <v-btn @click="decrementTickets" icon
              ><v-icon>mdi-minus</v-icon></v-btn
            >
            <span class="mx-2">{{ ticketCount }}</span>
            <v-btn @click="incrementTickets" icon
              ><v-icon>mdi-plus</v-icon></v-btn
            >
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="passengerName"
              label="Họ tên hành khách"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="passengerPhone"
              label="Số điện thoại"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="destinations"
              label="Điểm xuống"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="selectedCoupon"
              :items="discountCoupons"
              item-title="description"
              item-value="id"
              label="Chọn mã giảm giá"
              prepend-inner-icon="mdi-ticket-percent"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formattedTotalPrice"
              :value="formattedTotalPrice"
              label="Giá gốc"
              readonly
              prepend-inner-icon="mdi-currency-usd"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formattedDiscountAmount"
              :value="formattedDiscountAmount"
              label="Giảm giá"
              readonly
              prepend-inner-icon="mdi-minus-circle"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formattedFinalPrice"
              :value="formattedFinalPrice"
              label="Giá cuối cùng"
              readonly
              prepend-inner-icon="mdi-cash"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-alert v-if="error" type="error" dense>{{ error }}</v-alert>
            <v-alert v-if="success" type="success" dense
              >Đặt vé thành công! Đang chuyển hướng...</v-alert
            >
            <v-btn
              type="submit"
              color="primary"
              block
              :loading="loading"
              :disabled="loading"
              >Xác nhận đặt vé</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </template>

    <v-row v-else>
      <v-col cols="12">
        <v-alert type="error" dense>{{
          error || "Không thể tải thông tin. Vui lòng thử lại sau."
        }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-text-field {
  margin-bottom: 10px;
}
</style>
