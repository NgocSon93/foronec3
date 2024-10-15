<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const isPasswordVisible = ref(false);

const router = useRouter();

const email = ref("");
const password = ref("");
const inforUsers = ref([]);
async function getAllUsers() {
  try {
    const response = await axios.get("http://localhost:3001/users");
    console.log("All users:", response.data);
    inforUsers.value = response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
getAllUsers();
const signIn = async () => {
  try {
    const response = await axios.get(
      `http://localhost:3001/users?email=${email.value}&password=${password.value}`
    );
    console.log(response);
    if (response.data && response.data.length > 0) {
      const user = inforUsers.value.find((user) => user.email === email.value);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
      toast.success("Login successful!");
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } else {
      toast.error("Invalid email or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.response) {
      toast.error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      toast.error("No response from server");
    } else {
      toast.error("An error occurred during login");
    }
  }
};

const onSubmit = () => {
  if (email.value && password.value) {
    signIn();
  } else {
    toast.warning("Please fill in all fields");
  }
};
</script>
<template>
  <div>
    <v-img
      class="mx-auto my-6"
      max-width="100"
      src="@/assets/PNG64.png"
    ></v-img>

    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
        v-model="email"
        density="compact"
        placeholder="Email address"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        required
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Password

        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          Forgot login password?</a
        >
      </div>

      <v-text-field
        v-model="password"
        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        density="compact"
        placeholder="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        :type="isPasswordVisible ? 'text' : 'password'"
        :append-inner="isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="isPasswordVisible = !isPasswordVisible"
        required
      ></v-text-field>

      <v-btn
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        @click="onSubmit"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <RouterLink class="text-primary ms-2" :to="{ name: 'register' }">
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </RouterLink>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss">
// @use "@core/scss/template/pages/page-auth.scss";
// Rest of your styles...
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
