<template>

  <el-card>
    <div slot="header">
      <span
        class="pull-right"
      >
        <b-button
          v-if="viewType !== 'tabular'"
          variant="primary"
          @click="viewType='tabular'; showMenu = false"
        ><i class="el-icon-menu" /> Tabular View</b-button>
      </span>
      <h3>Statement of Applicability</h3>
    </div>
    <el-container
      v-loading="loading"
      element-loading-text="loading, please wait..."
      style="height: 100%; border: 1px solid #eee; background: #fff;"
    >
      <el-aside
        v-if="showMenu"
        width="350px"
      >
        <el-menu
          style="max-height: 850px; overflow: auto;"
          background-color="#fcfcfc"
          text-color="#00000"
        >
          <el-submenu
            v-for="(soa, index) in soas"
            :key="index"
            :index="`${index}`"
          >
            <template slot="title">
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
                  {{ control.name.substring(0,42) }}...
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
            <tabular-view
              :selected-client="selectedClient"
              :standard-id="standardId"
            />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-card>
</template>

<script>
import {
  BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import TabularView from './TabularView.vue'
import EditSOA from './partials/EditSOA.vue'

export default {
  components: {
    BButton,
    TabularView,
    EditSOA,
  },
  directives: {
    Ripple,
  },
  props: {
    selectedClient: {
      type: Object,
      required: true,
    },
    standardId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      selectedData: null,
      viewType: 'tabular',
      showMenu: true,
      soas: [],
      summary: {
        tabular_presentations: [],
      },
    }
  },
  created() {
    this.fetchSOA()
    this.fetchReportSummary()
  },
  methods: {
    checkPermission,
    toggleMenu() {
      const app = this
      app.showMenu = !app.showMenu
    },
    viewDetails(data) {
      if (data.id) {
        const app = this
        app.selectedData = data
        app.viewType = 'edit'
        // app.showMenu = false
      }
    },
    fetchSOA(load = true) {
      const app = this
      app.loading = load
      const fetchSOAsResource = new Resource('soa/fetch-soa')
      fetchSOAsResource.list({ client_id: app.selectedClient.id, standard_id: app.standardId })
        .then(response => {
          app.soas = response.soas
          app.loading = false
        }).catch(() => { app.loading = false })
    },
    fetchReportSummary() {
      const app = this
      const param = { client_id: app.selectedClient.id, standard_id: app.standardId }
      const fetchConsultingsResource = new Resource('reports/soa-summary')
      fetchConsultingsResource.list(param)
        .then(response => {
          app.summary = response
          // app.chart_report.series = response.series
          // app.chart_report.xAxis.categories = response.categories
          // app.chart_report.subtitle.text = response.subtitle
        })
    },
    renderViewAgain() {
      this.viewType = 'tabular'
      this.fetchSOA(false)
      this.fetchReportSummary()
      this.$notify({ title: 'Entry Saved', type: 'success' })
    },
  },
}
</script>
