<template>
  <div>
    <aside>
      <h3>Create Risk Category</h3>
      <el-row :gutter="10">
        <el-col :md="20">
          <label>Type in the category and hit enter to add more</label>
          <el-select
            v-model="form.names"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Example: Low, Medium etc"
            style="width: 100%"
          >
            <el-option
              v-for="item in []"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :md="4">
          <label>&nbsp;</label>
          <el-button
            type="success"
            style="width: 100%"
            @click="submitEntry()"
          >
            Submit
          </el-button>
        </el-col>
      </el-row>

    </aside>
    <v-client-table
      v-model="categories"
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
      form: { names: [] },
      categories: [],
      loading: false,
      columns: [
        'name',
        'action',
      ],
      options: {
        headings: {},
        filterByColumn: false,
        sortable: [],
        filterable: [],
      },
    }
  },
  created() {
    this.fetchCategory()
  },
  methods: {
    fetchCategory() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-categories')
      app.loading = true
      fetchEntryResource.list()
        .then(response => {
          app.categories = response.categories
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
      const saveEntryResource = new Resource('risk-assessment/save-categories')
      app.loading = true
      saveEntryResource.store(app.form)
        .then(() => {
          app.fetchCategory()
          app.loading = false
          app.form = { names: [] }
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
        const saveEntryResource = new Resource('risk-assessment/delete-category')
        app.loading = true
        saveEntryResource.destroy(row.id)
          .then(() => {
            app.fetchCategory()
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
