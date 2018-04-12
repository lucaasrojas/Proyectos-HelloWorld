<template lang="html">
    <div class="artist">
        <p>{{artist.name}} </P>
            <img v-if="artist.images.length" :src="artist.images[2].url">
            <p v-else>🚫</p>
           
      </div>
</template>

<script>
    export default {
        name: 'Artist',
        props: {
            artist: {
                type: Object,
                required: true
            }
        }
    }
</script>