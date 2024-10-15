<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const discountCoupons = ref([]);

const fetchDiscountCoupons = async () => {
  try {
    const response = await axios.get("http://localhost:3001/discountCoupons");
    discountCoupons.value = response.data;
  } catch (error) {
    console.error("Error fetching discount coupons:", error);
  }
};

onMounted(() => {
  fetchDiscountCoupons();
});

const copyToClipboard = (code) => {
  navigator.clipboard.writeText(code).then(() => {
    alert("Mã giảm giá đã được sao chép!");
  });
};
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">Mã giảm giá</h1>
    <v-row>
      <v-col
        v-for="coupon in discountCoupons"
        :key="coupon.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="mx-auto" max-width="344" outlined>
          <v-card-title class="text-h5 font-weight-bold">
            {{ coupon.description }}
          </v-card-title>
          <v-card-text>
            <p v-if="coupon.minOrder">
              Đơn tối thiểu {{ coupon.minOrder.toLocaleString() }}đ
            </p>
            <p v-if="coupon.discountPercent">
              Giảm {{ coupon.discountPercent }}%
            </p>
            <p v-if="coupon.maxDiscount">
              Tối đa {{ coupon.maxDiscount.toLocaleString() }}đ
            </p>
            <p v-if="coupon.discountAmount">
              Hoàn {{ coupon.discountAmount.toLocaleString() }}đ
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="copyToClipboard(coupon.code)">
              {{ coupon.code }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              outlined
              @click="copyToClipboard(coupon.code)"
            >
              Sao chép
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card {
  transition: all 0.3s;
}

.v-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
