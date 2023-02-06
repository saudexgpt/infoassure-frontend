<template>
  <div v-if="wards.length > 0">
    <div class="box">
      <div class="box-header">
        <h3 class="box-title">
          {{ label }} (Click on each to view details)
        </h3>

      </div>
      <div class="box-body">
        <div
          v-for="(ward, index) in wards"
          :key="index"
          class="col-md-3 col-sm-4 col-xs-6"
        >
          <div
            align="center"
            class="thick-border"
          >
            <router-link :to="{name: 'studentDetails', params: {id: ward.student_id}}">
              <img
                :src="baseServerUrl + 'storage/'+ward.student.user.photo"
                width="80"
              >
              <p>{{ ward.student.user.last_name.toUpperCase()+', '+ward.student.user.first_name }}</p>
            </router-link>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import Resource from '@/api/resource'

const myWards = new Resource('guardian/wards')
export default {
  data() {
    return {
      wards: [],
      label: '',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    const app = this
    app.fetchParentWards()
  },
  methods: {
    fetchParentWards() {
      const app = this
      myWards.list()
        .then(response => {
          app.wards = response.wards

          if (response.wards.length === 1) {
            app.label = 'My Ward'
          } else {
            app.label = 'My Wards'
          }
        })
    },
  },
}
</script>
