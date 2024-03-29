<script setup>

const images = [
  'https://www.cdnlogo.com/logos/v/84/vue-js.svg',
  'https://www.cdnlogo.com/logos/v/50/vuetify.svg'
];

</script>

<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="text-center">Home</v-toolbar-title>
    </v-app-bar>
    <v-container class="mt-15">
      <v-row class="d-flex justify-center">
        <v-col
            v-for="(image, index) in images"
            :key="index"
            class="d-flex child-flex"
            cols="4"
        >
          <v-img
              :src="image"
              :lazy-src="image"
              aspect-ratio="1"
              cover
              class="bg-grey-lighten-2"
          >
            <template v-slot:placeholder>
              <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
              >
                <v-progress-circular
                    indeterminate
                    color="grey-lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse non leo sit amet justo euismod maximus.
          Maecenas vehicula ipsum sed rhoncus placerat. Nulla a nulla ac nibh commodo commodo nec eget ex.
          Suspendisse pellentesque convallis lacus fermentum venenatis. Duis quis imperdiet enim. Duis tristique porta
          libero ac posuere. Nullam bibendum ornare magna nec porta. Ut dapibus suscipit diam eu tempor.
          Proin quis fringilla nunc. Praesent gravida, diam ullamcorper tincidunt viverra, sem est euismod magna,
          a lacinia urna est ut ligula. Nam luctus euismod dolor non elementum. Sed ornare nibh sed lacus porttitor,
          eu viverra nunc consectetur. Duis id mauris euismod, egestas augue nec, aliquam arcu.
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
          In eget bibendum nunc. Cras sodales diam dolor. Morbi dignissim ullamcorper congue. Pellentesque ac
          ultricies tortor, in lobortis orci. Sed finibus magna vitae quam bibendum, non dictum nisl auctor.
          Maecenas eget purus ac elit iaculis scelerisque at nec dui. Nam eu mattis elit, at aliquam orci.
          Integer cursus urna congue tellus volutpat faucibus. Quisque pellentesque porta diam consequat mollis.
          Sed viverra turpis lorem, sed euismod lacus rhoncus sit amet. Donec hendrerit nunc maximus,
          imperdiet neque ut, pharetra nunc. Aenean dignissim purus dolor. Maecenas venenatis elementum ex
          in interdum. Etiam vehicula lacus eros, et blandit massa vulputate sed. Mauris velit leo, ultricies
          eu hendrerit eu, lacinia dictum nulla. Sed ut porta risus. Nulla volutpat vulputate leo ac pretium.
          Nam scelerisque leo vel augue vulputate, id tincidunt tortor placerat. Interdum et malesuada fames
          ac ante ipsum primis in faucibus. Duis rhoncus malesuada mi facilisis vehicula. Maecenas imperdiet
          risus diam, vel dapibus dolor dapibus vestibulum. Donec ut placerat sapien, nec ullamcorper mauris.
          Aliquam ac dignissim tortor, at elementum lacus. Nam scelerisque, metus et pellentesque ullamcorper,
          nibh magna rhoncus diam, nec egestas mi nibh nec mi. Mauris ornare velit sed lacus volutpat, vel maximus
          lacus commodo.
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>