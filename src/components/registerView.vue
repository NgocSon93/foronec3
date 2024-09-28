<script setup>
import { ref } from "vue";
import { toast } from "vue3-toastify";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const refVForm = ref();

const form = ref({
  username: "",
  email: "",
  password: "",
  role: "normal",
  status: false,
  privacyPolicies: false,
});

const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const checkUserExists = (email) => {
  return api.get(`/users?email=${email}`).then((response) => {
    console.log("Check user response:", response.data);
    return response;
  });
};

const createUser = (userData) => {
  return api.post("/users", userData);
};

const register = () => {
  checkUserExists(form.value.email)
    .then((response) => {
      if (response.data.length > 0) {
        toast.error("User with this email already exists");
      } else {
        createUser({
          username: form.value.username,
          email: form.value.email,
          password: form.value.password,
          role: form.value.role,
          status: true,
        })
          .then((response) => {
            console.log("User created:", response.data);
            toast.success("Registration successful!");
            setTimeout(() => {
              router.push("/login");
            }, 3000);
          })
          .catch((error) => {
            console.error("Registration error:", error);
            toast.error(`Registration failed: ${error.message}`);
          });
      }
    })
    .catch((error) => {
      console.error("Error checking existing user:", error);
      toast.error(`Error checking user: ${error.message}`);
    });
};

const isPasswordVisible = ref(false);

const checkExistingUser = () => {
  const emailToCheck = form.value.email;
  checkUserExists(emailToCheck)
    .then((userData) => {
      if (userData.length > 0) {
        toast.error("User with this email already exists");
      } else {
        // Proceed with registration
        register();
      }
    })
    .catch((error) => {
      console.error("Error checking user:", error);
      toast.error("Error checking existing user");
    });
};

// Thay đổi hàm onSubmit để sử dụng checkExistingUser
const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      console.log("Form is valid");
      checkExistingUser();
    }
  });
};
</script>

<!-- <template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard class="auth-card pa-2 pt-7" max-width="448">
      <VCardItem class="justify-center"> </VCardItem>

      <VCardText class="pt-2">
        <h5 class="text-h5 mb-1">Adventure starts here 🚀</h5>
        <p class="mb-0">Make your app management easy and fun!</p>
      </VCardText>

      <VCardText>
        <VForm ref="refVForm">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="form.username"
                autofocus
                label="Username"
                placeholder="johnDoe"
                :rules="[(v) => !!v || 'Username is required']"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.email"
                label="Email"
                type="email"
                placeholder="johndoe@email.com"
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
              />
            </VCol>
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                placeholder="············"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                :rules="[
                  (v) => !!v || 'Password is required',
                  (v) =>
                    v.length >= 8 || 'Password must be at least 8 characters',
                ]"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <VBtn
                block
                type="button"
                @click="onSubmit"
                class="mt-4"
                color="primary"
              >
                Sign up
              </VBtn>
            </VCol>

            <VCol cols="12" class="text-center text-base">
              <span>Already have an account?</span>
              <RouterLink class="text-primary ms-2" :to="{ name: 'login' }">
                Sign in instead
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>
 -->
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

      <VCol cols="12">
        <VTextField
          v-model="form.username"
          autofocus
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-account-circle-outline"
          variant="outlined"
          required
          label="Username"
          :rules="[(v) => !!v || 'Username is required']"
        />
      </VCol>
      <!-- email -->
      <VCol cols="12">
        <VTextField
          v-model="form.email"
          label="Email"
          density="compact"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          required
          type="email"
          placeholder="johndoe@email.com"
          :rules="[
            (v) => !!v || 'Email is required',
            (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
          ]"
        />
      </VCol>
      <!-- password -->
      <VCol cols="12">
        <VTextField
          v-model="form.password"
          label="Password"
          density="compact"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          required
          placeholder="············"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="
            isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
          "
          :rules="[
            (v) => !!v || 'Password is required',
            (v) => v.length >= 8 || 'Password must be at least 8 characters',
          ]"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
        />

        <VBtn
          block
          type="button"
          @click="onSubmit"
          class="mt-4"
          color="primary"
        >
          Sign up
        </VBtn>
      </VCol>

      <v-card-text class="text-center">
        <RouterLink class="text-primary ms-2" :to="{ name: 'login' }">
          Sign in now <v-icon icon="mdi-chevron-right"></v-icon>
        </RouterLink>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss">
// Comment out or remove the problematic import
// @use "@core/scss/template/pages/page-auth.scss";

// Your other styles here
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
