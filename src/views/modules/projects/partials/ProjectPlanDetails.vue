<template>
  <div v-if="project_phases.length > 0">
    <app-collapse
      v-loading="loading"
      accordion
      type="border"
    >
      <app-collapse-item
        v-for="(project_phase_array, title) in project_phases"
        :key="title"
        :title="title"
      >
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Task</th>
              <th>Responsible</th>
              <th>Resource</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Pending Items</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(project_phase, index) in project_phase_array"
              :key="index"
            >
              <td>{{ project_phase.general_project_plan.task }}</td>
              <td>{{ project_phase.general_project_plan.responsibility.replace("Client", selectedProject.client.name) }}</td>
              <td>{{ project_phase.general_project_plan.resource }}</td>
              <td v-if="isAdmin">
                <select
                  v-model="project_phase.progress"
                  @change="updateFields('progress', $event, project_phase.id)"
                >
                  <option
                    v-for="(count, count_index) in progress"
                    :key="count_index"
                    :label="`${count}%`"
                    :value="count"
                  />
                </select>
              </td>
              <td v-else>
                {{ project_phase.progress }}%
              </td>
              <td v-if="isAdmin">
                <select
                  v-model="project_phase.status"
                  @change="updateFields('status', $event, project_phase.id)"
                >
                  <option
                    v-for="(status, status_index) in statuses"
                    :key="status_index"
                    :label="status"
                    :value="status"
                  />
                </select>
              </td>
              <td v-else>
                {{ project_phase.status }}
              </td>
              <td v-if="isAdmin">
                <textarea
                  v-model="project_phase.pending_items"
                  @blur="updateFields('pending_items', $event, project_phase.id)"
                />
              </td>
              <td v-else>
                {{ project_phase.pending_items }}
              </td>
              <td v-if="isAdmin">
                <textarea
                  v-model="project_phase.risk"
                  @blur="updateFields('risk', $event, project_phase.id)"
                />
              </td>
              <td v-else>
                {{ project_phase.risk }}
              </td>
            </tr>
          </tbody>
        </table>
      </app-collapse-item>
    </app-collapse>
  </div>
  <el-empty
    v-else
  ><h3>Project Plan is yet to be set up</h3></el-empty>
</template>
<script>
import {
} from 'bootstrap-vue'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import Resource from '@/api/resource'

export default {
  components: {
    AppCollapse,
    AppCollapseItem,
  },
  props: {
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
      project_phases: {},
      loading: false,
      showModal: false,
      columns: [
        'general_project_plan.task',
        'general_project_plan.responsibility',
        'general_project_plan.resource',
        'progress',
        'status',
        'pending_items',
        'risk',
      ],
      options: {
        headings: {
          'general_project_plan.project_phase.title': 'Phase',
          'general_project_plan.task': 'Task',
          'general_project_plan.responsibility': 'Responsible',
          'general_project_plan.resource': 'Resource',
        },
        sortable: [],
        // filterable: false,
        filterable: false,
      },
      progress: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      statuses: ['Not Started', 'In Progress', 'Completed'],
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchClientProjectPlan()
  },
  methods: {

    fetchClientProjectPlan() {
      const app = this
      const params = {
        project_id: app.selectedProject.id,
        client_id: app.selectedProject.client_id,
      }
      app.loading = true
      const clientProjectPlanResource = new Resource('project-plans/fetch-client-project-plan')
      clientProjectPlanResource.list(params)
        .then(response => {
          app.project_phases = response.project_phases
          app.loading = false
        }).catch(e => {
          app.loading = false
          app.$message(e.response.message)
        })
    },
    updateFields(field, event, id) {
      const app = this
      const params = {
        field,
        value: event.target.value,
      }
      // app.loading = true
      const clientProjectPlanResource = new Resource('project-plans/update-client-project-plan-fields')
      clientProjectPlanResource.update(id, params)
        .then(() => {
          app.loading = false
        }).catch(e => {
          app.loading = false
          app.$message(e.response.message)
        })
    },

  },

}
</script>
<style scoped>
.table td {
  padding: 0.5rem 0.5rem;
}
</style>
