<template>
  <div class="app-container">
    <my-wards
      v-if="guardian !== null"
      :guardian-id="guardian.id"
      :ward-only="true"
    />
    <events />
  </div>
</template>
<script>
import Events from './components/UpcomingEvents.vue'
import MyWards from '@/views/modules/user/parents/Details.vue'
// import 'fullcalendar/dist/fullcalendar.min.css'

export default {
  components: {
    MyWards,
    Events,
  },

  data() {
    return {
    }
  },
  computed: {
    guardian() {
      return this.$store.getters.userData.guardian
    },
  },
}
</script>
