<script setup>
  import { usersStore } from '@/stores/users.js'
  import { ref } from "vue";

  const emit = defineEmits(["messageAfterSavedNewPassword"]);

  const oldPasswordValue = ref('');
  const oldPasswordVisible = ref(false);
  const newPasswordValue = ref('');
  const newPasswordVisible = ref(false);
  const oldPasswordRules = ref([
      v => !!v || 'Old password is required.',
      () => (newPasswordValue.value !== oldPasswordValue.value) || 'New password cannot be the same as old password.'
  ]);
  const newPasswordRules = ref([
            v => !!v || 'New password is required.',
            v => (v && v.length >= 5) || 'Password must have minimum 5 characters.',
            v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character.',
            v => /(?=.*\d)/.test(v) || 'Must have one number.',
            v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%].',
            () => (newPasswordValue.value !== oldPasswordValue.value) || 'New password cannot be the same as old password.'
          ]
  );

  const userStore = usersStore();
  const loggedUserUUID = userStore.getLoggedUser;
  const changeUserPasswordInDB = userStore.changeUserPasswordInDB;

  const changeUserPassword = () => {
    const responseChangeUserPasswordInDB = changeUserPasswordInDB(loggedUserUUID, {
      uuid: loggedUserUUID,
      oldPassword: oldPasswordValue.value,
      newPassword: newPasswordValue.value
    });
    responseChangeUserPasswordInDB.then(resolve => {
      emit('messageAfterSavedNewPassword', 'success', resolve.data.message, true);
    })
        .catch(error => {
          const errors = error.response.data.errors.map(item => {
            return `${item.message} - ${item.context.field}`;
          });
          emit('messageAfterSavedNewPassword', 'error', errors, true, 3500);
        });
  }

</script>

<template>
  <v-row>
    <v-col cols="4" sm="4">
      <v-text-field
          v-model="oldPasswordValue"
          :type="oldPasswordVisible ? 'password' : 'text'"
          :append-inner-icon="! oldPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="() => (oldPasswordVisible = ! oldPasswordVisible)"
          label="old password*"
          :rules="oldPasswordRules"
      ></v-text-field>
    </v-col>
    <v-col cols="4" sm="4">
      <v-text-field
          ref="oldPass"
          v-model="newPasswordValue"
          :type="newPasswordVisible ? 'password' : 'text'"
          :append-inner-icon="! newPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="() => (newPasswordVisible = ! newPasswordVisible)"
          label="new password*"
          :rules="newPasswordRules"
      ></v-text-field>
    </v-col>
    <v-col cols="4" sm="4">
      <v-btn
          :disabled="! (oldPasswordValue && newPasswordValue) || (oldPasswordValue === newPasswordValue)"
          color="success"
          variant="elevated"
          @click.prevent="changeUserPassword"
      >
        save new password
      </v-btn>
    </v-col>
  </v-row>
</template>