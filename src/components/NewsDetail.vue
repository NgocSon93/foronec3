<template>
  <v-container v-if="news">
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
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const news = ref(null);
    const error = ref(null);

    const fetchNews = async (newsId) => {
      try {
        const response = await fetch(`http://localhost:3001/news/${newsId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched news data:", data);
        return data;
      } catch (e) {
        console.error("Error fetching news:", e);
        throw e;
      }
    };

    onMounted(async () => {
      try {
        const newsId = route.params.id;
        news.value = await fetchNews(newsId);
      } catch (e) {
        error.value = "Không thể tải bài viết. Vui lòng thử lại sau.";
      }
    });

    return { news, error };
  },
};
</script>

<style scoped>
/* Thêm các style cần thiết ở đây */
</style>
