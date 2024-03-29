<template>
  <div>
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
              <span>{{ item.title }}</span>
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

    <b-tabs>
      <b-tab
        title="GAP ASSESSMENT"
        lazy
      >
        <audit-questions
          :selected-project="selectedProject"
          :is-admin="isAdmin"
          @reloadAnalytics="fetchAnalystics"
        />
      </b-tab>
      <b-tab
        v-if="selectedProject.allow_document_uploads === 1"
        title="DOCUMENTS"
        lazy
      >
        <documents
          :selected-project="selectedProject"
          :is-admin="isAdmin"
          @reloadAnalytics="fetchAnalystics"
        />
      </b-tab>
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
      <b-tab
        v-if="assessment_activities_array.includes('risk_assessment')"
        title="RISK ASSESSMENT"
        lazy
      >
        <risk-assessment
          :selected-client="selectedClient"
          :standard-id="selectedProject.standard_id"
        />
      </b-tab>
      <b-tab

        v-if="assessment_activities_array.includes('soa')"
        title="SOA"
        lazy
      >
        <s-o-a
          :selected-client="selectedClient"
          :standard-id="selectedProject.standard_id"
        />
      </b-tab>
      <b-tab
        v-if="isAdmin"
        title="CERTIFICATE"
        lazy
      >
        <certificate
          :selected-project="selectedProject"
          :is-admin="isAdmin"
          @reloadAnalytics="fetchAnalystics"
        />
      </b-tab>
      <b-tab
        v-if="isAdmin"
        title="REPORTS"
        lazy
      >
        <reports
          :selected-project="selectedProject"
          :is-admin="isAdmin"
          @reloadAnalytics="fetchAnalystics"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import {
  BTabs, BTab, BCard, BCardFooter, BCardBody, BAvatar,
} from 'bootstrap-vue'
import Documents from './Documents.vue'
import AuditQuestions from './AuditQuestions.vue'
import Exceptions from './Exceptions.vue'
import Certificate from './Certificate.vue'
import Reports from './Reports.vue'
import RiskAssessment from '@/views/modules/risk-assessment/AssessRisks.vue'
import SOA from '@/views/modules/statement-of-applicability/StatementOfApplicability.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BTabs,
    BTab,
    BCard,
    BCardFooter,
    BCardBody,
    BAvatar,
    Documents,
    AuditQuestions,
    Exceptions,
    Certificate,
    Reports,
    RiskAssessment,
    SOA,
  },
  props: {
    selectedClient: {
      type: Object,
      required: true,
    },
    selectedProject: {
      type: Object,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      statistics: [],
      dashboardData: {},
      evidence: '',
      assessment_activities_array: [],
    }
  },
  created() {
    this.setAssessmentActivities()
    this.createProjectAnswers()
    this.createProjectUploads()
  },
  methods: {
    setAssessmentActivities() {
      const app = this
      const { standard } = app.selectedProject
      const assessmentActivities = standard.assessment_activities
      app.assessment_activities_array = (assessmentActivities !== null) ? assessmentActivities.split('|') : null
    },
    setData() {
      const app = this
      const data = [
        {
          color: 'success', icon: 'HelpCircleIcon', statistic: app.dashboardData.all_questions, title: 'Gap Assessment', title2: 'Responses', statistic2: app.dashboardData.answered_questions, footer: true,
        },
        {
          color: 'primary', icon: 'UploadIcon', statistic: app.dashboardData.expected_documents, title: 'Expected Documents', title2: 'Uploaded Documents', statistic2: app.dashboardData.uploaded_documents, footer: true,
        },
        {
          color: 'danger', icon: 'AlertCircleIcon', statistic: app.dashboardData.exceptions, title: 'EXCLUSIONS',
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
      const createAnswersResource = new Resource('answers/save')
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
      const createUploadsResource = new Resource('clauses/uploads/save')
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
      const dashboardDataResource = new Resource('reports/client-project-data-analysis')
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
