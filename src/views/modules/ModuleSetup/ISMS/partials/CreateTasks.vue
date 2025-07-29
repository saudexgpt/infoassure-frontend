<template>
  <el-row :gutter="20">
    <el-col :md="24">
      <div style="max-height: 450px; overflow: auto">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th></th>
              <th>Task (one per row)</th>
              <th>Hint</th>
              <!-- <th>Dependent On</th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in details" :key="index">
              <td>
                <span>
                  <el-button
                    v-if="details.length > 1"
                    type="danger"
                    circle
                    size="mini"
                    @click="removeLine(index)"
                  >
                    <icon icon="tabler:trash" />
                  </el-button>
                  <el-button
                    v-if="index + 1 === details.length"
                    type="success"
                    circle
                    size="mini"
                    @click="addLine(index)"
                  >
                    <icon icon="tabler:plus" />
                  </el-button>
                </span>
              </td>
              <td>
                <el-input
                  v-model="detail.name"
                  type="text"
                  placeholder="State a task to be performed"
                />
              </td>
              <td>
                <el-input
                  v-model="detail.hint"
                  type="textarea"
                  placeholder="Suggest implementation guide"
                />
              </td>
              <!-- <td v-loading="loadTasks">
                <el-select v-model="detail.dependency" filterable style="width: 100%">
                  <el-option
                    v-for="(task, index) in other_tasks"
                    :key="index"
                    :value="task.id"
                    :label="task.name"
                  />
                </el-select>
              </td> -->
            </tr>
            <tr v-if="fill_fields_error">
              <td colspan="4">
                <label class="alert alert-danger"
                  >Please fill all empty fields before adding another row</label
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-col>
    <el-col :md="24">
      <el-button :loading="loader" type="success" @click="formSubmitted"> Submit </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    activity: {
      type: Object,
      default: () => null
    }
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,

      form: {
        clause_id: '',
        module_activity_id: '',
        details: []
      },
      empty_form: {
        clause_id: '',
        module_activity_id: '',
        details: []
      },
      loader: false,
      details: [],
      fill_fields_error: false,
      loadTasks: false,
      other_tasks: []
    }
  },
  created() {
    this.form.clause_id = this.activity.clause_id
    this.form.module_activity_id = this.activity.id
    this.addLine()
  },
  methods: {
    addLine() {
      this.fill_fields_error = false

      const checkEmptyLines = this.details.filter((detail) => detail.name === '')

      if (checkEmptyLines.length >= 1 && this.details.length > 0) {
        this.fill_fields_error = true
      } else {
        this.details.push({
          name: '',
          hint: '',
          dependency: null
        })
      }
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.details.splice(detailId, 1)
      }
    },
    formSubmitted() {
      const createTaskResource = new Resource('isms/calendar/store-clause-activity-tasks')
      const { form } = this
      form.details = this.details
      this.loader = true
      createTaskResource
        .store(form)
        .then(() => {
          this.form = this.empty_form
          this.loader = false

          this.$message('Action Successful')
          // this.$router.push({ path: 'login' })
          this.$emit('saved')
          // send mail
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loader = false
        })
    }
  }
}
</script>
