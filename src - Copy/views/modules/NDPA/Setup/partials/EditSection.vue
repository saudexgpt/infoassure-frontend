<template>
  <div v-loading="load">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Section</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <el-input
              v-model="form.name"
              placeholder="Example: Section 24"
              type="text"
            />
          </td>
          <td>
            <el-input
              v-model="form.description"
              placeholder="Principles of Personal Data Processing"
              type="text"
            />
          </td>
        </tr>
        <tr v-if="fill_fields_error">
          <td colspan="4">
            <label
              class="label label-danger"
            >Please fill all empty fields before adding another row</label>
          </td>
        </tr>
        <tr v-if="!isRowEmpty()">
          <td colspan="3">
            <b-button
              variant="success"
              @click="submit()"
            >
              Submit
            </b-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { BButton } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: { BButton },
  directives: {
    Ripple,
  },
  props: {
    section: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      fill_fields_error: false,
      load: false,
      form: {
        clause_id: '',
        name: '',
        description: '',
      },
      showTable: false,
    }
  },
  created() {
    this.form = this.section
  },
  methods: {
    isRowEmpty() {
      const app = this
      if (app.form.name === '' || app.form.description === '') {
        return true
      }
      return false
    },
    submit() {
      const app = this
      app.load = true
      const formData = app.form
      const updateSectionResource = new Resource('ndpa/clauses/update-section')
      updateSectionResource.update(formData.id, formData)
        .then(() => {
          app.load = false
          app.$emit('reload')
          app.$message('Action successful')
        })
        .catch(e => {
          app.load = false
          app.$message(e.response.message)
        })
    },
  },
}
</script>
