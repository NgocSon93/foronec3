<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { toast } from "vue3-toastify";

const router = useRouter();

const pickupLocation = ref("");
const dropoffLocation = ref("");
const senderName = ref("");
const senderPhone = ref("");
const weight = ref(0);
const recipientName = ref("");
const recipientPhone = ref("");
const note = ref("");

// Thêm biến để kiểm soát hiển thị của date picker
const dateMenu = ref(false);
const rawScheduledDate = ref(null); // Thay vì new Date()
const scheduledDate = computed({
  get: () => {
    if (!rawScheduledDate.value) return "";
    const date = new Date(rawScheduledDate.value);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  },
  set: (value) => {
    rawScheduledDate.value = value;
  },
});

const discountCoupons = ref([]);
const selectedCoupon = ref(null);

const fetchDiscountCoupons = async () => {
  try {
    const response = await axios.get("http://localhost:3001/discountCoupons");
    discountCoupons.value = response.data;
  } catch (error) {
    console.error("Error fetching discount coupons:", error);
  }
};

onMounted(() => {
  fetchCompanyDetails();
  fetchDiscountCoupons();
});

const basePrice = computed(() => {
  const price = weight.value * 30000; // 30,000 VND per kg
  console.log("Calculated base price:", price);
  return price;
});

const discountAmount = computed(() => {
  console.log("Calculating discount, selectedCoupon:", selectedCoupon.value);
  if (!selectedCoupon.value) return 0;

  const coupon = discountCoupons.value.find(
    (c) => c.id === selectedCoupon.value
  );
  console.log("Coupon details:", coupon);

  if (!coupon) return 0;

  if (coupon.discountAmount) {
    return coupon.discountAmount;
  } else if (coupon.discountPercent) {
    const discount = basePrice.value * (coupon.discountPercent / 100);
    return Math.min(discount, coupon.maxDiscount || Infinity);
  }
  return 0;
});

const finalPrice = computed(() => {
  const final = Math.max(basePrice.value - discountAmount.value, 0);
  console.log("Final price:", final);
  return final;
});

const submitShippingForm = async () => {
  try {
    const shippingData = {
      id: Date.now().toString(),
      pickupLocation: pickupLocation.value,
      dropoffLocation: dropoffLocation.value,
      senderName: senderName.value,
      senderPhone: senderPhone.value,
      scheduledDate: scheduledDate.value,
      weight: weight.value,
      recipientName: recipientName.value,
      recipientPhone: recipientPhone.value,
      note: note.value,
      companyId: company.value.id,
      status: "Pending",
      createdAt: new Date().toISOString(),
      company: company.value, // Thêm toàn bộ thông tin công ty
      basePrice: basePrice.value,
      discountCode: selectedCoupon.value ? selectedCoupon.value.code : null,
      discountAmount: discountAmount.value,
      finalPrice: finalPrice.value,
    };

    const response = await axios.post(
      "http://localhost:3001/shippings",
      shippingData
    );
    console.log("Shipping request submitted:", response.data);
    await createNotification(response.data);
    // Hiển thị thông báo thành công
    toast.success("Đặt đơn hàng thành công.");

    setTimeout(() => {
      router.push(`/shipping-confirmation/${response.data.id}`);
    }, 2000);
  } catch (error) {
    console.error("Error submitting shipping request:", error);
    alert("Có lỗi xảy ra khi gửi hàng. Vui lòng thử lại.");
  }
};

// Hàm để reset form sau khi gửi thành công
// const resetForm = () => {
//   pickupLocation.value = "";
//   dropoffLocation.value = "";
//   senderName.value = "";
//   senderPhone.value = "";
//   rawScheduledDate.value = null;
//   weight.value = 0;
//   recipientName.value = "";
//   recipientPhone.value = "";
//   note.value = "";
// };

const createNotification = async (shippingData) => {
  try {
    const newNotification = {
      id: Date.now().toString(),
      title: "Đặt đơn hàng thành công",
      message: `Bạn đã đặt đơn hàng thành công. Mã đơn hàng: ${shippingData.id}`,
      timestamp: new Date().toISOString(),
    };

    // Sử dụng POST để thêm notification mới
    await axios.post("http://localhost:3001/notifications", newNotification);
    store.addNotification(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};
const company = ref(null);
const fetchCompanyDetails = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3001/transportCompanies`
    );
    company.value = response.data[0];
    console.log(company.value);
  } catch (error) {
    console.error("Error fetching company details:", error);
  }
};

fetchCompanyDetails();
</script>
<template>
  <v-container class="my-10">
    <v-row class="mb-5" v-if="company">
      <v-col cols="12" md="12">Thông tin nhà xe:</v-col>
      <v-col cols="12" md="12" class="mb-10">
        <h2 class="text-center">{{ company.name }}</h2>
        <div class="d-flex justify-center border border-primary mt-2">
          <img
            :src="company.image"
            alt="company.name"
            width="200"
            height="200"
          />
        </div>
      </v-col>
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
      <v-col cols="12" md="6">
        <v-text-field
          v-model="company.driverName"
          label="Tên tài xế"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="company.licensePlate"
          label="Biển số xe"
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
    <v-divider class="my-4" />
    <v-form @submit.prevent="submitShippingForm">
      <v-row>
        <v-col cols="12" md="12">
          <v-card-title>Gửi hàng</v-card-title>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="pickupLocation"
            label="Lấy hàng tại"
            placeholder="Bến xe Giáp Bát, Giải Phóng, Giáp Bát, Hoàng Mai, Hà Nội"
            prepend-inner-icon="mdi-map-marker"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="dropoffLocation"
            label="Chọn điểm đến"
            placeholder="Nhập địa chỉ nhận hàng"
            prepend-inner-icon="mdi-map-marker-check"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="senderName"
            label="Tên người gửi"
            prepend-inner-icon="mdi-account"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="senderPhone"
            label="Số điện thoại"
            prepend-inner-icon="mdi-phone"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ props }">
              <v-text-field
                v-model="scheduledDate"
                label="Ngày gửi hàng"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="props"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="rawScheduledDate"
              @update:model-value="dateMenu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="weight"
            label="Khối lượng hàng gi"
            type="number"
            suffix="kg"
            prepend-inner-icon="mdi-weight-kilogram"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="recipientName"
            label="Tên người nhận"
            prepend-inner-icon="mdi-account"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="recipientPhone"
            label="Số điện thoại"
            prepend-inner-icon="mdi-phone"
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
            v-model="basePrice"
            :value="basePrice.toLocaleString()"
            label="Giá gốc"
            readonly
            prepend-inner-icon="mdi-currency-usd"
            suffix="VND"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="discountAmount"
            :value="discountAmount.toLocaleString()"
            label="Giảm giá"
            readonly
            prepend-inner-icon="mdi-minus-circle"
            suffix="VND"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="finalPrice"
            :value="finalPrice.toLocaleString()"
            label="Giá cuối cùng"
            readonly
            prepend-inner-icon="mdi-cash"
            suffix="VND"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea
            v-model="note"
            label="Lưu ý khi giao hàng"
            prepend-inner-icon="mdi-note-text"
          ></v-textarea>
        </v-col>
        <v-card-text class="d-flex justify-center">
          <v-btn color="primary" type="submit">Gửi hàng</v-btn>
        </v-card-text>
      </v-row>
    </v-form>
  </v-container>
</template>

<style scoped>
.v-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
