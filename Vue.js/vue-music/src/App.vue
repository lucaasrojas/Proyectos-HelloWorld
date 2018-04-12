<template>
  <div id="app">
    <h1>📻 Vue Musica</h1>
    <hr>

    <search></search> <!-- insertamos el componente search -->

  </div>
    
</template>

<script>
import Search from './components/Search.vue'

export default {
  name: 'app',
  components: { Search }
}
</script>
