<script>
import { mapState, mapActions } from 'pinia'
import { usersStore } from '@/stores/users.js'

export default {
  data: () => ({
    avatar: null,
    base64: null,
    messageSuccess: null,
    messageError: null,
  }),
  computed: {
    ...mapState(usersStore, ['getLoggedUser']),
  },
  watch: {
    avatar(newVal) {
      if (newVal) {
        this.createBase64Image(newVal);
      } else {
        this.base64 = null;
      }
    },
  },
  methods: {
    ...mapActions(usersStore, ['updateUserAvatarInDB']),
    ...mapActions(usersStore, ['setLoggedUserAvatar']),
    createBase64Image (FileObject) {
      const file = FileObject[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (event) => {
          this.base64 = event.target.result;
        };

        reader.readAsDataURL(file);
      }
    },
    sendAvatar() {
      const uuid = this.getLoggedUser.uuid;
      const payload = {
        uuid: uuid,
        avatar: this.base64
      }

      const responseUpdateUserAvatarInDB = this.updateUserAvatarInDB(uuid, payload);
      responseUpdateUserAvatarInDB.then((response) => {
        this.messageSuccess = response.data.data;
        this.setLoggedUserAvatar(this.base64);
        this.base64 = null;
        this.avatar = null;
        this.messageError = null;
      })
      .catch((error) => {
        this.messageSuccess = null;
        this.messageError = error.response.data.errors;
      });
    },
    clearInput() {
      this.avatar = null;
      this.messageSuccess = null;
      this.messageError = null;
      this.$refs.fileInput.reset();
    },
  },
}
</script>

<template>
    <v-row class="mb-4">
      <v-col cols="12" sm="12">
        <v-img v-if="base64" :src="base64" max-width="200" max-height="200"/>
        <v-alert v-if="messageSuccess" type="success" :text="messageSuccess" class="mt-5"/>
        <v-alert v-if="messageError" type="error" :text="messageError" class="mt-5"/>
      </v-col>
    </v-row>
    <v-row class="mb-4">
      <v-col cols="8" sm="8">
        <v-file-input
            ref="fileInput"
            prepend-icon=""
            append-inner-icon="mdi-camera"
            accept="image/*"
            outlined
            label="Select avatar to change"
            v-model="avatar"
        />
      </v-col>
      <v-col cols="4" sm="4">
        <v-btn
            :disabled="! base64"
            color="success"
            variant="elevated"
            @click.prevent="sendAvatar"
        >
          save avatar
        </v-btn>
      </v-col>
    </v-row>
</template>

<style>

</style>