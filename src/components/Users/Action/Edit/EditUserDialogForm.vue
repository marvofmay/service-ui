<script>
  import UserMainDataForm from "@/components/Users/Shared/Form/UserMainDataForm.vue";
  import {mapActions, mapState} from 'pinia'
  import { usersStore } from '@/stores/users.js'
  import UserAddressResidenceDataForm from "@/components/Users/Shared/Form/UserAddressResidenceDataForm.vue";
  import UserAddressDeliveryDataForm from "@/components/Users/Shared/Form/UserAddressDeliveryDataForm.vue";

  export default {
    components: {
      UserAddressDeliveryDataForm, UserAddressResidenceDataForm,
      UserMainDataForm,
    },
    props: {
      user: Object,
      filterUsers: Function,
    },
    data: () => ({
      action: 'editUser',
      updateUserErrorMessage: null,
      panel: [],
      dialog: false,
      userForm: {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
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
      ...mapActions(usersStore, ['updateUser']),
      ...mapActions(usersStore, ['updateUserInDB']),
      ...mapActions(usersStore, ['getUserAddressFromDB']),
      getUserAddresses() {
        const responseGetUserAddressesFromDB = this.getUserAddressFromDB(this.user.uuid);

        responseGetUserAddressesFromDB.then(response => {
                const items = response.data.data.map(
                    item => Object.fromEntries(Object.entries(item).filter(
                        ([key]) => key !== 'createdAt' && key !== 'updatedAt' && key !== 'deletedAt' && key !== 'uuid')
                    )
                );

                const residence = items.filter(item => 1 === item.type || 3 === item.type);
                const delivery = items.filter(item => 2 === item.type);

                if (residence[0] !== undefined) {
                  this.userForm.addresses.residence = residence[0];
                }

                if (delivery[0] !== undefined) {
                  this.userForm.addresses.delivery = delivery[0];
                }

                if (3 === residence[0]?.type) {
                  this.userForm.deliveryAddressSameAsResidence = true;
                }

                this.userForm = {
                  ...this.userForm,
                  firstName: this.user.firstName,
                  lastName: this.user.lastName,
                  phone: this.user.phone,
                  email: this.user.email,
                  active: this.user.active,
                  roles: this.user.roles,
                  skills: this.user.skills,
                  interests: this.user.interests
                };
            })
            .catch(error => {
              this.$emit('clickedUpdate', 'error', error, true);
            });
      },
      updateUserData () {
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

        let userToUpdate = {...this.user, ...this.userForm};
        userToUpdate.addresses = addresses;

        const responseUserToUpdate = this.updateUserInDB(userToUpdate);

        responseUserToUpdate.then(resolve => {
              this.dialog = false;
              this.$emit('clickedUpdate', 'success', resolve.data.message, true);
              this.updateUser(userToUpdate)
                  .then(() => {
                    this.users = this.allUsers;
                    this.filterUsers();
                  })
                  .catch(error => {
                    this.$emit('clickedUpdate', 'error', error, true);
                  })
            })
            .catch(error => {
              const errors = error.response.data.errors.map(item => {
                return `${item.message} - ${item.context.field}`;
              });
              this.$emit('clickedUpdate', 'error', errors, true);
            });
      },
    },
  }
</script>

<template>
    <v-dialog
        v-model="dialog"
        persistent
        width="1024"
    >
      <template v-slot:activator="{ props }" >
        <v-btn @click="getUserAddresses()" density="compact" icon="mdi-pencil" v-bind="props" color="warning" class="ml-3"></v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit user profile</span>
          <span v-if="updateUserErrorMessage">
            <v-alert v-for="(error, index) in updateUserErrorMessage" :key="index" type="error">{{ error.message }}</v-alert>
          </span>
        </v-card-title>
        <v-card-text>
          <div>
            <v-expansion-panels
                v-model="panel"
                multiple
            >
              <v-expansion-panel>
                <v-expansion-panel-title>User's main data</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <UserMainDataForm :user = "userForm" :action = "action" />
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
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="error"
              variant=elevated
              @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
              color="success"
              variant="elevated"
              @click="updateUserData()"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
