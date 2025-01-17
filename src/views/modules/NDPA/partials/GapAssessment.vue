<template>
  <div>

    <!-- <div slot="header">
      <span class="pull-right">
        <b-button
          v-if="!showAnalysis"
          variant="outline-success"
          size="sm"
          @click="showAnalysis = true"
        >Show Analysis</b-button>
        <b-button
          v-else
          variant="outline-danger"
          size="sm"
          @click="showAnalysis = false"
        >Hide Analysis</b-button>
      </span>
      <h4>Manage Gap Assessment</h4>
    </div> -->
    <div
      v-if="showAnalysis"
    >
      <el-row
        :gutter="8"
      >
        <el-col
          v-for="(item, index) in statistics"
          :key="index"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
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
                  size="40"
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
    </div>
    <el-card>
      <b-tabs
        variant="danger"
      >
        <b-tab
          title="COMPLIANCE QUESTIONS"
          lazy
        >
          <audit-questions
            :selected-project="selectedProject"
            :is-admin="isAdmin"
            @reloadAnalytics="fetchAnalystics"
          />
        </b-tab>
        <!-- <b-tab
          v-if="selectedProject.allow_document_uploads === 1"
          title="DOCUMENTS"
          lazy
        >
          <documents
            :selected-project="selectedProject"
            :is-admin="isAdmin"
            @reloadAnalytics="fetchAnalystics"
          />
        </b-tab> -->
        <b-tab
          title="EXCLUSIONS"
          lazy
        >
          <exceptions
            :selected-project="selectedProject"
            :is-admin="isAdmin"
            @reloadAnalytics="fetchAnalystics"
          />
        </b-tab>
        <!-- <b-tab
        title="CERTIFICATE"
        lazy
      >
        <certificate
          :selected-project="selectedProject"
          :is-admin="isAdmin"
          @reloadAnalytics="fetchAnalystics"
        />
      </b-tab> -->
        <b-tab
          v-if="isAdmin"
          title="ASSESSMENT REPORTS"
          lazy
        >
          <reports
            :selected-project="selectedProject"
            :is-admin="isAdmin"
            @reloadAnalytics="fetchAnalystics"
          />
        </b-tab>
      </b-tabs>
    </el-card>
  </div>
</template>
<script>
import {
  BCard, BCardFooter, BCardBody, BAvatar, BTabs, BTab,
} from 'bootstrap-vue'
// import Documents from './Documents.vue'
import AuditQuestions from './AuditQuestions.vue'
import Exceptions from './Exceptions.vue'
// import Certificate from './Certificate.vue'
import Reports from './Reports.vue'

import Resource from '@/api/resource'

export default {
  components: {
    BTabs,
    BTab,
    BCard,
    BCardFooter,
    BCardBody,
    BAvatar,
    // BButton,
    // Documents,
    AuditQuestions,
    Exceptions,
    // Certificate,
    Reports,
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => ({}),
    },
    selectedProject: {
      type: Object,
      default: () => ({}),
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      showAnalysis: false,
      statistics: [],
      dashboardData: {},
      evidence: '',
    }
  },
  watch: {
    selectedClient() {
      this.createProjectAnswers()
      this.createProjectUploads()
    },
    selectedProject() {
      this.createProjectAnswers()
      this.createProjectUploads()
    },
  },
  created() {
    this.createProjectAnswers()
    this.createProjectUploads()
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
    createProjectAnswers() {
      const app = this
      const param = {
        project_id: app.selectedProject.id,
        consulting_id: app.selectedProject.consulting_id,
        client_id: app.selectedProject.client_id,
        standard_id: app.selectedProject.standard_id,
      }
      app.loading = true
      const createAnswersResource = new Resource('ndpa/answers/save')
      createAnswersResource.store(param)
        .then(() => {
          app.fetchAnalystics()
        })
    },
    createProjectUploads() {
      const app = this
      const param = {
        project_id: app.selectedProject.id,
        consulting_id: app.selectedProject.consulting_id,
        client_id: app.selectedProject.client_id,
        standard_id: app.selectedProject.standard_id,
      }
      app.loading = true
      const createUploadsResource = new Resource('uploads/save')
      createUploadsResource.store(param)
        .then(() => {
          app.fetchAnalystics()
        })
    },
    fetchAnalystics() {
      const app = this
      const param = {
        project_id: app.selectedProject.id,
        client_id: app.selectedProject.client_id,
      }
      const dashboardDataResource = new Resource('ndpa/reports/client-project-data-analysis')
      dashboardDataResource.list(param).then(response => {
        app.dashboardData = response
        app.setData()
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },
  },

}
</script>
