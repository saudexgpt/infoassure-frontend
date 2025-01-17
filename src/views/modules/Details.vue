<!-- eslint-disable vue/html-indent -->
<template>
    <el-container
    class="no-margin"
    style="height: 750px; border: 1px solid #eee"
    >
        <el-aside
            v-if="showMenu"
            width="250px"
        >
            <label>Modules</label>
            <div>
                <el-menu :router="true">
                    <el-submenu
                    v-for="(project, index) in clientActivatedProjects"
                    :key="index"
                    :index="`${index}`"
                    >
                        <template slot="title">
                            <h4><strong>{{ project.available_module.name }}</strong></h4>
                        </template>

                        <el-menu-item
                            :index="`${project.available_module.slug}-dashboard`"
                        >
                            <p>Overview</p>
                        </el-menu-item>
                        <el-menu-item
                            :index="`manage-${project.available_module.slug}`"
                        >
                            <p>Activities</p>
                        </el-menu-item>
                        <el-menu-item
                            :index="`${project.available_module.slug}-report`"
                        >
                            <p>Reports</p>
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
                >
                    <img
                    src="/images/project-icons/assessment.png"
                    width="250"
                    >
                    <h3>Perform your Risk Assessment Here</h3>
                    <span
                    align="center"
                    >
                    <p>Use the Risk Library Navigation to perform your assessment </p>
                    </span>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>

export default {
  components: {
    // CreateRiskAssessment,
  },
  props: {
    module: {
      type: String,
      default: () => ('all'), // this is the general risk assessment
    },
    viewOnly: {
      type: String,
      default: () => 'all',
    },
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
      response: {},
      activatedModules: [],
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    },
  },
  watch: {
    selectedClient() {
      this.viewType = 'welcome'
      this.setMatrix()
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
  },
  methods: {
    toggleMenu() {
      const app = this
      app.showMenu = !app.showMenu
    },
    renderViewAgain() {
      this.viewType = 'tabular'
      this.fetchAllRiskAssessments(false)
      this.$notify({ title: 'Entry Saved', type: 'success' })
    },
  },
}
</script>
