<script>
  export default {
    props: {
      user: Object,
      isAdmin: Boolean,
      action: String,
    },
    data: () => ({
      value: true
    }),
  }
</script>

<template>
  <v-card-text>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field v-model="user.firstName" :rules="user.firstNameRules" label="first name*" ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="user.lastName" :rules="user.lastNameRules" label="last name*" persistent-hint ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field v-model="user.email" :rules="user.emailRules" label="Email*" ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" v-if="isAdmin && action === 'addUser'" >
          <v-text-field
              :type="value ? 'password' : 'text'"
              v-model="user.password"
              :rules="user.passwordRules"
              :append-inner-icon="! value ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="() => (value = !value)"
              label="Password*"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field  v-model="user.phone" :rules="user.phoneRules" label="Phone*"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field type="date" v-model="user.bornOn"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
              v-model="user.roles"
              :items="['ROLE_MODERATOR', 'ROLE_ADMIN']"
              label="Roles*"
              multiple
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select  v-model="user.skills"
              :items="['php', 'js', 'python', 'c#', 'larvel', 'symfony']"
              label="skills"
              multiple
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
              v-model="user.interests"
              :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
              label="Interests"
              multiple
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="4">
          {{ user.active }}
          <v-checkbox
              v-model="user.active"
              label="Is active?"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-container>
    <small>*indicates required field</small>
  </v-card-text>
</template>

<style scoped>

</style>