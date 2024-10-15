<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const transportCompanies = ref([]);
const searchQuery = ref("");
const loading = ref(false);
const error = ref(null);

const fetchTransportCompanies = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(
      "http://localhost:3001/transportCompanies"
    );
    transportCompanies.value = response.data;
  } catch (err) {
    console.error("Error fetching transport companies:", err);
    error.value = "Không thể tải dữ liệu. Vui lòng thử lại sau.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTransportCompanies);

const filteredCompanies = computed(() => {
  if (!searchQuery.value) return transportCompanies.value;
  const query = searchQuery.value.toLowerCase();
  return transportCompanies.value.filter(
    (company) =>
      company.returnRoute.toLowerCase().includes(query) ||
      company.departureRoute.toLowerCase().includes(query) ||
      company.name.toLowerCase().includes(query)
  );
});

const navigateToBooking = (companyId) => {
  router.push({
    name: "book-ticket-detail",
    params: { id: String(companyId) },
  });
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="searchQuery"
          label="Tìm kiếm theo tên nhà xe hoặc tuyến đường"
          prepend-icon="mdi-magnify"
          clearable
          hide-details
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="error">
      <v-col cols="12">
        <v-alert type="error">{{ error }}</v-alert>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        v-for="company in filteredCompanies"
        :key="company.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="mx-auto h-100" elevation="2">
          <v-img
            :src="company.image"
            height="200"
            cover
            class="align-end text-white"
          >
            <v-card-title class="text-h6 font-weight-bold">
              {{ company.name }}
            </v-card-title>
          </v-img>

          <v-card-text>
            <v-list dense>
              <v-list-item prepend-icon="mdi-account">
                <v-list-item-title
                  >Tài xế: {{ company.driverName }}</v-list-item-title
                >
              </v-list-item>
              <v-list-item prepend-icon="mdi-car">
                <v-list-item-title
                  >Biển số: {{ company.licensePlate }}</v-list-item-title
                >
              </v-list-item>
              <v-list-item prepend-icon="mdi-clock-outline">
                <v-list-item-title
                  >Giờ đi: {{ company.departureTime }}</v-list-item-title
                >
                <v-list-item-subtitle
                  >Giờ về: {{ company.arrivalTime }}</v-list-item-subtitle
                >
              </v-list-item>
              <v-list-item prepend-icon="mdi-calendar">
                <v-list-item-title
                  >Ngày đi: {{ company.departureDate }}</v-list-item-title
                >
                <v-list-item-subtitle
                  >Ngày về: {{ company.returnDate }}</v-list-item-subtitle
                >
              </v-list-item>
              <v-list-item prepend-icon="mdi-map-marker">
                <v-list-item-title class="text-wrap"
                  >Chiều đi: {{ company.departureRoute }}</v-list-item-title
                >
              </v-list-item>
              <v-list-item prepend-icon="mdi-map-marker">
                <v-list-item-title class="text-wrap"
                  >Chiều về: {{ company.returnRoute }}</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-card-text class="d-flex justify-center">
            <RouterLink
              :to="{
                name: 'book-ticket-detail',
                params: { id: String(company.id) },
              }"
              class="font-weight-medium product-list-name"
            >
              <V-Btn class="w-100 px-10"> Đặt vé </V-Btn>
            </RouterLink>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.v-list-item-title {
  font-size: 0.9rem;
}
</style>
