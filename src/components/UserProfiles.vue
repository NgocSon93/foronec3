<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const user = ref(null);
const roles = ["normal", "admin"];

onMounted(async () => {
  try {
    // Lấy thông tin người dùng từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser && currentUser.id) {
      // Fetch thông tin chi tiết của người dùng dựa trên ID
      const response = await axios.get(
        `http://localhost:3001/users/${currentUser.id}`
      );
      user.value = response.data;
    } else {
      console.error("Không tìm thấy thông tin người dùng");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
  }
});

const updateProfile = async () => {
  try {
    // Trong thực tế, bạn sẽ gửi dữ liệu đến server ở đây
    // Ví dụ: await axios.put(`/api/users/${user.value.id}`, user.value);
    console.log("Profile updated:", user.value);
    alert("Hồ sơ đã được cập nhật!");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Có lỗi xảy ra khi cập nhật hồ sơ.");
  }
};
const isPasswordVisible = ref(false);
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4">
          <div class="text-center mb-4">
            <v-avatar size="80" color="grey-lighten-3">
              <v-icon size="40" color="grey-darken-2">mdi-account</v-icon>
            </v-avatar>
          </div>

          <v-form v-if="user">
            <v-text-field
              v-model="user.username"
              label="Tên người dùng"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="user.email"
              label="Email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model="user.phone"
              label="Phone"
              prepend-inner-icon="mdi-phone"
              variant="outlined"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              v-model="user.password"
              :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
              placeholder="Password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              required
              class="mb-2"
            ></v-text-field>

            <v-select
              v-model="user.role"
              :items="roles"
              label="Vai trò"
              prepend-inner-icon="mdi-shield-account"
              variant="outlined"
              class="mb-2"
            ></v-select>

            <v-switch
              v-model="user.status"
              label="Trạng thái"
              color="primary"
              class="mb-2"
            ></v-switch>

            <v-btn color="primary" block class="mt-2" @click="updateProfile"
              >Cập nhật hồ sơ</v-btn
            >
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
