<script setup>
  import { ref } from "vue";
  import { usersStore } from '@/stores/users.js'

  const userStore = usersStore();
  const setToken = userStore.setToken;
  const setLogged = userStore.setLogged;
  const setLoggedUser = userStore.setLoggedUser;

  let getLogged = ref(userStore.getLogged);
  let formSubmit =  ref(false);
  let form = ref({
      email: '',
      password: '',
    });

   const emailRules = ref([
      v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
    ]);

    const passwordRules = ref([
      v => !!v || 'New password is required.',
      v => (v && v.length >= 5) || 'Password must have minimum 5 characters.',
      v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character.',
      v => /(?=.*\d)/.test(v) || 'Must have one number.',
      v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%].'
    ]);

    let loginResponseError = ref(false);
    let loginResponseMessage = ref('');

    const onSubmit = () => {
      if (! formSubmit.value) {
        return false;
      }

      const payload = {
        email: form.value.email,
        password: form.value.password
      }

      const responseLoginUserByDB = userStore.loginUserByDB(payload);
      responseLoginUserByDB.then(response => {
        loginResponseMessage.value = 'You have just logged in.';
        loginResponseError.value = false;

        setToken(response.data.token);
        setLogged(true);
        setLoggedUser(response.data.user);

        getLogged.value = userStore.getLogged;

        localStorage.setItem("isUserLoggedToApplication", "true");
        localStorage.setItem("tokenApplication", response.data.token);
        localStorage.setItem("userLoggedInApplication", JSON.stringify(response.data.user));

      })
      .catch(error => {
        loginResponseMessage.value = error.response.data.message;
        loginResponseError.value = true;
      });
    }
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="text-center">Login</v-toolbar-title>
    </v-app-bar>
    <v-container v-if="loginResponseMessage !== ''" class="mt-15">
      <v-alert :type="! loginResponseError ? 'success': 'error'">{{ loginResponseMessage }}</v-alert>
    </v-container>
    <v-container v-if="! getLogged" class="mt-15">
      <v-sheet rounded>
        <v-card class="mx-auto" max-width="344" title="User Login">
          <v-container>
            <v-form
                v-model="formSubmit"
                @submit.prevent="onSubmit"
            >
              <v-text-field
                  v-model="form.email"
                  :rules="emailRules"
                  color="primary"
                  clearable
                  label="Email"
                  variant="underlined"
              ></v-text-field>

              <v-text-field
                  v-model="form.password"
                  :rules="passwordRules"
                  color="primary"
                  clearable
                  label="Password"
                  placeholder="Enter your password"
                  variant="underlined"
                  type="password"
              ></v-text-field>
              <br>
              <v-btn
                  block
                  :disabled="! formSubmit"
                  color="success"
                  size="large"
                  type="submit"
                  variant="elevated"
              >
                Sign In
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-sheet>
    </v-container>
  </v-app>
</template>
