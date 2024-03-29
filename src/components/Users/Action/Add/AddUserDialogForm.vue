<script>
  import UserMainDataForm from "@/components/Users/Shared/Form/UserMainDataForm.vue";
  import { mapActions, mapState } from "pinia";
  import { usersStore } from "@/stores/users";
  import UserAddressResidenceDataForm from "@/components/Users/Shared/Form/UserAddressResidenceDataForm.vue";
  import UserAddressDeliveryDataForm from "@/components/Users/Shared/Form/UserAddressDeliveryDataForm.vue";

  export default {
    components: {
      UserAddressDeliveryDataForm,
      UserMainDataForm,
      UserAddressResidenceDataForm,
    },
    props: {
      filterUsers: Function,
    },
    computed: {
      ...mapState(usersStore, ['getToken']),
      ...mapState(usersStore, ['isAdmin']),
      ...mapState(usersStore, ['filterOption']),
    },
    data: () => ({
      action: 'addUser',
      panel: [],
      dialog: false,
      userForm: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        bornOn: null,
        roles: [],
        skills: [],
        interests: [],
        active: true,
        deletedAt: null,
        deliveryAddressSameAsResidence: false,
        addresses: {
          residence: {
              street: '',
              postcode: '',
              city: '',
              country: '',
              type: 1,
          },
          delivery: {
            street: '',
            postcode: '',
            city: '',
            country: '',
            type: 2,
          }
        },
        firstNameRules: [
          v => /^[a-ząęćńłóśżźĄĘĆŃŁÓŻŹA-Z]{3,}$/.test(v) || 'First name minimum 3 characters',
        ],
        lastNameRules: [
          v => /^[a-ząęćńłóśżźĄĘĆŃŁÓŻŹA-Z]{3,}$/.test(v) || 'Last name minimum 3 characters',
        ],
        emailRules: [
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid',
        ],
        phoneRules: [
          v => /^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/.test(v) || 'Wrong phone format number',
        ],
        passwordRules: [
          v => !!v || 'Field is required',
        ],
        streetRules: [
          v => !!v || 'Field is required',
        ],
        postcodeRules: [
          v => !!v || 'Field is required',
        ],
        cityRules: [
          v => !!v || 'Field is required',
        ],
        countryRules: [
          v => !!v || 'Field is required',
        ],
      },
    }),
    methods: {
      ...mapActions(usersStore, ['setFilterOption']),
      ...mapActions(usersStore, ['updateUser']),
      ...mapActions(usersStore, ['addUserToDB']),
      submitUserFormData () {
        let addresses = [];

        if (this.userForm.deliveryAddressSameAsResidence) {
          addresses.push(this.userForm.addresses.residence);
          addresses[0].type = 3;
        } else {
          let residence = this.userForm.addresses.residence;
          let delivery = this.userForm.addresses.delivery;

          residence.type = 1;
          delivery.type = 2;
          addresses.push(residence);
          addresses.push(delivery);
        }

        let newUser = {...this.user, ...this.userForm};

        newUser.addresses = addresses;

        const responseAddUserToDB = this.addUserToDB(newUser);
        responseAddUserToDB.then(resolve => {
            this.dialog = false;
            this.setFilterOption(newUser.active ? 'active' : 'inactive');
            this.filterUsers();
            this.$emit('clickedSave', 'success', resolve.data.message, true);
          })
          .catch(error => {
            const errors = error.response.data.errors.map(item => {
              return `${item.message} - ${item.context.field}`;
            });
            this.$emit('clickedSave', 'error', errors.join(', '), true, 10000);
          });
      },
    }
  }
</script>

<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="1024"
    >
      <template v-slot:activator="{ props }">
        <v-btn
            color="success"
            v-bind="props"
            class="float-right"
        >
          add user
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-expansion-panels
              v-model="panel"
              multiple
          >
            <v-divider class="mb-10" />
            <v-expansion-panel>
              <v-expansion-panel-title>User's main data</v-expansion-panel-title>
              <v-expansion-panel-text>
                <UserMainDataForm :user = "userForm" :isAdmin="isAdmin" :action="action" />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>User's residence address data</v-expansion-panel-title>
              <v-expansion-panel-text>
                <UserAddressResidenceDataForm :user = "userForm" />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel v-if="! userForm.deliveryAddressSameAsResidence">
              <v-expansion-panel-title>User's delivery address data</v-expansion-panel-title>
              <v-expansion-panel-text>
                <UserAddressDeliveryDataForm :user = "userForm" />
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
          <v-btn color="success" @click="submitUserFormData()" variant="elevated">
            Save user
            <v-icon icon="mdi-content-save" end></v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>