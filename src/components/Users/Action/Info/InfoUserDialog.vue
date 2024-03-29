<script>
  import UserMainData from "@/components/Users/Shared/Data/UserMainData.vue";
  import UserAddressResidenceData from "@/components/Users/Shared/Data/UserAddressResidenceData.vue";
  import UserAddressDeliveryData from "@/components/Users/Shared/Data/UserAddressDeliveryData.vue";

  export default {
    components: {
      UserMainData,
      UserAddressResidenceData,
      UserAddressDeliveryData,
    },
    props: {
      user: Object,
    },
    data: () => ({
      dialog: false,
      panel: [0],
    }),
  }
</script>

<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="1024"
    >
      <template v-slot:activator="{ props }" >
        <v-btn density="compact" icon="mdi-information" v-bind="props" color="info"></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Info user profile</span>
        </v-card-title>
        <v-card-text>
            <v-expansion-panels
                v-model="panel"
                multiple
            >
              <v-expansion-panel>
                <v-expansion-panel-title>User's main data</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <UserMainData :user = "user" />
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-title>User's residence address data</v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <UserAddressResidenceData :residence = "user.addresses?.[0]" />
                  </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-title>User's delivery address data</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <UserAddressDeliveryData :delivery = "user.addresses?.[1]" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="error"
              variant="elevated"
              @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
