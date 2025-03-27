<template>
  <div>
    <el-row>
      <el-col :md="22">
        <p><strong>NDPA</strong> | Overview</p>
      </el-col>
      <el-col :md="2">
        <el-button
          type="text"
          @click="dialogVisible = true"
        >
          Filter By
          <feather-icon
            size="30"
            icon="FilterIcon"
          />
        </el-button>
      </el-col>
    </el-row>
    <el-card v-if="showCharts">
      <div slot="header">
        <h3>Compliance Status</h3>
      </div>
      <div>
        <b-row class="match-height">
          <b-col :md="12">
            <b-row class="match-height">
              <b-col :md="8">
                <el-skeleton
                  :loading="load"
                  :rows="3"
                  animated
                />
                <management-clause
                  v-if="selectedProject !== null"
                  :selected-client="selectedClient"
                  :selected-project="selectedProject"
                  :filter-by="param"
                />
              </b-col>
              <b-col :md="4">
                <el-skeleton
                  :loading="load"
                  :rows="3"
                  animated
                />
                <gap-assessment-summmary
                  v-if="selectedProject !== null"
                  :selected-client="selectedClient"
                  :selected-project="selectedProject"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </el-card>
    <el-card v-if="showCharts">
      <div slot="header">

        <h3>Percentage Completion</h3>
      </div>
      <div>
        <b-row class="match-height">
          <b-col :md="3">
            <gap-assessment-data-analysis
              v-if="selectedProject !== null"
              :selected-client="selectedClient"
              :selected-project="selectedProject"
              :filter-by="param"
            />
          </b-col>
          <b-col :md="9">
            <el-skeleton
              :loading="load"
              :rows="6"
              animated
            />
            <percentage-completion
              v-if="selectedProject !== null"
              :selected-client="selectedClient"
              :selected-project="selectedProject"
              :filter-by="param"
            />
          </b-col>
        </b-row>
      </div>
    </el-card>
    <!-- <el-card>
      <div slot="header">

        <h3>DPIA KPI</h3>
      </div>
      <div>
        <d-p-i-a-data-analysis
          v-if="selectedClient !== null"
          :selected-client="selectedClient"
          module="ndpa"
        />
      </div>
    </el-card> -->
    <el-dialog
      title="Filter By"
      :visible.sync="dialogVisible"
      width="40%"
    >

      <el-row :gutter="20">
        <el-col :md="24">
          <el-radio-group
            v-model="group_by"
            @change="checkIfFieldIsEmpty()"
          >
            <el-radio
              v-for="array in [{label: 'Parts', value: 'clause_id'},{label: 'Sections', value: 'section_id'},{label: 'Assignee', value: 'assignee_id'}]"
              :key="array.value"
              :label="array.value"
              border
            >
              {{ array.label }}
            </el-radio>
          </el-radio-group>
        </el-col>
        <el-col
          v-if="group_by === 'section_id'"
          :md="24"
        >
          <label for="">Select Part</label>
          <el-select
            v-model="clause_id"
            placeholder="Select Part"
            filterable
            style="width: 100%"
            @input="checkIfFieldIsEmpty()"
          >
            <el-option
              v-for="(clause, index) in clauses"
              :key="index"
              :value="clause.id"
              :label="`${clause.name} - ${clause.description}`"
            />
          </el-select>
        </el-col>
        <el-col
          v-if="group_by === 'assignee_id'"
          :md="24"
        >
          <label for="">Select Assignee</label>
          <el-select
            v-model="assignee_id"
            placeholder="Select Assignee"
            filterable
            style="width: 100%;"
            @input="checkIfFieldIsEmpty()"
          >
            <el-option
              v-for="(user, user_index) in clientUsers"
              :key="user_index"
              :value="user.id"
              :label="user.name"
            />
          </el-select>
        </el-col>
      </el-row>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          :disabled="fieldIsEmpty"
          @click="setViewBy(); dialogVisible = false"
        >Fetch</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import GapAssessmentDataAnalysis from './partials/GapAssessmentDataAnalysis.vue'
// import DPIADataAnalysis from './charts/DPIADataAnalysis.vue'
// import DPIADataAnalysis from '@/views/dashboard/others/partials/EnterpriseRiskAssessmentAnalysis.vue'
import GapAssessmentSummmary from './charts/GapAssessmentSummmary.vue'
import ManagementClause from './charts/ManagementClause.vue'
import PercentageCompletion from './charts/PercentageCompletion.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BRow,
    BCol,
    GapAssessmentDataAnalysis,
    // DPIADataAnalysis,
    GapAssessmentSummmary,
    ManagementClause,
    PercentageCompletion,
  },
  data() {
    return {
      title: 'Compliance Status',
      view: 'compliance_status',
      selectedProject: null,
      load: false,
      showCharts: true,
      dialogVisible: false,
      group_by: 'clause_id',
      clauses: [],
      clientUsers: [],
      clause_id: '',
      assignee_id: '',
      param: {
        group_by: 'clause_id',
        clause_id: '',
        assignee_id: '',
        date: '',
      },
      fieldIsEmpty: true,
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
    clientActivatedProjects() {
      this.setModuleSlug()
    },
  },
  mounted() {
    this.setModuleSlug()
    this.fetchClauses()
    this.fetchClientUsers()
    this.checkIfFieldIsEmpty()
  },
  methods: {
    checkIfFieldIsEmpty() {
      const app = this
      app.fieldIsEmpty = false
      if (app.group_by === 'section_id' && app.clause_id === '') {
        app.fieldIsEmpty = true
      } else if (app.group_by === 'assignee_id' && app.assignee_id === '') {
        app.fieldIsEmpty = true
      }
    },
    setViewBy() {
      const app = this
      if (app.group_by === 'clause_id') {
        app.clause_id = ''
      }
      if (app.group_by !== 'assignee_id') {
        app.assignee_id = ''
      }
      app.param.group_by = app.group_by
      app.param.clause_id = app.clause_id
      app.param.assignee_id = app.assignee_id
      app.showCharts = false
      setTimeout(() => {
        app.showCharts = true
      }, 10)
    },
    fetchClauses() {
      const app = this
      const fetchClausesResource = new Resource('ndpa/clauses')
      fetchClausesResource.list(this.query)
        .then(response => {
          app.clauses = response.clauses
        })
    },
    fetchClientUsers() {
      const app = this
      const fetchClausesResource = new Resource('clients/users')
      fetchClausesResource.list(this.query)
        .then(response => {
          app.clientUsers = response.users
        })
    },
    setModuleSlug() {
      const app = this
      let selectedProject = null
      app.load = true
      setTimeout(() => {
        app.clientActivatedProjects.forEach(project => {
          if (project.available_module) {
            if (project.available_module.slug === 'ndpa') {
              selectedProject = project
            }
          }
        })
        app.selectedProject = selectedProject
        app.load = false
      }, 2000)
    },
  },
}
</script>
