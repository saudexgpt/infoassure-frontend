<template>
  <div>
    <aside>
      <h3>Create Asset Types</h3>
      <el-row :gutter="10">
        <el-col :md="20">
          <label>Type in the asset types and hit enter to add more. Then click on the Submit button</label>
          <el-select
            v-model="form.names"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Example: People, IT equipment, etc"
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
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    clientId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      form: { names: [] },
    }
  },
  methods: {
    submitEntry() {
      const app = this
      const saveEntryResource = new Resource('risk-assessment/save-asset-types')
      const { form } = app
      form.client_id = app.clientId
      app.loading = true
      saveEntryResource.store(form)
        .then(() => {
          app.form.names = []
          app.$message('Submitted')
          app.loading = false
          app.$emit('save')
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
  },
}
</script>
