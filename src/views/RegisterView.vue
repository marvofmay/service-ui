<script>

  import axios from "axios";

  export default {
    data: () => ({
      formSubmit: false,
      form: {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        password: null,
        terms: false,
        firstNameRules: [
          v => /^[a-ząęćńłóśżźĄĘĆŃŁÓŻŹA-Z]{3,}$/.test(v) || 'First name minimum 3 characters'
        ],
        lastNameRules: [
          v => /^[a-ząęćńłóśżźĄĘĆŃŁÓŻŹA-Z]{3,}$/.test(v) || 'Last name minimum 3 characters'
        ],
        emailRules: [
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        phoneRules: [
          v => /^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/.test(v) || 'Wrong phone format number'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 5) || 'Password must have minimum 5 characters',
          v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
          v => /(?=.*\d)/.test(v) || 'Must have one number',
          v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
        ],
        termsRules: [
          v => !! v || 'Terms are required'
        ],
      },
      registerResponseError: false,
      registerResponseMessage: '',
      isRegistered: false,
    }),
    methods: {
      submitRegisterForm () {
        if (! this.formSubmit) {
          return false;
        }
        axios.post('http://users_service/api/users/register', this.form)
            .then(response => {
              this.registerResponseMessage = response.data.data;
              this.registerResponseError = false;
              this.isRegistered = true;
            })
            .catch(error => {
              this.registerResponseMessage = error.response.data.errors;
              this.registerResponseError = true;
              this.isRegistered = false;
            });
      },
    },
  }
</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="text-center">About</v-toolbar-title>
    </v-app-bar>
    <v-container>
      <v-sheet
          v-if="registerResponseMessage !== ''"
          class="mx-auto mt-15"
          max-width="544"
      >
        <v-alert :type="! registerResponseError ? 'success': 'error'">
          {{ registerResponseMessage }}
        </v-alert>
      </v-sheet>
      <v-form
          v-if="! isRegistered"
          v-model="formSubmit"
          @submit.prevent="submitRegisterForm"
          class="mt-15"
      >
        <v-card
            class="mx-auto"
            max-width="344"
            title="User Registration"
        >
          <v-container>
            <v-text-field
                v-model="form.firstName"
                :rules="form.firstNameRules"
                color="primary"
                label="First name"
                variant="underlined"
            ></v-text-field>

            <v-text-field
                v-model="form.lastName"
                :rules="form.lastNameRules"
                color="primary"
                label="Last name"
                variant="underlined"
            ></v-text-field>

            <v-text-field
                v-model="form.email"
                :rules="form.emailRules"
                color="primary"
                label="Email"
                variant="underlined"
            ></v-text-field>

            <v-text-field
                v-model="form.phone"
                :rules="form.phoneRules"
                color="primary"
                label="Phone"
                variant="underlined"
            ></v-text-field>

            <v-text-field
                v-model="form.password"
                :rules="form.passwordRules"
                color="primary"
                label="Password"
                placeholder="Enter your password"
                variant="underlined"
                type="password"
            ></v-text-field>

            <v-checkbox
                v-model="form.terms"
                :rules="form.termsRules"
                color="secondary"
                label="I agree to site terms and conditions"
            ></v-checkbox>
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" :disabled="! formSubmit" type="submit" variant="elevated">
              Send registration form
              <v-icon icon="mdi-email" end></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-container>
  </v-app>
  </template>