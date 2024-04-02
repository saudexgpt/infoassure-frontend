<template>
  <div v-if="dashboardData.all_projects.length > 0">
    <div v-if="showManageProject">
      <div slot="header">
        <b-row>
          <b-col
            cols="6"
          >
            <h4>Manage {{ selected_project.standard.name }}</h4>
          </b-col>
          <b-col
            cols="6"
          >
            <span class="pull-right">
              <b-button
                variant="gradient-danger"
                class="btn-icon rounded-circle"
                @click="showManageProject = false"
              >
                <feather-icon
                  icon="ArrowLeftIcon"
                />
              </b-button>
            &nbsp;
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                class="btn-icon rounded-circle"
                @click="reload()"
              >
                <feather-icon
                  icon="RefreshCwIcon"
                />
              </b-button>
            </span>
          </b-col>
          <hr>
        </b-row>
      </div>

      <client-project-details
        :selected-project="selected_project"
      />
    </div>
    <div v-else>
      <div v-if="statistics.length > 0">
        <b-row
          class="match-height"
        >
          <b-col
            :xs="12"
            :sm="4"
            :md="4"
            :lg="4"
            :xl="4"
          >
            <b-card
              v-if="activeUserInfo"
              class="card-congratulation-medal"
            >
              <h3>Hi {{ activeUserInfo.name }},</h3>
              <b-card-text class="font-small-3">
                Welcome 🎉 to your dashboard
              </b-card-text>
              <b-img
                :src="require('@/assets/images/illustration/badge.svg')"
                class="congratulation-medal"
                alt="Medal Pic"
              />
            </b-card>
          </b-col>
          <b-col
            :xs="12"
            :sm="8"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <b-card
              v-if="statistics.length > 0"
              no-body
              class="card-statistics"
            >
              <b-card-header>
                <b-card-title>Statistics</b-card-title>
              </b-card-header>
              <b-card-body class="statistics-body">
                <b-row>
                  <b-col
                    v-for="(item, index) in statistics"
                    :key="index"
                    xl="4"
                    lg="4"
                    md="4"
                    sm="6"
                  >
                    <b-media no-body>
                      <b-media-aside

                        class="mr-2"
                      >
                        <b-avatar
                          size="48"
                          :variant="item.color"
                        >
                          <feather-icon
                            size="24"
                            :icon="item.icon"
                          />
                        </b-avatar>
                      </b-media-aside>
                      <b-media-body class="my-auto">
                        <h4 class="font-weight-bolder mb-0">
                          {{ item.statistic }}
                        </h4>
                        <b-card-text class="font-small-3 mb-0">
                          {{ item.title }}
                        </b-card-text>
                      </b-media-body>
                    </b-media>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
        <b-row class="match-height">
          <b-col :lg="3">
            <b-card>
              <h4>
                My Projects
              </h4>
              <small>Click to manage</small>
              <hr>
              <b-media
                v-for="(active_project, index2) in projects"
                :key="index2"
              >
                <b-media-body
                  class="activatedProject"
                  @click="manageProject(active_project)"
                >
                  {{ active_project.standard.name }}
                </b-media-body>
              </b-media>
            </b-card>
          </b-col>
          <b-col :lg="9">
            <b-card v-loading="load">
              <div>
                <span class="pull-right">
                  <el-select
                    v-model="selectedProject"
                    value-key="id"
                    placeholder="Pick a project"
                    @input="fetchAnalystics()"
                  >
                    <el-option
                      :value="{id: 'all', name: 'All Projects'}"
                      label="All Projects"
                    />
                    <el-option
                      v-for="(project, index) in projects"
                      :key="index"
                      :value="project"
                      :label="project.standard.name"
                    />
                  </el-select>
                </span>
                <h4>{{ (selectedProject.id !== 'all') ? selectedProject.standard.name : selectedProject.name }} Progress Overview</h4>
                <br>
                <br>
              </div>
              <b-row :gutter="10">
                <b-col :lg="6">
                  <b-card>
                    <b-media
                      no-body
                      class="analyticsBox"
                    >
                      <b-media-aside>
                        <b-avatar
                          rounded
                          size="42"
                          variant="success"
                        >
                          <feather-icon
                            size="18"
                            icon="HelpCircleIcon"
                          />
                        </b-avatar>
                      </b-media-aside>
                      <b-media-body>
                        <h6 class="transaction-title">
                          GAP ASSESSMENT
                        </h6>
                        <el-progress
                          :percentage="calculateProgressPercentage(analyticsData.answered_questions, analyticsData.all_questions)"
                          :color="customColorMethod"
                        />
                        <small>{{ analyticsData.answered_questions }} of {{ analyticsData.all_questions }} responses</small>
                      </b-media-body>
                    </b-media>
                    <b-media
                      no-body
                      class="analyticsBox"
                    >
                      <b-media-aside>
                        <b-avatar
                          rounded
                          size="42"
                          variant="primary"
                        >
                          <feather-icon
                            size="18"
                            icon="UploadIcon"
                          />
                        </b-avatar>
                      </b-media-aside>
                      <b-media-body>
                        <h6 class="transaction-title">
                          DOCUMENTS
                        </h6>
                        <el-progress
                          :percentage="calculateProgressPercentage(analyticsData.uploaded_documents, analyticsData.expected_documents)"
                          :color="customColorMethod"
                        />
                        <small>{{ analyticsData.uploaded_documents }} of {{ analyticsData.expected_documents }} uploads</small>
                      </b-media-body>
                    </b-media>
                    <b-media
                      no-body
                      class="analyticsBox"
                    >
                      <b-media-aside>
                        <b-avatar
                          rounded
                          size="42"
                          variant="danger"
                        >
                          <feather-icon
                            size="18"
                            icon="AlertCircleIcon"
                          />
                        </b-avatar>
                      </b-media-aside>
                      <b-media-body>
                        <h6 class="transaction-title">
                          Exclusions
                        </h6>
                        <h3>{{ analyticsData.exceptions }}</h3>
                      </b-media-body>
                    </b-media>
                  </b-card>
                </b-col>
                <b-col :lg="6">
                  <b-card class="text-center mx-0">
                    <el-progress
                      v-if="selectedProject.id !== 'all'"
                      type="dashboard"
                      :percentage="parseInt(selectedProject.progress)"
                      :stroke-width="20"
                      :width="200"
                      :color="customColorMethod"
                    />
                    <el-progress
                      v-else
                      type="dashboard"
                      :percentage="parseInt(analyticsData.project_progress)"
                      :stroke-width="20"
                      :width="200"
                      :color="customColorMethod"
                    />
                    <br>
                    <div style="margin-top: -70px; margin-bottom: 70px">
                      <strong>Completion</strong>
                    </div>
                    <b-row
                      v-if="selectedProject.id !== 'all'"
                      class="text-center mx-0"
                    >
                      <b-col
                        cols="6"
                        class="border-top border-right d-flex align-items-between flex-column py-1"
                      >
                        <b-card-text class="text-muted mb-0">
                          Start Date
                        </b-card-text>
                        <h3 class="font-weight-bolder mb-0">
                          {{ (selectedProject.start_date !== null) ? moment(selectedProject.start_date).format('ll') : 'Not Set' }}
                        </h3>
                      </b-col>

                      <b-col
                        cols="6"
                        class="border-top d-flex align-items-between flex-column py-1"
                      >
                        <b-card-text class="text-muted mb-0">
                          Deadline
                        </b-card-text>
                        <h3 class="font-weight-bolder mb-0">
                          {{ (selectedProject.deadline !== null) ? moment(selectedProject.deadline).format('ll') : 'Not Set' }}
                        </h3>
                      </b-col>
                    </b-row>
                  </b-card>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
  <el-empty
    v-else
  ><h3>Your dashboard is empty. <br>You have no project set up for you</h3></el-empty>
</template>
<script>
import moment from 'moment'
import {
  BCard, BCardHeader, BCardTitle, BCardBody, BAvatar, BRow, BCol, BCardText, BMediaBody, BMedia, BMediaAside, BImg, BButton,
} from 'bootstrap-vue'
import ClientProjectDetails from '@/views/modules/projects/partials/ClientProjectDetails.vue'
import Resource from '@/api/resource'

export default {
  components: {
    ClientProjectDetails,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BAvatar,
    BRow,
    BCol,
    BCardText,
    BMediaBody,
    BMedia,
    BMediaAside,
    BImg,
    BButton,
    // StatisticCardHorizontal,
  },
  props: {
    dashboardData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      statistics: [],
      projects: [],
      selectedProject: '',
      analyticsData: {
        uploaded_documents: 0,
        expected_documents: 0,
        answered_questions: 0,
        all_questions: 0,
        exceptions: 0,
        project_progress: 0,
      },
      selected_project: '',
      showManageProject: false,
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.getters.userData
    },
  },
  mounted() {
    this.setData()
  },
  methods: {
    moment,
    reload() {
      this.showManageProject = false
      setTimeout(() => {
        this.showManageProject = true
      }, 1)
    },
    manageProject(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.selected_project = selectedRow
      app.showManageProject = true
    },
    customColorMethod(percentage) {
      if (percentage <= 30) {
        return '#f56c6c'
      }
      if (percentage < 50) {
        return '#e6a23c'
      }
      if (percentage < 70) {
        return '#19ebfa'
      }
      if (percentage <= 99) {
        return '#6f7ad3'
      }
      return '#5cb87a'
    },
    calculateProgressPercentage(numerator, denominator) {
      if (denominator > 0) {
        // eslint-disable-next-line radix
        return parseInt((numerator / denominator) * 100)
      }

      return 0
    },
    setData() {
      const app = this
      const data = [
        {
          color: 'primary', icon: 'BriefcaseIcon', statistic: app.dashboardData.all_projects_count, title: 'Total Projects',
        },
        {
          color: 'dark', icon: 'RepeatIcon', statistic: app.dashboardData.in_progress, title: 'In Progress',
        },
        {
          color: 'success', icon: 'CheckCircleIcon', statistic: app.dashboardData.completed_projects, title: 'Completed Projects',
        },
      ]
      app.statistics = data
      app.projects = app.dashboardData.all_projects
      // eslint-disable-next-line prefer-destructuring
      app.selectedProject = app.projects[0]
      if (app.projects.length > 0) {
        app.fetchAnalystics()
      }
    },
    fetchAnalystics() {
      const app = this
      const param = {
        project_id: app.selectedProject.id,
      }
      app.load = true
      const dashboardDataResource = new Resource('reports/client-project-data-analysis')
      dashboardDataResource.list(param).then(response => {
        app.analyticsData = response
        app.load = false
      }).catch(error => {
        console.log(error)
        app.load = false
      })
    },
  },
}
</script>
<style scoped>
.analyticsBox {
  border: 2px solid #d0cdf7; padding: 20px; border-radius: 10px; margin-bottom: 10px
}
</style>
