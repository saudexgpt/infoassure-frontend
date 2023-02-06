<template>
  <b-card
    no-body
    class="card-statistics"
  >
    <b-card-header>
      <b-card-title>My Assignments</b-card-title>
      <b-card-text class="font-small-2 mr-05 mb-0">
        View All
      </b-card-text>
    </b-card-header>
    <b-card-body class="statistics-body">
      <b-row>
        <b-col
          v-for="(assignment, index) in assignments"
          :key="index"
          :xs="12"
          :sm="12"
          :md="8"
          :lg="4"
          :xl="4"
        >
          <b-card
            no-body
            style="background: #f0f0f0;"
          >
            <b-card-body align="center">
              <div class="truncate">
                <h4
                  class="mb-25 font-weight-bolder"
                  :style="'color: ' + assignment.subject_teacher.subject.color_code"
                >
                  {{ assignment.subject_teacher.subject.code }}
                </h4>
              </div>
              <b-avatar
                variant="light-primary"
                size="45"
              >
                <feather-icon
                  size="21"
                  icon="BookIcon"
                />
              </b-avatar>
              <br>
              <small>Deadline: {{ moment(assignment.deadline).format('ll') }}</small>
            </b-card-body>
          </b-card>

        </b-col>
      </b-row>
    </b-card-body>
  </b-card>

</template>

<script>
import {
  BCard,
  BCardHeader,
  BCardTitle,
  BCardBody,
  BCardText,
  BRow,
  BCol,
  BAvatar,
} from 'bootstrap-vue'
import moment from 'moment'
import Resource from '@/api/resource'

const assignmentsResource = new Resource('assignment/student/valid-assignments')

export default {
  components: {
    BCard,
    BCardHeader,
    BCardTitle,
    BCardBody,
    BCardText,
    BRow,
    BCol,
    BAvatar,
  },

  data() {
    return {
      assignments: [],
    }
  },
  created() {
    this.fetchAssignments()
  },
  methods: {
    moment,
    fetchAssignments() {
      const app = this
      app.load = true
      assignmentsResource.list()
        .then(response => {
          app.assignments = response.assignments
          app.load = false
        })
    },
  },
}
</script>
