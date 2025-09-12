<template>
  <div v-loading="loader">
    <h4>Notes/Response to Sub tasks</h4>
    <Editor v-model="form.notes" />
    <aside>
      <el-tooltip content="Save">
        <el-button type="primary" @click="saveNote()">
          <icon icon="tabler:device-floppy" /> Save Note
        </el-button>
      </el-tooltip>
    </aside>
  </div>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'
import { Editor } from '@/components/Editor'

export default {
  components: {
    Editor
  },
  props: {
    task: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loader: false,
      form: {
        notes: ''
      }
    }
  },
  watch: {
    task() {
      this.form.notes = this.task.notes
    }
  },
  beforeMount() {
    this.form.notes = this.task.notes
  },
  methods: {
    saveNote() {
      const createTaskResource = new Resource('isms/calendar/save-assigned-task-note')
      const { form } = this
      form.assigned_task_id = this.task.id
      this.loader = true
      createTaskResource
        .update(this.task.id, form)
        .then((response) => {
          this.$message('Successful')
          this.loader = false
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
