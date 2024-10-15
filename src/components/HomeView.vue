<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "@/components/store";
import { storeToRefs } from "pinia";
import axios from "axios";

const store = useStore();
const { bookings, shippings, notifications } = storeToRefs(store);
const popularRoutes = ref([]);
const slides = ref([
  {
    title: "Easy Booking",
    img: "https://th.bing.com/th/id/OIP.EyPSueQek82xROLtturC_QHaEK?w=331&h=186&c=7&r=0&o=5&pid=1.7",
  },
  {
    title: "Fast Shipping",
    img: "https://th.bing.com/th/id/OIP.mCFPNTUiCdc1fW3K2mmyUwHaGW?w=210&h=180&c=7&r=0&o=5&pid=1.7",
  },
  {
    title: "Customer Satisfaction",
    img: "https://th.bing.com/th/id/OIP.-89hutw46yo5HM1S3Io47gHaEp?w=286&h=180&c=7&r=0&o=5&pid=1.7",
  },
]);

const bookingsCount = computed(() => bookings.value.length);
const shippingsCount = computed(() => shippings.value.length);

const latestBooking = computed(() => {
  if (bookings.value.length > 0) {
    const latest = bookings.value[bookings.value.length - 1];
    return `${latest.passengerName} - ${latest.ticketCode}`;
  }
  return "No bookings yet";
});

const latestShipping = computed(() => {
  if (shippings.value.length > 0) {
    const latest = shippings.value[shippings.value.length - 1];
    return `Order ${latest.id}`;
  }
  return "No shippings yet";
});

const recentNotifications = computed(() => {
  return notifications.value.slice(-5).reverse();
});

onMounted(async () => {
  await store.fetchBookings();
  await store.fetchShippings();
  await store.fetchNotifications();
});
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3001/popularRoutes");
    popularRoutes.value = response.data;
  } catch (error) {
    console.error("Error fetching popular routes:", error);
  }
});

const promotions = ref([
  {
    title: "Thứ 3 hàng tuần - Flash Sale đến 50%",
    image:
      "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/post/images/163/img_card.png?v=154",
  },
  {
    title: "Giảm đến 25% cho khách hàng lần đầu tiên đặt dịch vụ tại C3",
    image:
      "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/post/images/309/img_card.png?v=14",
  },
  {
    title: "Giảm 20% dành cho khách hàng lần đầu đặt dịch vụ của nhà xe tại C3",
    image:
      "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/post/images/161/img_card.png?v=113",
  },
  {
    title: "Ưu đãi bất ngờ khi đặt xe",
    image:
      "https://f1e425bd6cd9ac6.cmccloud.com.vn/cms-tool/post/images/210/img_card.png?v=6",
  },
]);

const newsItems = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3001/news");
    newsItems.value = response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
  }
});
const reviews = ref([
  {
    name: "Chị Tú Ngô",
    title: "YOLA Co-Founder",
    avatar:
      "https://229a2c9fe669f7b.cmccloud.com.vn/images/testimonial-tu-ngo.jpg",
    comment:
      "C3 là ứng dụng đầu tiên tôi nghĩ tới khi cần đặt vé xe. Vì không những C3 có nhiều ưu đãi lớn mà còn có nhiều hãng xe chất lượng, tôi được tùy chọn chỗ yêu thích nên tôi rất hài lòng.",
  },
  {
    name: "Bửu Vĩ Vu",
    title: "Travel tiktoker",
    avatar:
      "https://229a2c9fe669f7b.cmccloud.com.vn/images/testimonial-buuvivu.jpg",
    comment:
      "Tôi thường chọn đặt vé tại C3 mỗi khi du lịch cùng người thân, bạn bè. Bên cạnh việc đặt vé nhanh chóng, thuận tiện, C3 còn có các đợt Flashsale định kỳ lên đến 50%. Săn vé thành công vào các dịp này giúp tôi tiết kiệm đáng kể chi phí đi lại cho mỗi chuyến đi.",
  },
]);

</script>
<template>
  <v-container fluid>
    <h1 class="text-h4 mb-5 text-center">Welcome to C3</h1>

    <!-- Slide Show -->
    <v-carousel
      cycle
      height="600"
      hide-delimiter-background
      show-arrows="hover"
      class="mb-5"
    >
      <v-carousel-item v-for="(slide, i) in slides" :key="i" :src="slide.img">
        <v-sheet height="100%" tile class="d-flex align-center justify-center">
          <img :src="slide.img" alt="slide" class="w-100 h-100" />
        </v-sheet>
      </v-carousel-item>
    </v-carousel>

    <!-- Services Overview -->
  </v-container>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Booking Services</v-card-title>
          <v-card-text>
            <p>Total Bookings: {{ bookingsCount }}</p>
            <p>Latest Booking: {{ latestBooking }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/book-ticket">View Bookings</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Shipping Services</v-card-title>
          <v-card-text>
            <p>Total Shippings: {{ shippingsCount }}</p>
            <p>Latest Shipping: {{ latestShipping }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" to="/shipping">View Shippings</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notifications -->
    <v-card class="mt-5">
      <v-card-title>Recent Notifications</v-card-title>
      <v-list>
        <v-list-item
          v-for="notification in recentNotifications"
          :key="notification.id"
        >
          <v-list-item>
            <v-list-item-title>{{ notification.title }}</v-list-item-title>
            <v-list-item-subtitle>{{
              notification.message
            }}</v-list-item-subtitle>
          </v-list-item>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-6">Tuyến đường phổ biến</h2>
    <v-row>
      <v-col
        v-for="route in popularRoutes"
        :key="route.id"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card class="mx-auto" max-width="344" height="100%">
          <v-img :src="route.image" height="200px" cover></v-img>
          <v-card-title class="text-h6">{{ route.name }}</v-card-title>
          <v-card-text>
            <div class="text-body-2">Từ {{ route.price }}đ</div>
            <div
              v-if="route.oldPrice"
              class="text-caption text-decoration-line-through"
            >
              {{ route.oldPrice }}đ
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              :to="{ name: 'book-ticket', params: { route: route.id } }"
            >
              Đặt vé
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-6">Ưu đãi nổi bật</h2>
    <v-row>
      <v-col
        v-for="(promotion, i) in promotions"
        :key="i"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card class="mx-auto" max-width="344" height="100%">
          <v-img :src="promotion.image" height="200" cover>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-card-title class="text-subtitle-1 font-weight-bold">{{
            promotion.title
          }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-6">Tin tức</h2>
    <v-row>
      <v-col v-for="news in newsItems" :key="news.id" cols="12" sm="6" md="3">
        <v-card
          class="mx-auto"
          max-width="344"
          height="100%"
          :to="{ name: 'news-detail', params: { id: news.id } }"
        >
          <v-img :src="news.image" height="200" cover>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-card-title class="text-subtitle-2 font-weight-bold">{{
            news.title
          }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-6">Khách hàng nói gì về C3</h2>
    <v-row class="fill-height">
      <v-col
        v-for="(review, index) in reviews"
        :key="index"
        cols="12"
        md="6"
        class="d-flex"
      >
        <v-card class="d-flex flex-column" elevation="2">
          <v-row no-gutters class="flex-grow-1">
            <v-col cols="4" sm="3" class="pa-4">
              <v-img
                :src="review.avatar"
                height="100"
                width="100"
                class="rounded-circle"
              ></v-img>
            </v-col>
            <v-col cols="8" sm="9" class="d-flex flex-column">
              <v-card-text class="flex-grow-1">
                <p class="text-body-1">{{ review.comment }}</p>
              </v-card-text>
              <v-card-title class="text-h6 pa-0 text-primary">{{
                review.name
              }}</v-card-title>
              <v-card-subtitle class="pb-4">{{ review.title }}</v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card-title {
  font-size: 1.1rem !important;
}
.v-carousel {
  box-shadow: none;
}

.v-card-subtitle {
  font-size: 0.9rem !important;
}

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
