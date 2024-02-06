<template>
  <div>
    <div style="background: #eeeeee; padding: 10px; border-radius: 5px">
      <h3>Create Controls</h3>
      <table class="table table-striped">
        <tr>
          <td>Control Area</td>
          <td>Control</td>
          <td>Description</td>
        </tr>
        <tr>
          <td>
            <el-select v-model="form.area_id">
              <el-option
                v-for="(area, index) in areas"
                :key="index"
                :value="area.id"
                :label="area.name"
              />
            </el-select>
          </td>
          <td>
            <el-input
              v-model="form.name"
              type="text"
            />
          </td>
          <td>
            <el-input
              v-model="form.description"
              type="textarea"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <el-button
              type="success"
              @click="submitEntry()"
            >
              Submit
            </el-button>
          </td>
        </tr>
      </table>

    </div>
    <v-client-table
      v-model="controls"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="action"
        slot-scope="props"
      >
        <el-button
          type="danger"
          icon="el-icon-delete"
          circle
          @click="deleteEntry(props.row)"
        />
      </div>
    </v-client-table>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  data() {
    return {
      areas: [],
      form: { area_id: '', name: '', description: '' },
      controls: [],
      loading: false,
      columns: [
        'area.name',
        'name',
        'description',
        'action',
      ],
      options: {
        headings: {
          'area.name': 'Area',
          name: 'Control',
        },
        filterByColumn: false,
        sortable: [],
        filterable: [],
      },
    }
  },
  created() {
    this.fetchAreas()
    this.fetchControls()
  },
  methods: {
    fetchAreas() {
      const app = this
      const fetchEntryResource = new Resource('soa/fetch-areas')
      fetchEntryResource.list()
        .then(response => {
          app.areas = response.areas
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    fetchControls() {
      const app = this
      const fetchEntryResource = new Resource('soa/fetch-controls')
      app.loading = true
      fetchEntryResource.list()
        .then(response => {
          app.controls = response.controls
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    submitEntry() {
      const app = this
      const saveEntryResource = new Resource('soa/save-controls')
      app.loading = true
      saveEntryResource.store(app.form)
        .then(() => {
          app.fetchControls()
          app.loading = false
          app.form = { area_id: app.form.area_id, names: '', description: '' }
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    deleteEntry(row) {
      const app = this
      // eslint-disable-next-line no-alert
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('soa/delete-control')
        app.loading = true
        saveEntryResource.destroy(row.id)
          .then(() => {
            app.fetchControls()
            app.loading = false
          })
          .catch(error => {
          // console.log(error.response)
            app.$message.error(error.response.data.error)
            app.loading = false
          })
      }
    },
  },
}
</script>
