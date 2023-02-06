<template>
  <div>
    <el-row :gutter="10">
      <el-col
        :xl="16"
        :lg="16"
        :md="16"
        :sm="12"
        :xs="24"
      >
        <assignments />
        <student-routine />
        <br>
        <timeline :title="Timeline" />
      </el-col>

      <el-col
        :lg="8"
        :xl="8"
        :md="8"
        :sm="12"
        :xs="24"
      >
        <!--Class Teacher-->
        <b-card
          v-if="dashboardData.class_teacher !== ''"
          :img-src="require('@/assets/images/banner/banner-19.jpg')"
          img-alt="Profile Cover Photo"
          img-top
          class="card-profile"
        >
          <div class="profile-image-wrapper">
            <div class="profile-image p-0">
              <b-avatar
                size="114"
                variant="light"
                :src="baseServerUrl + 'storage/' + dashboardData.class_teacher.photo"
              />
            </div>
          </div>
          <h3>
            {{ dashboardData.class_teacher.first_name + ' ' + dashboardData.class_teacher.last_name }}
          </h3>
          <h6 class="text-muted">
            {{ dashboardData.class_teacher.email }}
          </h6>
          <b-badge
            class="profile-badge"
            variant="light-primary"
          >
            <h3>Class Teacher</h3>
          </b-badge>
          <hr class="mb-2">
        </b-card>
        <!--Subjects-->
        <b-card>
          <div slot="header">
            <h4>My Subjects</h4>
          </div>

          <b-col
            v-for="(subject_teacher, index) in dashboardData.subject_teachers"
            :key="index"
            :xs="6"
          >
            <b-card
              no-body
              style="background: #f3f3f3; padding: 20px"
            >
              <b-card-body class="d-flex justify-content-between align-items-center">
                <div class="truncate">
                  <h4
                    class="mb-25 font-weight-bolder"
                    :style="'color: ' + subject_teacher.subject.color_code"
                  >
                    {{ subject_teacher.subject.code }}
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
              </b-card-body>
            </b-card>

          </b-col>
        </b-card>

        <!-- <b-card>
          <div slot="header">
            <h4>My Subjects</h4>
          </div>

          <v-client-table
            v-model="subject_teachers"
            :columns="columns"
            :options="options"
          >
            <div
              slot="sn"
              slot-scope="props"
            >
              {{ props.index }}
            </div>
          </v-client-table>
        </b-card> -->

      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  BCard,
  BCardBody,
  BCol,
  BBadge,
  BAvatar,
} from 'bootstrap-vue'
import StudentRoutine from '@/views/modules/time-table/StudentRoutine.vue'
import Timeline from '@/views/modules/Notifications.vue'
import Assignments from './Assignments.vue'

export default {
  components: {
    BCard,
    BCardBody,
    BCol,
    BAvatar,
    BBadge,
    StudentRoutine,
    Timeline,
    Assignments,
  },
  props: { dashboardData: { type: Object, default: () => (null) } },

  data() {
    return {
      role: 'student',

      student: '',
      subject_teachers: [],
      total_in_class: 0,
      current_class: '',
      class_teacher: '',
      series: [
        {
          name: 'Performance',
          data: [],
        },
      ],
      average_performance: 0,
      columns: ['sn', 'subject.name'],

      options: {
        headings: {
          'subject.name': 'Subject',
          sn: '#',
        },
        sortable: ['id', 'subject.name'],
        // filterable: false,
        filterable: ['id', 'subject.name'],
      },
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  methods: {
  },
}
</script>
