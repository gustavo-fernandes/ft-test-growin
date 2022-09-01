<template>
  <Header :is_home="true" />
  <div class="container">
    <!-- <Search @search-character="searchCharacter" /> -->
    <Search v-model="searchString" />
    <div class="shadow p-3">
      <div
        class="alert alert-warning"
        role="alert"
        v-show="searchCharacter.length == 0"
      >
        No character found :(
      </div>
      <ul class="list-group" v-show="searchCharacter.length > 0">
        <li
          class="list-group-item"
          v-for="search in searchCharacter"
          :key="search.id"
        >
          <Character :id="search.id" :name="search.name" />
        </li>
      </ul>

      <Pagination
        :totalPages="numberOfPages"
        :perPage="perPage"
        :currentPage="currentPage"
        :maxVisibleButtons="4"
        @pagechanged="onPageChange"
      />
    </div>
  </div>
</template>

<script>
import Header from "@/components//Header.vue";
import Character from "@/components/Character.vue";
import Search from "@/components/Search.vue";
import Pagination from "@/components/Pagination.vue";
import MarvelApi from "@/services/MarvelAPI";

export default {
  name: "HomeView",
  components: {
    Header,
    Character,
    Pagination,
    Search,
  },
  data() {
    return {
      characters: [],
      is_home: 1,
      searchString: "",
      currentPage: 1,
      offset: 0,
      perPage: 20,
      numberOfPages: 0,
    };
  },
  created() {
    this.callApi();
  },
  methods: {
    callApi() {
      MarvelApi.getAllCharacters(this.perPage, this.offset, (characters) => {
        this.characters = characters.data.data.results;
        this.numberOfPages = Math.ceil(
          characters.data.data.total / this.perPage
        );
      });
    },
    onPageChange(page) {
      this.currentPage = page;
      this.offset = (this.currentPage - 1) * this.perPage;
      this.callApi();
    },
  },
  computed: {
    searchCharacter: function () {
      var characters_array = this.characters,
        searchString = this.searchString;
      if (!searchString) {
        return characters_array;
      }

      searchString = searchString.trim().toLowerCase();
      characters_array = characters_array.filter(function (item) {
        if (item.name.toLowerCase().indexOf(searchString) !== -1) {
          return item;
        }
      });
      return characters_array;
    },
  },
};
</script>
