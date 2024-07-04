<template>
  <div
    v-loading="loading"
  >
    <b-row>
      <b-col md="6">
        <b-form-group
          label="Enter Category"
          label-for="client_id"
        >
          <el-input
            v-model="form.category"
            placeholder="Governance"
            style="width: 100%;"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <table
      class="table table-bordered table-responsive"
    >
      <thead>
        <tr>
          <th />
          <th>Key Process</th>
          <th>Risk Description</th>
          <th>Control Activities</th>
          <th>Control Owner</th>
          <th>Control Type</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(entry, index) in entries"
          :key="index"
        >
          <td>
            <div style="width: 100px">
              <el-tooltip
                effect="dark"
                content="Remove row"
                placement="top-start"
              >
                <el-button
                  v-if="entries.length > 1"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeEntry(index)"
                />
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="Add another row"
                placement="top-start"
              >

                <el-button
                  v-if="index + 1 === entries.length"
                  type="success"
                  icon="el-icon-plus"
                  circle
                  @click="addEntry(index)"
                />
              </el-tooltip>
            </div>
          </td>
          <td>
            <input
              v-model="entry.key_process"
              placeholder=""
              type="text"
            >
          </td>
          <td>
            <textarea
              v-model="entry.risk_description"
              placeholder=""
              type="textarea"
            />
          </td>
          <td>
            <textarea
              v-model="entry.control_activities"
              placeholder=""
              type="textarea"
            />
          </td>
          <td>
            <input
              v-model="entry.control_owner"
              placeholder=""
              type="text"
            >
          </td>
          <td>
            <select
              v-model="entry.control_type"
              placeholder="Select Type"
            >
              <option
                label="Preventive"
                value="Preventive"
              />
              <option
                label="Detective"
                value="Detective"
              />
              <option
                label="N/A"
                value="N/A"
              />
            </select>
          </td>
          <td>
            <div style="width: 100px">
              <el-tooltip
                effect="dark"
                content="Remove row"
                placement="top-start"
              >
                <el-button
                  v-if="entries.length > 1"
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeEntry(index)"
                />
              </el-tooltip>
              <el-tooltip
                effect="dark"
                content="Add another row"
                placement="top-start"
              >

                <el-button
                  v-if="index + 1 === entries.length"
                  type="success"
                  icon="el-icon-plus"
                  circle
                  @click="addEntry(index)"
                />
              </el-tooltip>
            </div>
          </td>
        </tr>
        <tr v-if="fill_fields_error">
          <td colspan="7">
            <el-alert
              type="error"
            >Please fill all empty fields before adding another row</el-alert>
          </td>
        </tr>
      </tbody>
    </table>
    <p />
    <p />
    <el-button
      v-if="!isRowEmpty()"
      round
      type="success"
      @click="submit()"
    >
      Submit
    </el-button>
  </div>
</template>
<script>
import {
  BRow, BCol, BFormGroup,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    // BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    clientId: {
      type: Number,
      required: true,
    },
    businessUnitId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      entries: [],
      form: {
        business_unit_id: '',
        client_id: '',
        category: '',
        entries: [],
      },
      loading: false,
      fill_fields_error: false,
      BlockRemoval: false,
    }
  },
  created() {
    this.addEntry()
  },
  methods: {
    isRowEmpty() {
      const checkEmptyLines = this.entries.filter(
        detail => detail.risk_description === ''
          || detail.control_activities === ''
          || detail.control_owner === ''
          || detail.control_type === ''
          || detail.key_process === '',
      )
      if (checkEmptyLines.length > 0) {
        return true
      }
      return false
    },
    addEntry() {
      this.fill_fields_error = false

      if (this.isRowEmpty()) {
        this.fill_fields_error = true
      } else {
        this.entries.push({
          risk_description: '',
          control_activities: '',
          control_owner: '',
          control_type: '',
          key_process: '',
        })
      }
    },
    removeEntry(detailId) {
      this.fill_fields_error = false
      if (!this.BlockRemoval) {
        this.entries.splice(detailId, 1)
      }
    },
    submit() {
      const app = this
      if (app.form.category === '') {
        app.$alert('Please enter fill the category field')
        return
      }
      app.loading = true
      const formData = app.form
      formData.client_id = app.clientId
      formData.business_unit_id = app.businessUnitId
      formData.control_data = app.entries
      const saveRisksResource = new Resource('rcsa/create-new-category')
      saveRisksResource.store(formData)
        .then(() => {
          app.loading = false
          app.$notify({
            title: 'Submitted Successfully',
          })
          app.$emit('save')
          // app.$emit('update:is-create-business-process-sidebar-active', false)
        }).catch(error => {
          app.loading = false
          app.$message(error.response.data.error)
        })
    },
  },
}
</script>
  <style lang="scss" scoped>
  @import '~@core/scss/base/bootstrap-extended/include';
  </style>
  <style lang="scss">
  @import '@core/scss/vue/pages/page-auth.scss';
  </style>
  <style scoped>
  .no-padding {
    padding: 0 !important;
  }
  </style>
