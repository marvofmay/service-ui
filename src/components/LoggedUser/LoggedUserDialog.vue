<script setup>
  import LoggedUserInfo from './Info/LoggedUserInfo.vue'
  import UploadAvatarForm from "@/components/LoggedUser/Forms/UploadAvatarForm.vue";
  import ChangePasswordForm from "@/components/LoggedUser/Forms/ChangePasswordForm.vue";
  import { watch, ref } from "vue";

  const props = defineProps({
    openLoggedUserDialog: Boolean,
  });

  const dialog = ref(false);

  const emit = defineEmits(["closeDialog"]);

  const snackbar = {
    typeMessage: ref(null),
    textMessage: ref(null),
    showMessage: ref(false),
    timeOut: ref(0),
  }

  const closeDialog = () => {
    emit('closeDialog');
  }

  const showSnackbar = (type, text, show, timeOut = 2000) => {
    snackbar.typeMessage.value = type;
    snackbar.textMessage.value = text;
    snackbar.showMessage.value = show;
    snackbar.timeOut.value = timeOut;
  }

  watch(() => props.openLoggedUserDialog, (newValue) => {
    dialog.value = newValue;
  });

</script>

<template>
  <v-snackbar
      location="top right"
      v-model="snackbar.showMessage.value"
      :timeout="snackbar.timeOut.value"
      :color="snackbar.typeMessage.value"
  >
    <p><strong> {{ snackbar.typeMessage === 'success' ? 'Success :)' : 'Uppss... :(' }}</strong></p>
    <p class="pt-1">{{ snackbar.textMessage }}</p>
    <v-btn dark class="float-right" variant="tonal" @click="snackbar.showMessage.value = false">Close</v-btn>
  </v-snackbar>

  <v-dialog
      v-model="dialog"
      persistent
      width="1024"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Your profile</span>
      </v-card-title>
      <v-card-text>
          <LoggedUserInfo />
          <UploadAvatarForm />
          <ChangePasswordForm @messageAfterSavedNewPassword="showSnackbar" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="error"
            variant="elevated"
            @click="closeDialog"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
