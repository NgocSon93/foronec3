<template>
  <v-container v-if="news" class="mb-9">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold mb-4">{{ news.title }}</h1>
        <p class="text-subtitle-1 grey--text">
          ĐÃ ĐĂNG TRÊN {{ news.publishDate }} BỞI {{ news.author }}
        </p>
        <v-img :src="news.image" class="my-4" max-height="400" contain></v-img>
        <div
          class="text-subtitle-1 font-weight-bold red--text mb-4"
          v-html="news.summary"
        ></div>
        <div v-html="news.content"></div>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else-if="error">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <p class="text-h6 error--text">{{ error }}</p>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-6 text-center">Tin tức khác</h2>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const news = ref(null);
const error = ref(null);
const newsItems = ref([]);

const fetchNews = async (newsId) => {
  try {
    const response = await axios.get(`http://localhost:3001/news/${1}`);
    console.log("Fetched news data:", response.data);
    return response.data;
  } catch (e) {
    console.error("Error fetching news:", e);
    throw e;
  }
};

const fetchAllNews = async () => {
  try {
    const response = await axios.get("http://localhost:3001/news");
    console.log("Fetched all news:", response.data);
    return response.data;
  } catch (e) {
    console.error("Error fetching all news:", e);
    throw e;
  }
};

onMounted(async () => {
  try {
    const newsId = route.params.id;
    news.value = await fetchNews(newsId);
    newsItems.value = await fetchAllNews();
  } catch (e) {
    error.value = "Không thể tải bài viết. Vui lòng thử lại sau.";
  }
});
</script>

<style scoped>
/* Thêm các style cần thiết ở đây */
</style>
