<!-- eslint-disable vue/html-indent -->
<template>
    <el-container
    class="no-margin"
    style="min-height: 650px; border: 1px solid #eee"
    >
        <el-aside
            v-if="showMenu"
            width="250px"
            style="padding: 0 !important"
        >
            <label style="margin-left: 10px !important">Modules</label>
            <div>
                <el-menu>
                    <el-submenu
                    v-for="(availableModule, index) in availableModules"
                    :key="index"
                    :index="`${index}`"
                    >
                        <template slot="title">
                            <h4><strong>{{ availableModule.title }}</strong></h4>
                        </template>

                        <el-menu-item
                            v-for="(moduleSubMenu, sub_index) in availableModule.children"
                            :key="sub_index"
                            @click="setView(moduleSubMenu.moduleName, moduleSubMenu.view)"
                        >
                            <p>{{ moduleSubMenu.title }}</p>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </el-aside>

        <el-container>
            <!-- <h1>
            <el-tooltip
                effect="dark"
                content="Toggle Menu"
                placement="right"
            >
                <a
                v-if="showMenu"
                style="cursor: pointer"
                @click="toggleMenu"
                ><i class="el-icon-s-fold" /></a>
                <a
                v-else
                style="cursor: pointer"
                @click="toggleMenu"
                ><i class="el-icon-s-unfold" /></a>
            </el-tooltip>
            </h1> -->

            <el-main v-loading="loadView">
                <div
                    v-if="viewType === 'welcome'"
                    align="center"
                    style="margin-top: 100px"
                >
                    <img
                    src="/images/project-icons/soa-large.png"
                    width="250"
                    >
                    <p>We are glad to help you stay compliant</p>
                </div>
                <div v-else>
                    <div v-if="moduleName === 'ndpa'">
                        <n-d-p-a-dashboard v-if="view === 'dashboard'" />
                        <n-d-p-a-manage v-if="view === 'manage'" />
                        <n-d-p-a-report v-if="view === 'report'" />
                    </div>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import NDPADashboard from '@/views/modules/NDPA/Dashboard.vue'
import NDPAManage from '@/views/modules/NDPA/Manage.vue'
import NDPAReport from '@/views/modules/NDPA/Report.vue'

export default {
  components: {
    NDPADashboard, NDPAManage, NDPAReport,
  },
  data() {
    return {
      showMenu: true,
      asset_types: [],
      business_units: [],
      selectedData: null,
      loading: false,
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      isCreateNew: false,
      impacts: [],
      likelihoods: [],
      risk_appetite: null,
      risk_assessments: [],
      loadView: false,
      viewType: 'welcome',
      moduleName: '',
      view: '',
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    availableModules() {
      return this.$store.getters.availableModules
    },
  },
  created() {
    setTimeout(() => {
      this.setDefaultView()
    }, 2000)
  },
  methods: {
    setDefaultView() {
      const app = this
      console.log(app.availableModules.length)
      if (app.availableModules.length > 0) {
        const selectedModule = app.availableModules[0]
        app.setView(selectedModule.slug, 'dashboard')
      }
      const projects = app.availableModules.filter(availableModule => availableModule.slug === 'ndpa')
      app.moduleIsActive = false
      if (projects.length > 0) {
        app.moduleIsActive = true
        app.projects = projects
        // eslint-disable-next-line prefer-destructuring
        app.selectedProject = projects[0]
      }
    },
    setView(moduleName, view) {
      const app = this
      app.viewType = 'moduleViews'
      app.moduleName = moduleName
      app.view = view
    },
    renderViewAgain() {
      this.viewType = 'tabular'
      this.fetchAllRiskAssessments(false)
      this.$notify({ title: 'Entry Saved', type: 'success' })
    },
  },
}
</script>
