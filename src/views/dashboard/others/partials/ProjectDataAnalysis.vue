<template>
  <el-card>
    <div slot="header">
      <h3>Analytics By Projects</h3>
    </div>
    <b-tabs
      content-class="mt-1"
      pills
    >
      <b-tab
        title="BCMS (ISO-22301)"
        lazy
      >
        <b-c-m-s-dashboard />
      </b-tab>
      <b-tab
        title="ISMS (ISO-27001)"
        lazy
      >
        <i-s-m-s-dashboard />
      </b-tab>
      <b-tab
        title="NDPA"
        lazy
      >
        <n-d-p-a-dashboard />
      </b-tab>
      <b-tab
        title="RCSA"
        lazy
      >
        <r-c-s-a-dashboard />
      </b-tab>
    </b-tabs>
  </el-card>
</template>
<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import BCMSDashboard from '@/views/modules/BCMS-ISO22301/Dashboard.vue'
import ISMSDashboard from '@/views/modules/ISMS-ISO27001/Dashboard.vue'
import NDPADashboard from '@/views/modules/NDPA/Dashboard.vue'
import RCSADashboard from '@/views/modules/RCSA/Dashboard.vue'

export default {
  components: {
    BTabs,
    BTab,
    BCMSDashboard,
    ISMSDashboard,
    NDPADashboard,
    RCSADashboard,
  },
  data() {
    return {
      activatedModules: [],
    }
  },
  computed: {
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    },
  },
  watch: {
    clientActivatedProjects() {
      this.setModuleSlug()
    },
  },
  created() {
    this.setModuleSlug()
  },
  methods: {
    setModuleSlug() {
      const app = this
      const moduleSlug = []
      app.clientActivatedProjects.forEach(project => {
        if (project.available_module) {
          moduleSlug.push(project.available_module.slug)
        }
      })
      app.activatedModules = moduleSlug
    },
  },
}
</script>
