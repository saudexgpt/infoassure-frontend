<template>
  <el-card>
    <template v-slot:header>
      <div>
        <h3>Analytics By Projects</h3>
      </div>
    </template>
    <el-tabs content-class="mt-1">
      <el-tab
        v-for="(project, index) in clientActivatedProjects"
        :key="index"
        :title="project.title"
        lazy
      >
        <div v-if="project.available_module.slug === 'bcms'">
          <BCMSDashboard />
        </div>
        <div v-if="project.available_module.slug === 'isms'">
          <ISMSDashboard />
        </div>
        <div v-if="project.available_module.slug === 'ndpa'">
          <NDPADashboard />
        </div>
        <!-- <div v-if="project.available_module.slug === 'rcsa'">
          <RCSADashboard />
        </div> -->
      </el-tab>
      <!-- <el-tab
        title="ISMS (ISO-27001)"
        lazy
      >
        <i-s-m-s-dashboard />
      </el-tab>
      <el-tab
        title="NDPA"
        lazy
      >
        <n-d-p-a-dashboard />
      </el-tab>
      <el-tab
        title="RCSA"
        lazy
      >
        <r-c-s-a-dashboard />
      </el-tab> -->
    </el-tabs>
  </el-card>
</template>
<script>
import BCMSDashboard from '@/views/modules/BCMS-ISO22301/Dashboard.vue'
import ISMSDashboard from '@/views/modules/ISMS-ISO27001/Dashboard.vue'
import NDPADashboard from '@/views/modules/NDPA/Dashboard.vue'
// import RCSADashboard from '@/views/modules/RCSA/Dashboard.vue'

export default {
  components: {
    BCMSDashboard,
    ISMSDashboard,
    NDPADashboard
    // RCSADashboard
  },
  data() {
    return {
      activatedModules: []
    }
  },
  computed: {
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    }
  },
  watch: {
    clientActivatedProjects() {
      this.setModuleSlug()
    }
  },
  created() {
    this.setModuleSlug()
  },
  methods: {
    setModuleSlug() {
      const moduleSlug = []
      this.clientActivatedProjects.forEach((project) => {
        if (project.available_module) {
          moduleSlug.push(project.available_module.slug)
        }
      })
      this.activatedModules = moduleSlug
    }
  }
}
</script>
