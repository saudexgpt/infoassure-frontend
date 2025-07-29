<template>
  <el-card>
    <template v-slot:header>
      <div>
        <span class="pull-right">
          <el-button
            v-if="viewType !== 'tabular'"
            variant="primary"
            @click="((viewType = 'tabular'), (showMenu = false))"
            ><i class="el-icon-menu"></i> Tabular View</el-button
          >
        </span>
        <h3>Statement of Applicability</h3>
      </div>
    </template>
    <el-container
      v-loading="loading"
      element-loading-text="loading, please wait..."
      style="height: 100%; border: 1px solid #eee; background: #fff"
    >
      <el-aside v-if="showMenu" width="350px">
        <el-menu
          style="max-height: 850px; overflow: auto"
          background-color="#fcfcfc"
          text-color="#00000"
        >
          <el-submenu v-for="(soa, index) in soas" :key="index" :index="`${index}`">
            <template v-slot:title>
              <strong>{{ soa.name }}</strong>
            </template>
            <el-menu-item
              v-for="(control, control_index) in soa.controls"
              :key="control_index"
              :index="`${index}-${control_index}`"
              @click="viewDetails(control)"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="control.name"
                placement="right-start"
                :open-delay="500"
              >
                <span v-if="control.name.length > 42">
                  {{ control.name.substring(0, 42) }}...
                </span>
                <span v-else>
                  {{ control.name }}
                </span>
              </el-tooltip>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <h1>
          <el-tooltip effect="dark" content="Toggle Menu" placement="right">
            <a v-if="showMenu" style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-fold"></i
            ></a>
            <a v-else style="cursor: pointer" @click="toggleMenu"
              ><i class="el-icon-s-unfold"></i
            ></a>
          </el-tooltip>
        </h1>
        <el-main>
          <div v-if="viewType === 'edit'">
            <edit-s-o-a
              :selected-client="selectedClient"
              :selected-data="selectedData"
              @updated="renderViewAgain"
            />
          </div>
          <div v-if="viewType === 'tabular'">
            <tabular-view :selected-client="selectedClient" :standard-id="standardId" />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import TabularView from './TabularView.vue'
import EditSOA from './partials/EditSOA.vue'

export default {
  components: {
    TabularView,
    EditSOA
  },
  directives: {
    Ripple
  },
  props: {
    selectedClient: {
      type: Object,
      required: true
    },
    standardId: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      loading: false,
      selectedData: null,
      viewType: 'tabular',
      showMenu: true,
      soas: [],
      summary: {
        tabular_presentations: []
      }
    }
  },
  created() {
    this.fetchSOA()
    this.fetchReportSummary()
  },
  methods: {
    checkPermission,
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    viewDetails(data) {
      if (data.id) {
        this.selectedData = data
        this.viewType = 'edit'
        // this.showMenu = false
      }
    },
    fetchSOA(load = true) {
      this.loading = load
      const fetchSOAsResource = new Resource('soa/fetch-soa')
      fetchSOAsResource
        .list({ client_id: this.selectedClient.id, standard_id: this.standardId })
        .then((response) => {
          this.soas = response.soas
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    fetchReportSummary() {
      const param = { client_id: this.selectedClient.id, standard_id: this.standardId }
      const fetchConsultingsResource = new Resource('reports/soa-summary')
      fetchConsultingsResource.list(param).then((response) => {
        this.summary = response
        // this.chart_report.series = response.series
        // this.chart_report.xAxis.categories = response.categories
        // this.chart_report.subtitle.text = response.subtitle
      })
    },
    renderViewAgain() {
      this.viewType = 'tabular'
      this.fetchSOA(false)
      this.fetchReportSummary()
      this.$notify({ title: 'Entry Saved', type: 'success' })
    }
  }
}
</script>
