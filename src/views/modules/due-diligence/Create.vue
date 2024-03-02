<template>

  <div v-loading="loading">
    <aside>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-select
            v-model="selectedClient"
            value-key="id"
            placeholder="Select Client/Vendor"
            style="width: 100%;"
            @input="setDueDiligenceResponses()"
          >
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client"
              :label="client.name"
            />
          </el-select>
        </el-col>
      </el-row>
    </aside>
    <b-tabs
      v-if="selectedClient !== null"
      content-class="mt-1"
    >
      <b-tab>
        <template #title>
          <span>Details</span>
        </template>

        <div
          v-for="(response, response_index) in answers"
          :key="response_index"
        >
          <div
            v-if="current_question === response_index"
            class="col-lg-12 col-md-12 col-sm-12 col-xs-12 "
            style="padding: 5px; border: 5px double #c0c0c0;border-radius: 8px;"
          >
            <div>

              <span
                class="pull-right"
              >
                <el-button
                  size="mini"
                  type="primary"
                  @click="openRemarkModal(response)"
                >
                  <feather-icon
                    icon="MessageSquareIcon"
                  />
                  Consultant Remark
                </el-button>
                <button
                  v-if="isAdmin"
                  class="btn btn-success  btn-sm"
                  @click="allowModification(answers);"
                ><feather-icon
                  icon="ThumbsUpIcon"
                />
                  Enable Modification
                </button>
              </span>
              <strong style="color: red">
                Question {{ response_index + 1 }}  of  {{ answers.length }}
              </strong>

              <div>
                <button
                  v-if="response_index !== 0"
                  class="btn btn-danger btn-sm"
                  @click="change(response_index-1);"
                > <feather-icon
                  icon="ArrowLeftIcon"
                /> Prev
                </button>
                <button
                  v-if="parseInt(response_index + 1) < answers.length"
                  class="btn btn-primary  btn-sm"
                  @click="change(response_index+1);"
                > Next
                  <feather-icon
                    icon="ArrowRightIcon"
                  />
                </button>
                <button
                  v-if="!isAdmin && parseInt(response_index + 1) === answers.length && response.is_submitted === 0"
                  class="btn btn-success  btn-sm"
                  @click="submitAnswers(answers);"
                ><feather-icon
                  icon="SaveIcon"
                />
                  Submit
                </button>

              </div>
            </div>
            <hr>
            <el-row :gutter="5">
              <el-col
                :lg="16"
                :md="16"
                :sm="24"
                :xs="24"
              >

                <ckeditor
                  id="question"
                  v-model="response.question.question"
                  :editor="editor"
                  :config="editorConfig"
                  disabled
                />
                <div
                  style="padding:10px;"
                >

                  <div class="control-group">
                    <label
                      class="control-label"
                      for="inputEmail"
                    />
                    <div class="controls">
                      <input
                        v-model="response.id"
                        type="hidden"
                      >
                      <div v-if="!isAdmin">

                        <div v-if="response.is_submitted === 0">
                          <div>
                            <el-radio-group
                              v-model="response.answer"
                              @change="saveAnswer(response, 'answer')"
                            >
                              <el-radio
                                label="YES"
                                border
                              >
                                YES
                              </el-radio>
                              <el-radio
                                label="NO"
                                border
                              >
                                NO
                              </el-radio>
                              <el-radio
                                label="NA"
                                border
                              >
                                NOT APPLICABLE
                              </el-radio>
                            </el-radio-group>
                            <br>
                            <div v-if="response.answer === 'NA'">
                              <el-alert
                                type="error"
                                :closable="false"
                              >
                                Kindly give reasons why this is NOT APPLICABLE
                              </el-alert>
                              <el-input
                                v-model="response.detailed_explanation"
                                type="textarea"
                                placeholder="Type reasons here..."
                                style="width: 100%"
                                @blur="saveAnswer(response, 'detailed_explanation')"
                              />
                            </div>
                            <div v-else>
                              <el-input
                                v-model="response.detailed_explanation"
                                type="textarea"
                                placeholder="Give some detailed response here..."
                                style="width: 100%"
                                @blur="saveAnswer(response, 'detailed_explanation')"
                              />
                            </div>
                            <hr>
                          </div>
                        </div>
                        <div v-else>
                          <strong>Response:</strong>&nbsp;{{ response.answer }}<br><br>
                          {{ response.detailed_explanation }}
                        </div>

                      </div>
                      <div v-else>
                        <strong>Response:</strong>&nbsp;{{ response.answer }}<br><br>
                        {{ response.detailed_explanation }}
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col
                :lg="8"
                :md="8"
                :sm="24"
                :xs="24"
              >
                <div
                  style="height: 300px; overflow: auto; background: #fcfcfc; padding: 10px;"
                >
                  <b-button
                    v-if="!isAdmin"
                    variant="gradient-primary"
                    block
                    @click="addEvidence(response.id)"
                  >
                    <feather-icon icon="UploadIcon" />
                    Upload Evidence
                  </b-button>
                  <div v-if="isAdmin">
                    Uploaded Evidences
                  </div>
                  <hr>
                  <b-alert
                    v-for="(evidence, evidence_index) in response.evidences"
                    :key="evidence_index"
                    variant="primary"
                    show
                  >
                    <div
                      v-loading="loadDelete"
                      class="alert-body"
                    >
                      <a
                        :href="baseServerUrl+'storage/'+evidence.link"
                        target="_blank"
                      >{{ evidence.evidence_title }}</a>
                      <span
                        v-if="!isAdmin"
                        class="pull-right"
                      ><b-button
                        variant="flat-danger"
                        class="btn-icon rounded-circle"
                        @click="destroyDueDiligenceEvidence(evidence.id)"
                      >
                        <feather-icon icon="TrashIcon" />
                      </b-button></span>

                    </div>
                  </b-alert>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <give-due-diligence-remarks
          v-if="showRemarkModal"
          v-model="showRemarkModal"
          :answer="selectedAnswerForRemark"
          :is-admin="isAdmin"
          @reload="fetchResponses"
        />
        <b-modal
          v-model="showModal"
          title="Upload Evidence"
          centered
          size="lg"
          hide-footer
        >

          <upload-due-diligence-evidence
            :answer-id="selectedAnswer"
            @reload="fetchResponses"
          />

        </b-modal>
      </b-tab>
      <b-tab>
        <template #title>
          <span>Report</span>
        </template>
        <report
          :data="answers"
          :selected-client="selectedClient"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import {
  BButton, BModal, BAlert, BTabs, BTab,
} from 'bootstrap-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import UploadDueDiligenceEvidence from './UploadDueDiligenceEvidence.vue'
import GiveDueDiligenceRemarks from './GiveDueDiligenceRemarks.vue'
import Report from './Report.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    BAlert,
    BModal,
    BTabs,
    BTab,
    UploadDueDiligenceEvidence,
    GiveDueDiligenceRemarks,
    Report,
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      answers: [],
      selectedClient: null,
      clients: [],
      current_question: 0,
      selectedAnswer: null,
      showRemarkModal: false,
      selectedAnswerForRemark: null,
      loadButton: false,
      loading: false,
      loadDelete: false,
      exceptionReason: '',
      adminRemark: '',
      showModal: false,
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  created() {
    this.fetchClients()
  },
  methods: {
    fetchClients() {
      const app = this
      const fetchProjectsResource = new Resource('clients')
      fetchProjectsResource.list({ option: 'all' })
        .then(response => {
          app.clients = response.clients
        })
    },
    openRemarkModal(selectedAnswer) {
      const app = this
      app.selectedAnswerForRemark = selectedAnswer
      app.showRemarkModal = true
    },
    addEvidence(answerId) {
      const app = this
      app.selectedAnswer = answerId
      app.showModal = true
    },
    fetchResponses(load = true) {
      const app = this
      app.showRemarkModal = false
      app.loading = load
      const fetchResponsesResource = new Resource('due-diligence/answers/fetch-responses')
      fetchResponsesResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.answers = response.answers
          app.loading = false
        })
    },
    setDueDiligenceResponses() {
      const app = this
      app.loading = true
      const fetchResponsesResource = new Resource('due-diligence/answers/save')
      fetchResponsesResource.store({ client_id: app.selectedClient.id })
        .then(() => {
          app.fetchResponses()
        })
    },
    colorButton(index, current) {
      document.getElementById(`quest_button_${index}_${current}`).style.backgroundColor = '#ccc'
      // }
    },
    change(value) {
      // const count = noOfQuestions

      // jQuery('#q_' + val ).show();
      this.current_question = value
    },
    saveAnswer(answer, field) {
      // console.log(answer[field])
      const param = { answer: answer[field], field }
      const fetchConsultingsResource = new Resource('due-diligence/answers/update')
      fetchConsultingsResource.update(answer.id, param)
        .then(() => {})
    },
    submitAnswers(answers) {
      const message = 'Click OK to confirm submit action. You will not be able to modify responses once you submit'
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const answerIds = []
        answers.forEach(response => {
          answerIds.push(response.id)
        })
        const param = { answer_ids: answerIds, value: 1 }
        const submitAnswersResource = new Resource('due-diligence/answers/submit')
        submitAnswersResource.store(param)
          .then(() => {
            // this.fetchResponses()
            this.$emit('reloadAnalytics')
          })
      }
    },
    allowModification(answers) {
      const message = 'Click OK to confirm that you allow the modification of this response'
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const answerIds = []
        answers.forEach(question => {
          answerIds.push(question.answer.id)
        })
        const param = { answer_ids: answerIds, value: 0 }
        const submitAnswersResource = new Resource('due-diligence/answers/submit')
        submitAnswersResource.store(param)
          .then(() => {
            this.$message('Modification Enabled')
            this.fetchResponses()
            this.$emit('reloadAnalytics')
          })
      }
    },
    destroyDueDiligenceEvidence(id) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this document? This cannot be recovered')) {
        app.loadDelete = true
        const destroyEvidenceResource = new Resource('due-diligence/answers/destroy-evidence')
        destroyEvidenceResource.destroy(id)
          .then(() => {
            app.fetchResponses(false)
            app.$message('Document Deleted')
            app.loadDelete = false
          }).catch(e => {
            app.loadDelete = false
            app.$message(e.response.message)
          })
      }
    },
  },

}
</script>
