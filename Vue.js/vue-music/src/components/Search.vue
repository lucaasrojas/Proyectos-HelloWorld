<template lang="html">  
  <!-- ⚠️ Este div es importante: todos los componentes deben tener un unico elemento principal -->
  <div>
      <a href="#" @click.prevent="reset">X</a>
    <input type="text" v-model="query" v-on:keyup.enter="search">
    <button type="button" v-on:click="search">Search</button>
    <small >{{total}}</small>
    <!--
      <div v-for="(i, index) in results" v-bind:results="i" @change="found">

            {{i.name}} - {{i.popularity}}
       

           
      </div>
    -->
    <ul>
        <artista v-for="i in results" v-bind:artist="i" :key="i.id" @change="found"></artista>
    </ul>
    
    <toaster v-show="showToaster" :message="toasterMessage" @close="toggleToaster"></toaster>
  </div>
</template>

<script>
import spotify from "../services/spotify";
import artista from "../components/Artist";
import toaster from "../components/Toaster";

export default {
  name: "Search",
  data() {
    return {
      query: "",
      results: [],
      total: "",
      showToaster: false,
      toasterMessage: '',
    };
  },
  components: {artista, toaster},
  methods: {
    search() {
      spotify
        .search(this.query, "artist")
        .then(res => {
            this.results = res.artists.items
            console.log(this.results)
            })
            .catch((err = "Something happened, try again later") => {
                this.toggleToaster()
                this.toasterMessage = err || "Something happened, try again later"

            })
        
    },
    reset() {
        
            this.results = [];
            this.query = "";
            this.total = "";
            console.log("RESET");
        
    },
    toggleToaster() {
        if(this.showToaster){
            this.showToaster = false;
        }else{
            this.showToaster = true;
        }
    },
    
  },
  computed: {
      found() {
          
          if(this.results.length > 0){
              this.total = this.results.length + " items found"
          }
        console.log("Total", this.total)
          return this.total
      }
  },
  // Hook LifeCycle
  created() {
        console.log("Created",location.pathname)
        if(location.pathname !== '/'){
            this.query = location.pathname.substring(1);
            console.log("Created2",location.pathname.substring(1))
            
            this.search();
        }
    },
};

</script>