<template>
  <div v-loading="load">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Title</th>
          <th>File</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <el-input
              v-model="form.title"
              type="text"
              outline
              placeholder="Title of document"
              disabled
            />
          </td>
          <td>
            <input
              class="form-control"
              type="file"
              @change="onImageChange"
            >
          </td>
          <td>
            <span>
              <b-button
                variant="success"
                class="btn-icon rounded-circle"
                :disabled="form.title === '' || uploadableFile === null"
                @click="submit()"
              >
                <feather-icon icon="SaveIcon" />
              </b-button>

            </span>
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
    uploadTemplate: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      showTable: false,
      form: {
        title: '',
      },
      fill_fields_error: false,
      load: false,
      uploadableFile: null,
    }
  },
  created() {
    this.form.title = this.uploadTemplate.template_title
  },
  methods: {
    onImageChange(e) {
      const app = this
      // eslint-disable-next-line prefer-destructuring
      app.uploadableFile = e.target.files[0]
    },
    submit() {
      const app = this
      app.load = true
      const formData = new FormData()
      formData.append('title', app.form.title)
      formData.append('file_uploaded', app.uploadableFile)
      formData.append('upload_id', app.uploadTemplate.id)
      const updatePhotoResource = new Resource('uploads/upload-file')
      updatePhotoResource.store(formData)
        .then(() => {
          app.load = false
          app.uploadableFile = null
          app.form = {
            title: '',
            link: '',
          }
          app.$emit('reload')
          app.$message('File upload successful')
        })
        .catch(e => {
          app.load = false
          app.$message(e.response.message)
        })
    },
  },
}
</script>
