<template>
  <div v-loading="loading">
    <div v-if="selectedProject.progress === 100">
      <el-row
        v-if="!isAdmin && feedbacks.length < 1"
        :gutter="10"
      >
        <el-col
          v-for="(form_field, form_index) in form_fields"
          :key="form_index"
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <div class="form-group">
            <label for>{{ form_field.label }}</label>
            <div v-if="form_field.input_type === 'select'">
              <el-select
                v-model="extra_details[form_index]"
                style="width: 100%"
                value-key="label"
                @input="
                  populateExtraDetailsField(
                    form_index,
                    form_field.label,
                    $event
                  )
                "
              >
                <el-option
                  v-for="(option,
                          option_index) in formatAvailableOptions(
                            form_field.available_options
                          )"
                  :key="option_index"
                  :value="option"
                  :label="option"
                />
              </el-select>
            </div>
            <div v-if="form_field.input_type === 'number_input'">
              <el-input
                v-model="extra_details[form_index]"
                type="number"
                :placeholder="form_field.placeholder"
                @input="
                  populateExtraDetailsField(
                    form_index,
                    form_field.label,
                    $event
                  )
                "
              />
            </div>
            <div v-if="form_field.input_type === 'string_input'">
              <el-input
                v-model="extra_details[form_index]"
                type="text"
                :placeholder="form_field.placeholder"
                @input="
                  populateExtraDetailsField(
                    form_index,
                    form_field.label,
                    $event
                  )
                "
              />
            </div>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-button
            type="primary"
            @click="submitFeedback()"
          >
            Submit
          </el-button>
        </el-col>
      </el-row>
      <el-row
        v-else
        :gutter="20"
      >
        <el-col
          :xs="24"
          :lg="8"
        >
          <aside style="height: 250px; overflow: auto">
            <h4>Your feedback</h4>
            <hr>
            <div
              v-for="(feedback, feedbackIndex) in feedbacks"
              :key="feedbackIndex"
            >
              <el-card>
                <strong>{{ feedback.label }}</strong><br>
                <span>{{ feedback.value }}</span>
              </el-card>
            </div>
          </aside>
        </el-col>
        <el-col
          :xs="24"
          :lg="16"
        >
          <div
            align="center"
            style="border: #d0d0d0 double 2px; padding: 30px"
          >

            <div v-if="selectedProject.certificate !== null">
              <div v-if="selectedProject.certificate.preview !== null && selectedProject.certificate.original === null">
                <a
                  :href="baseServerUrl+'storage/'+selectedProject.certificate.preview"
                  target="_blank"
                >
                  <feather-icon
                    size="70"
                    icon="DownloadIcon"
                    color="black"
                  /><br><br>
                  <h2>DOWNLOAD CERTIFICATE SAMPLE</h2>
                </a>

              </div>
              <div v-if="selectedProject.certificate.original !== null">
                <a
                  :href="baseServerUrl+'storage/'+selectedProject.certificate.original"
                  target="_blank"
                >
                  <feather-icon
                    size="70"
                    icon="DownloadIcon"
                    color="green"
                  /><br><br>
                  <h2>DOWNLOAD CERTIFICATE</h2>
                </a>

              </div>
              <div v-else>
                <el-empty description="Your certificate is yet to be uploaded" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-empty
        :image="baseServerUrl+'images/print.png'"
        description="Certificate will be issued when project is completed"
      />
    </div>
  </div>
</template>
<script>
import {} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {},
  directives: {
    Ripple,
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
      loading: false,
      feedbacks: [],
      form_fields: [],
      form: {
        extra_details: [],
      },
      extra_details: [],

    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchFeedBacks()
    this.fetchFormFields()
  },
  methods: {
    populateExtraDetailsField(formIndex, label, value) {
      const app = this
      app.form.extra_details[formIndex] = { label, value }
      // app.doSubmit();
    },
    formatAvailableOptions(value) {
      return value.split('~')
    },
    fetchFeedBacks() {
      const app = this
      const param = { project_id: app.selectedProject.id, client_id: app.selectedProject.client_id }
      param.client_id = app.selectedProject.client_id
      app.loading = true
      const fetchQuestionsResource = new Resource('projects/client-project-feedback')
      fetchQuestionsResource.list(param)
        .then(response => {
          app.feedbacks = response.feedbacks
          app.loading = false
        })
    },
    fetchFormFields() {
      const app = this
      const fetchFormFieldResource = new Resource('custom-fields')
      fetchFormFieldResource.list()
        .then(response => {
          app.form_fields = response.form_fields
          app.loading = false
        })
    },
    submitFeedback() {
      const app = this
      const param = app.form
      param.project_id = app.selectedProject.id
      param.client_id = app.selectedProject.client_id
      const submitFeedbackResource = new Resource('projects/save-client-feedback')
      submitFeedbackResource.store(param)
        .then(() => {
          app.$alert('Thank you for your feedback')
          app.fetchFeedBacks()
          app.loading = false
        })
    },
  },
}
</script>
