<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { useStore } from "@/components/store";

const store = useStore();
const route = useRoute();
const router = useRouter();
const shipping = ref();

const fetchShippingDetails = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3001/shippings/${route.params.id}`
    );
    shipping.value = response.data;
    if (!shipping.value.company) {
      const companyResponse = await axios.get(
        `http://localhost:3001/transportCompanies/${shipping.value.companyId}`
      );
      shipping.value.company = companyResponse.data;
    }
  } catch (error) {
    console.error("Error fetching shipping details:", error);
  }
};

const goToHome = () => {
  router.push("/home");
};

const cancelOrder = async () => {
  try {
    await axios.delete(`http://localhost:3001/shippings/${route.params.id}`);
    alert("Đơn hàng đã được hủy");
    router.push("/home");
  } catch (error) {
    console.error("Error cancelling order:", error);
    alert("Có lỗi xảy ra khi hủy đơn hàng");
  }
};
onMounted(fetchShippingDetails);
</script>
<template>
  <v-container class="my-10" v-if="shipping">
    <v-card class="mx-auto" max-width="800">
      <!-- Tăng max-width lên 800px -->
      <v-card-title
        class="text-center text-h5 font-weight-bold blue white--text"
      >
        Đặt đơn thành công!
      </v-card-title>
      <v-card-text>
        <h3 class="mb-3">Thông tin đơn hàng</h3>
        <v-row>
          <v-col cols="12" md="6">
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Tên người gửi:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.senderName
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >Số điện thoại người gửi:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    shipping.senderPhone
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nơi gửi:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.pickupLocation
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Giờ gửi:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.company?.departureTime
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Ngày gửi:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.scheduledDate
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Mã đơn hàng:</v-list-item-title>
                  <v-list-item-subtitle>{{ shipping.id }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Lưu ý:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.note
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6">
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Tên người nhận:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.recipientName
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    >Số điện thoại người nhận:</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    shipping.recipientPhone
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nơi nhận:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.dropoffLocation
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Giá gốc:</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      shipping.basePrice.toLocaleString()
                    }}
                    VND</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="shipping.discountAmount">
                <v-list-item-content>
                  <v-list-item-title>Giảm giá:</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      shipping.discountAmount.toLocaleString()
                    }}
                    VND</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Tổng tiền thanh toán:</v-list-item-title>
                  <v-list-item-subtitle
                    >{{
                      shipping.finalPrice.toLocaleString()
                    }}
                    VND</v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Tên nhà xe:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.company?.name
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Tên tài xế:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.company?.driverName
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Biển số xe:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    shipping.company?.licensePlate
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="goToHome">Trang chủ</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" block @click="cancelOrder">Hủy đơn</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
