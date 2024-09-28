<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const isPasswordVisible = ref(false);

const router = useRouter();

const email = ref("");
const password = ref("");

const signIn = () => {
  axios
    .get(
      `http://localhost:3000/users?email=${email.value}&password=${password.value}`
    )
    .then((response) => {
      if (response.data.length > 0) {
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/home");
        }, 1000);
      } else {
        toast.error("Invalid email or password");
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    });
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

      <v-card class="mb-12" color="surface-variant" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, you account will
          be temporarily locked for three hours. If you must login now, you can
          also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card>

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
