<template>
  <div>
    <div v-if="showDocumentEditor !== 'none'">
      <span
        class="pull-right"
      >
        <el-button
          type="danger"
          class="btn-icon"
          size="mini"
          @click="showDocumentEditor = 'none'"
        >
          <feather-icon icon="XIcon" />
        </el-button>
      </span>
      <vue-document-editor
        v-if="showDocumentEditor === 'word'"
        :document-path="selectedDocument.link"
        :document-title="selectedDocument.evidence_title"
      />
      <vue-spreadsheet-editor
        v-if="showDocumentEditor === 'spreadsheet'"
        :document-path="selectedDocument.link"
        :document-title="selectedDocument.evidence_title"
      />
    </div>
    <div v-else>
      <div
        v-for="(question, question_index) in questions"
        :key="question_index"
      >
        <div
          v-if="currenctQuestion === question_index"
          class="col-lg-12 col-md-12 col-sm-12 col-xs-12 "
          style="padding: 5px; border: 5px double #c0c0c0;border-radius: 8px;"
        >
          <div>

            <span
              class="pull-right"
            >
              <el-button
                v-if="question.is_submitted === 1 && question.status === null"
                plain
                round
                type="default"
              >
                Status: Submitted
              </el-button>
              <el-button
                v-else
                plain
                round
                :type="(question.status === 'Closed') ? 'success' : (question.status === 'Work In Progress') ? 'warning' : 'danger'"
              >
                Status: {{ (question.status) ? question.status : 'Open' }}
              </el-button>
              <button
                v-if="isAdmin && question.is_submitted === 1"
                class="btn btn-success"
                @click="allowModification(questions);"
              ><feather-icon
                icon="ThumbsUpIcon"
              />
                Enable Modification
              </button>
              &nbsp;
              <el-select
                v-if="isAdmin && question.is_submitted === 1"
                v-model="question.status"
                placeholder="Change Status"
                @input="changeStatus($event, questions)"
              >
                <el-option
                  v-for="(status, index) in statuses"
                  :key="index"
                  :value="status"
                  :label="status"
                />
              </el-select>
            </span>
            <strong style="color: red">
              Question {{ question_index + 1 }}  of  {{ questions.length }}
            </strong>

            <div>
              <button
                v-if="question_index !== 0"
                class="btn btn-danger btn-sm"
                @click="change(question_index-1);"
              > <feather-icon
                icon="ArrowLeftIcon"
              /> Prev
              </button>
              <button
                v-if="parseInt(question_index + 1) < questions.length"
                class="btn btn-primary  btn-sm"
                @click="change(question_index+1);"
              > Next
                <feather-icon
                  icon="ArrowRightIcon"
                />
              </button>
              <button
                v-if="!isAdmin && parseInt(question_index + 1) === questions.length && question.is_submitted === 0"
                class="btn btn-success  btn-sm"
                @click="submitAnswers(questions);"
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

              <!-- <ckeditor
                        id="question"
                        v-model="question.question"
                        :editor="editor"
                        :config="editorConfig"
                        disabled
                      /> -->
              <div
                v-if="showQuestions"
                style="background: #f0f0f0; padding: 10px; margin-bottom: 5px; border-radius: 5px;"
              >

                <!--eslint-disable-next-line vue/no-v-html-->
                <span v-html="question.question" />
              </div>
              <el-tooltip
                v-if="question.key !== null"
                class="item"
                effect="light"
                :content="question.key"
                placement="bottom"
              >
                <el-button>Key/Insight</el-button>
              </el-tooltip>
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
                      v-model="question.id"
                      type="hidden"
                    >
                    <div v-if="!isAdmin">

                      <div v-if="question.is_submitted === 0">
                        <div>
                          <el-radio-group
                            v-model="question.answer"
                            @change="saveAnswer(question, 'answer')"
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
                          <div v-if="question.answer === 'NA'">
                            <el-alert
                              type="error"
                              :closable="false"
                            >
                              Kindly give reasons why this is NOT APPLICABLE
                            </el-alert>
                            <el-input
                              v-model="question.detailed_explanation"
                              type="textarea"
                              placeholder="Type reasons here..."
                              style="width: 100%"
                              @blur="saveAnswer(question, 'detailed_explanation')"
                            />
                          </div>
                          <div v-else>
                            <el-input
                              v-model="question.detailed_explanation"
                              type="textarea"
                              placeholder="Give some detailed response here..."
                              style="width: 100%"
                              @blur="saveAnswer(question, 'detailed_explanation')"
                            />
                          </div>
                          <hr>
                        </div>
                      </div>
                      <div v-else>
                        <strong>Response:</strong>&nbsp;{{ question.answer }}<br><br>
                        {{ question.detailed_explanation }}
                      </div>

                    </div>
                    <div v-else>
                      <strong>Response:</strong>&nbsp;{{ question.answer }}<br><br>
                      {{ question.detailed_explanation }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="isAdmin && question.is_submitted === 1"
                style="border: 5px dashed #c0c0c0; padding: 10px; margin-bottom: 5px; border-radius: 10px;"
              >
                <h3>Assessment</h3>
                <b-row>

                  <b-col cols="12">
                    <label>Observation</label>
                    <p><el-alert
                      :closable="false"
                      :type="(question.risk_score === 1) ? 'success' : (question.risk_score === 2) ? 'warning' : 'error'"
                      effect="dark"
                    >
                      {{ (question.observation) ? question.observation : 'No observation yet' }}
                    </el-alert></p>
                  </b-col>
                  <b-col cols="12">
                    <label>Risk Score</label>
                    <p>
                      <select
                        v-model="question.risk_score"
                        placeholder="Select Risk Score"
                        class="form-control"
                        style="width: 100%;"
                        @input="saveAnswer(question, 'risk_score')"
                      >
                        <option
                          v-for="(score, score_index) in risk_scores"
                          :key="score_index"
                          :value="score.value"
                          :label="score.label"
                        />
                      </select>
                    </p>
                  </b-col>
                  <b-col cols="12">
                    <label>Impact</label>
                    <p>
                      <el-alert
                        :closable="false"
                        :type="(question.risk_score === 1) ? 'success' : (question.risk_score === 2) ? 'warning' : 'error'"
                        effect="dark"
                      >
                        {{ (question.impact) ? question.impact : 'No impact' }}
                      </el-alert>
                    </p>
                  </b-col>
                  <b-col cols="12">
                    <label>Recommendations</label>
                    <p>
                      <el-alert
                        :closable="false"
                        :type="(question.risk_score === 1) ? 'success' : (question.risk_score === 2) ? 'warning' : 'error'"
                        effect="dark"
                      >
                        {{ (question.recommendations) ? question.recommendations : 'Nothing to recommend' }}
                      </el-alert>
                    </p>
                  </b-col>
                  <b-col cols="12">
                    <label>Status</label>
                    <p>
                      <el-alert
                        :closable="false"
                        type="success"
                      >
                        {{ (question.status) ? question.status : 'Open' }}
                      </el-alert>
                    </p>
                  </b-col>
                </b-row>
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
                  v-if="!isAdmin && question.is_submitted === 0"
                  variant="gradient-primary"
                  block
                  @click="addEvidence(question.id)"
                >
                  <feather-icon icon="UploadIcon" />
                  Upload Evidence
                </b-button>
                <div v-else>
                  Uploaded Evidences
                </div>
                <hr>
                <b-alert
                  v-for="(evidence, evidence_index) in question.evidences"
                  :key="evidence_index"
                  variant="primary"
                  show
                >
                  <div
                    v-loading="loadDelete"
                    class="alert-body"
                  >
                    <!-- <a
                              :href="baseServerUrl+'storage/'+evidence.link"
                              target="_blank"
                            >{{ evidence.evidence_title }}</a> -->
                    <small style="font-size: 11px">{{ evidence.evidence_title }}</small>
                    <span
                      class="pull-right"
                    >
                      <el-dropdown>
                        <b-button
                          variant="flat"
                          class="btn-icon rounded-circle"
                        >
                          <i class="el-icon-more-outline" />
                        </b-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-if="evidence.link.split('.').pop() === 'docx' || evidence.link.split('.').pop() === 'doc'"
                          >
                            <span @click="viewAndEditDocument(evidence, 'word')">Edit Word Doc</span>
                          </el-dropdown-item>

                          <!-- <el-dropdown-item
                                    v-if="evidence.link.split('.').pop() === 'xlsx' || evidence.link.split('.').pop() === 'xls'"
                                  >
                                    <span @click="viewAndEditDocument(evidence, 'spreadsheet')">Edit Spreadsheet</span>
                                  </el-dropdown-item> -->

                          <el-dropdown-item>
                            <a
                              :href="baseServerUrl+'storage/'+evidence.link"
                              target="_blank"
                            >Download
                            </a>
                          </el-dropdown-item>
                          <el-dropdown-item
                            v-if="!isAdmin && question.is_submitted === 0"
                          >
                            <span @click="destroyDueDiligenceEvidence(evidence.id)">Delete</span>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </span>
                  </div>
                </b-alert>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- <give-due-diligence-remarks
        v-if="showRemarkModal"
        v-model="showRemarkModal"
        :answer="selectedAnswerForRemark"
        :is-admin="isAdmin"
        @reload="fetchQuestionsWithResponse"
      /> -->
      <b-modal
        v-model="showModal"
        title="Upload Evidence"
        centered
        size="lg"
        hide-footer
      >

        <upload-due-diligence-evidence
          :answer-id="selectedAnswer"
          @reload="$emit('submitted')"
        />

      </b-modal>
    </div>
  </div>
</template>
<script>
import {
  BButton, BModal, BAlert,
} from 'bootstrap-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import UploadDueDiligenceEvidence from '../../UploadDueDiligenceEvidence.vue'
// import GiveDueDiligenceRemarks from '../../GiveDueDiligenceRemarks.vue'
import VueDocumentEditor from '@/views/components/editors/VueDocumentEditor.vue'
import VueSpreadsheetEditor from '@/views/components/editors/VueSpreadsheetEditor.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    BAlert,
    BModal,
    UploadDueDiligenceEvidence,
    // GiveDueDiligenceRemarks,
    VueDocumentEditor,
    VueSpreadsheetEditor,
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: () => false,
    },
    vendorId: {
      type: Number,
      required: true,
    },
    questions: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      domains: [],
      clients: [],
      currenctQuestion: 0,
      currentQuestionsAreSet: false,
      showQuestions: true,
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
      showDocumentEditor: 'none',
      selectedDocument: '',
      risk_scores: [
        { value: 1, label: '1-Low' },
        { value: 2, label: '2-Medium' },
        { value: 3, label: '3-High' },
      ],
      statuses: ['Open', 'Work In Progress', 'Closed'],
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    selectedClient() {
      return this.$store.getters.selectedClient
    },
  },
  created() {
    // this.fetchQuestionsWithResponse()
  },
  methods: {
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
    colorButton(index, current) {
      document.getElementById(`quest_button_${index}_${current}`).style.backgroundColor = '#ccc'
      // }
    },
    change(value) {
      const app = this
      app.currenctQuestion = value
      app.showQuestions = false
      setTimeout(() => {
        app.showQuestions = true
      }, 5)
    },
    fetchQuestionsWithResponse(load = true) {
      const app = this
      app.showRemarkModal = false
      app.loading = load
      const fetchQuestionsWithResponseResource = new Resource('vdd/responses/fetch')
      fetchQuestionsWithResponseResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.domains = response.domains
          if (!app.currentQuestionsAreSet) {
            app.setCurrentQuestions(app.domains)
          }
          app.loading = false
        })
    },
    saveAnswer(answer, field) {
      console.log(answer[field])
      const param = { answer: answer[field], field }
      const fetchConsultingsResource = new Resource('vdd/answers/update')
      fetchConsultingsResource.vUpdate(answer.id, param)
        .then(() => {})
    },
    submitAnswers(domains) {
      const message = 'Click OK to confirm submit action. You will not be able to modify responses once you submit'
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const answerIds = []
        domains.forEach(response => {
          answerIds.push(response.id)
        })
        const param = { answer_ids: answerIds, value: 1 }
        const submitAnswersResource = new Resource('vdd/answers/submit')
        submitAnswersResource.vStore(param)
          .then(() => {
            this.$emit('submitted')
            this.$emit('reloadAnalytics')
          })
      }
    },
    changeStatus(value, questions) {
      const message = `Click OK to confirm that you want to set the status to  ${value}`
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const answerIds = []
        questions.forEach(question => {
          answerIds.push(question.id)
        })
        const param = { answer_ids: answerIds, value }
        const submitAnswersResource = new Resource('vdd/responses/change-status')
        submitAnswersResource.store(param)
          .then(() => {
            this.$message('Status Changed')
            this.$emit('submitted')
          })
      }
    },
    allowModification(domains) {
      const message = 'Click OK to confirm that you allow the modification of this response'
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const answerIds = []
        domains.forEach(question => {
          answerIds.push(question.id)
        })
        const param = { answer_ids: answerIds, value: 0 }
        const submitAnswersResource = new Resource('vdd/responses/enable-modification')
        submitAnswersResource.store(param)
          .then(() => {
            this.$message('Modification Enabled')
            this.$emit('submitted')
          })
      }
    },
    destroyDueDiligenceEvidence(id) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this document? This cannot be recovered')) {
        app.loadDelete = true
        const destroyEvidenceResource = new Resource('vdd/answers/destroy-evidence')
        destroyEvidenceResource.vDestroy(id)
          .then(() => {
            // app.fetchQuestionsWithResponse(false)
            app.$message('Document Deleted')
            this.$emit('submitted')
            app.loadDelete = false
          }).catch(e => {
            app.loadDelete = false
            app.$message(e.message)
          })
      }
    },
    viewAndEditDocument(data, type) {
      const app = this
      app.selectedDocument = data
      app.showDocumentEditor = type
    },
  },

}
</script>
