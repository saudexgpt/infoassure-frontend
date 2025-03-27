<template>
  <el-row
    :gutter="8"
  >
    <el-col
      v-for="(item, index) in statistics"
      :key="index"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="24"
      :xl="24"
    >
      <el-skeleton
        :loading="load"
        :rows="3"
        animated
      />
      <b-card
        v-if="item.show"
        style="border-top-left-radius: 1rem; border-bottom-right-radius: 1rem"
      >
        <b-card-body class="d-flex justify-content-between align-items-center">
          <b-avatar
            :variant="`light-${item.color}`"
            size="50"
          >
            <feather-icon
              size="20"
              :icon="item.icon"
            />
          </b-avatar>
          <div class="truncate">
            <h2
              class="mb-25 font-weight-bolder"
            >
              {{ item.statistic }}
            </h2>
            <span>{{ item.label }}</span>
          </div>
        </b-card-body>
        <b-card-footer>
          <strong>
            <span v-if="item.footer">{{ item.title2 }}: {{ item.statistic2 }}</span>
            <span v-else>&nbsp;</span>
          </strong>
        </b-card-footer>
      </b-card>
    </el-col>
  </el-row>
</template>
<script>
import {
  BCard, BCardFooter, BCardBody, BAvatar,
} from 'bootstrap-vue'

import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    BCardFooter,
    BCardBody,
    BAvatar,
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => (null),
    },
    selectedProject: {
      type: Object,
      default: () => (null),
    },
    filterBy: {
      type: Object,
      default: () => ({
        group_by: 'clause_id',
        clause_id: '',
        assignee_id: '',
        date: '',
      }),
    },
  },
  data() {
    return {
      showAnalysis: false,
      statistics: [],
      dashboardData: {},
      evidence: '',
      load: false,
    }
  },
  watch: {
    selectedProject() {
      this.fetchAnalystics()
    },
  },
  mounted() {
    this.fetchAnalystics()
  },
  methods: {
    setData() {
      const app = this
      const data = [
        {
          color: 'success', icon: 'HelpCircleIcon', statistic: app.dashboardData.all_questions, label: 'Questions', title2: 'Responses', statistic2: app.dashboardData.answered_questions, footer: true, show: true,
        },
        {
          color: 'primary', icon: 'UploadIcon', statistic: app.dashboardData.expected_documents, label: 'Expected Documents', title2: 'Uploaded Documents', statistic2: app.dashboardData.uploaded_documents, footer: true, show: app.selectedProject.allow_document_uploads === 1,
        },
        {
          color: 'danger', icon: 'AlertCircleIcon', statistic: app.dashboardData.exceptions, label: 'EXCLUSIONS', show: true,
        },
      ]
      app.statistics = data
    },
    fetchAnalystics() {
      const app = this
      app.load = true
      const param = {
        project_id: app.selectedProject.id,
        client_id: app.selectedClient.id,
        group_by: app.filterBy.group_by,
        clause_id: app.filterBy.clause_id,
        assignee_id: app.filterBy.assignee_id,
        date: app.filterBy.date,
      }
      const dashboardDataResource = new Resource('ndpa/reports/client-project-data-analysis')
      dashboardDataResource.list(param).then(response => {
        app.dashboardData = response
        app.setData()
        app.load = false
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },
  },

}
</script>
