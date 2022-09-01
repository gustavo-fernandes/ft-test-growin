<template>
  <Header :is_home="false" />
  <div class="container shadow rounded py-2">
    <div class="p-2 bg-light rounded mb-1">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb m-0">
          <li class="breadcrumb-item">
            <router-link to="/">Home</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ character.name }}
          </li>
        </ol>
      </nav>
    </div>

    <div class="alert alert-success my-3" role="alert" v-if="edit_success">
      Success. Well done!
    </div>

    <div class="row p-3">
      <div class="col-md-4 text-center mb-3 mb-md-0">
        <!-- cover -->
        <img
          :src="getImage(character)"
          class="img-fluid img-thumbnail p-2 shadow-sm m-2"
          :alt="character.name"
          v-if="!userImage"
        />
        <img
          v-if="userImage"
          :src="userImage"
          class="img-fluid img-thumbnail p-2 shadow-sm m-2"
          :alt="character.name"
        />
        <button
          class="btn btn-sm btn-outline-dark my-3"
          @click="show_edit_img = !show_edit_img"
        >
          Edit image
        </button>

        <input
          v-if="show_edit_img"
          class="form-control"
          id="formFileSm"
          type="file"
          accept="image/*"
          @change="onFileChange"
        />
      </div>
      <div class="col-md-8">
        <div class="shadow rounded p-3 mb-3">
          <!-- title -->
          <h1
            class="h1 text-danger"
            :title="character.name"
            v-if="!show_edit_name"
          >
            {{ character.name }}
            <button
              class="btn btn-sm btn-outline-dark"
              @click="show_edit_name = !show_edit_name"
            >
              Edit name
            </button>
          </h1>
          <div class="row" v-if="show_edit_name">
            <div class="col-auto">
              <input
                type="text"
                class="form-control"
                v-model="character_name_edit"
              />
            </div>
            <div class="col-auto">
              <button
                class="btn btn-outline-secondary me-3"
                @click="show_edit_name = !show_edit_name"
              >
                Cancel
              </button>
              <button
                class="btn btn-success"
                @click="update('name')"
                :disabled="!character_name_edit.length"
              >
                Save
              </button>
            </div>
          </div>

          <hr class="text-secondary" />
          <!-- description -->
          <p>
            {{
              character.description
                ? character.description
                : "No description available :("
            }}
          </p>
        </div>

        <!-- show related stories, events and series -->
        <RelatedTitle :title="'Stories'" :length="stories_length" />
        <div class="row row-cols-1 row-cols-md-4 g-4">
          <div class="col-6 col-md-3" v-for="item in stories" :key="item.id">
            <Related :title="item.title" :image="getImage(item)" />
          </div>
        </div>
        <hr />

        <RelatedTitle :title="'Events'" :length="events_length" />
        <div class="row row-cols-1 row-cols-md-4 g-4">
          <div class="col-6 col-md-3" v-for="item in events" :key="item.id">
            <Related :title="item.title" :image="getImage(item)" />
          </div>
        </div>
        <hr />

        <RelatedTitle :title="'Series'" :length="series_length" />
        <div class="row row-cols-1 row-cols-md-4 g-4">
          <div class="col-6 col-md-3" v-for="item in series" :key="item.id">
            <Related :title="item.title" :image="getImage(item)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Related from "@/components/Related.vue";
import RelatedTitle from "@/components/RelatedTitle.vue";
import MarvelApi from "@/services/MarvelAPI";

export default {
  name: "CharacterView",
  components: {
    Header,
    Related,
    RelatedTitle,
  },
  data() {
    return {
      show_edit_name: false,
      show_edit_img: false,
      character: [],
      stories: [],
      events: [],
      series: [],
      char_id: null,
      stories_length: 0,
      events_length: 0,
      series_length: 0,
      character_name_edit: "",
      character_image_edit: "",
      edit_success: false,
      local_storage: [],
      userImage: null,
    };
  },
  mounted() {
    this.getAPIData();
  },
  methods: {
    // upload image
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      this.createImage(files[0]);
    },
    createImage(file) {
      var reader = new FileReader();
      var vm = this;

      reader.onload = (e) => {
        vm.userImage = e.target.result;
        this.character_image_edit = vm.userImage;
        this.update("image");
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
      this.userImage = "";
    },
    // get API data
    getAPIData() {
      MarvelApi.getCharacter(this.$route.params.id, (character) => {
        this.character = character.data.data.results[0];
        this.getCharacterInfos(this.$route.params.id, "stories");
        this.getCharacterInfos(this.$route.params.id, "events");
        this.getCharacterInfos(this.$route.params.id, "series");
        this.character_name_edit = this.character.name;
        this.checkStorage();
      });
    },
    // check localstorage client data
    checkStorage() {
      this.char_id = this.$route.params.id;
      this.local_storage = JSON.parse(localStorage.getItem("userData"));

      if (this.local_storage) {
        const storaged = getItemById(this.local_storage, this.char_id);
        if (storaged) {
          this.character.name = storaged.name;
          this.character_name_edit = storaged.name;
          this.userImage = storaged.image;
        }
      }
      function getItemById(data, id) {
        // filter array
        var ret = data.filter(function (item) {
          return item.id === id;
        });
        return ret[0];
      }
    },
    // loads the API image
    getImage(thumb) {
      if (thumb.thumbnail) {
        var newImg;
        newImg = thumb.thumbnail.path + "." + thumb.thumbnail.extension;
        return newImg;
      } else {
        return "/img/No_Image_cover.webp";
      }
    },
    // get stories form API
    getCharacterInfos(id, type) {
      MarvelApi.getCharInfo(id, type, (res) => {
        if (res.data.data.count) var count = res.data.data.count;
        var result = res.data.data.results;
        if (type == "stories") {
          this.stories_length = count;
          this.stories = result;
        }
        if (type == "events") {
          this.events_length = count;
          this.events = result;
        }
        if (type == "series") {
          this.series_length = count;
          this.series = result;
        }
      });
    },
    // update/save user data to localstorage
    update(type) {
      // Parse any JSON previously stored
      var existingEntries = JSON.parse(localStorage.getItem("userData"));
      if (existingEntries == null) existingEntries = [];
      var updated = {
        id: this.char_id,
        name: this.character_name_edit,
        image: this.character_image_edit,
      };
      // update object before storage
      let checObj = existingEntries.find((o, i) => {
        if (o.id === this.char_id) {
          existingEntries[i] = updated;
          return true;
        }
      });

      if (!checObj) existingEntries.push(updated);

      localStorage.setItem("userData", JSON.stringify(existingEntries));
      this.character.name = this.character_name_edit;
      this.edit_success = true;
      if (type == "name") {
        this.show_edit_name = !this.show_edit_name;
      } else {
        this.show_edit_img = !this.show_edit_img;
      }
    },
  },
};
</script>