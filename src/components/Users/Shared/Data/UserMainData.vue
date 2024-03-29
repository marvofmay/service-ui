<script>
  export default {
    props: {
      user: Object,
    }
  }
</script>

<template>
  <v-card-text>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <p>name: {{ user.firstName }} {{ user.lastName }}</p>
          <p>email: {{ user.email }}</p>
          <p>phone: {{ user.phone }}</p>
          <p>born: {{ user.bornOn ?? 'no born date' }}</p>
          <p>active: {{ user.active ? 'yes' : 'no' }}</p>
        </v-col>
      </v-row>
    </v-container>
  </v-card-text>
</template>