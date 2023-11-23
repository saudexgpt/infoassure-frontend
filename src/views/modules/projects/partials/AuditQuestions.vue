<template>

  <app-collapse
    v-loading="loading"
    accordion
    type="border"
  >
    <app-collapse-item
      v-for="(clause, index) in clauses"
      :key="index"
      :title="clause.name"
    >
      <template v-for="(question, question_index) in clause.questions">

        <div
          :key="question_index"
        >
          <div
            v-if="current_question === question_index"
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
                  @click="openRemarkModal(question.answer)"
                >
                  <feather-icon
                    icon="MessageSquareIcon"
                  />
                  Consultant Remark
                </el-button>
                <!-- <el-popover
                  v-if="isAdmin"
                  placement="right"
                  width="400"
                  trigger="click"
                >
                  <div>
                    <el-input
                      v-model="adminRemark"
                      placeholder="Give remark here..."
                      type="textarea"
                    />
                    <br>
                    <el-button
                      :loading="loadButton"
                      size="mini"
                      type="success"
                      :disabled="adminRemark === ''"
                      @click="saveRemark(question.answer.id, index, question_index)"
                    >
                      Submit
                    </el-button>
                  </div>
                  <el-button
                    slot="reference"
                    size="mini"
                    type="primary"
                  >
                    <feather-icon
                      icon="MessageSquareIcon"
                    />
                    Give Remark
                  </el-button>
                </el-popover> -->
                <button
                  v-if="isAdmin"
                  class="btn btn-success  btn-sm"
                  @click="allowModification(clause.questions);"
                ><feather-icon
                  icon="ThumbsUpIcon"
                />
                  Enable Modification
                </button>
              </span>
              <strong style="color: red">
                Question {{ question_index + 1 }}  of  {{ clause.questions.length }}
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
                  v-if="parseInt(question_index + 1) < clause.questions.length"
                  class="btn btn-primary  btn-sm"
                  @click="change(question_index+1);"
                > Next
                  <feather-icon
                    icon="ArrowRightIcon"
                  />
                </button>
                <button
                  v-if="!isAdmin && parseInt(question_index + 1) === clause.questions.length && question.answer.is_submitted === 0 && selectedProject.is_completed === 0"
                  class="btn btn-success  btn-sm"
                  @click="submitAnswers(clause.questions);"
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
                  v-model="question.question"
                  :editor="editor"
                  :config="editorConfig"
                  disabled
                />
                <div
                  v-if="question.answer.is_exception === 0"
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

                        <div v-if="question.answer.is_submitted === 0">
                          <div v-if="question.answer_type === 'yes-no'">
                            <el-radio-group
                              v-model="question.answer.yes_or_no"
                              @change="saveAnswer(question.answer, 'yes_or_no')"
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
                            </el-radio-group>
                          </div>
                          <div v-else-if="question.answer_type === 'open_ended'">
                            <el-input
                              v-model="question.answer.open_ended_answer"
                              type="textarea"
                              placeholder="Type your response here..."
                              style="width: 100%"
                              @blur="saveAnswer(question.answer, 'open_ended_answer')"
                            />

                          </div>
                          <div v-else>
                            <el-radio-group
                              v-model="question.answer.yes_or_no"
                              @change="saveAnswer(question.answer, 'yes_or_no')"
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
                            </el-radio-group>
                            <br>
                            <el-input
                              v-model="question.answer.open_ended_answer"
                              type="textarea"
                              placeholder="Give some details here..."
                              style="width: 100%"
                              @blur="saveAnswer(question.answer, 'open_ended_answer')"
                            />
                            <hr>
                          </div>
                        </div>
                        <div v-else>
                          <strong>Response:</strong>&nbsp;{{ question.answer.yes_or_no }}<br><br>
                          {{ question.answer.open_ended_answer }}
                        </div>

                      </div>
                      <div v-else>
                        <strong>Response:</strong>&nbsp;{{ question.answer.yes_or_no }}<br><br>
                        {{ question.answer.open_ended_answer }}
                      </div>
                    </div>
                  </div>

                  <el-popover
                    v-if="!isAdmin && question.answer.is_exception === 0 && selectedProject.is_completed === 0 && question.can_have_exception === 1"
                    placement="right"
                    width="400"
                    trigger="click"
                  >
                    <div>
                      <strong>Kindly justify why it is not applicable, then click on DONE</strong>
                      <el-input
                        v-model="exceptionReason"
                        placeholder="Type justification here..."
                        type="textarea"
                      />
                      <br><br>
                      <el-button
                        :loading="loadButton"
                        size="mini"
                        type="success"
                        :disabled="exceptionReason === ''"
                        @click="createException(clause.id, question.answer.id, index, question_index)"
                      >
                        Done
                      </el-button>
                    </div>
                    <el-button
                      slot="reference"
                      size="mini"
                      type="danger"
                    >
                      Click if Control/Requirement is NOT APPLICABLE
                    </el-button>
                  </el-popover>
                </div>
                <div v-else>
                  <el-alert
                    v-if="!isAdmin"
                    type="error"
                    :closable="false"
                  >
                    <strong>Not Applicable</strong>. To undo, click on the <code>EXCLUSIONS</code> tab and reverse it
                  </el-alert>
                  <el-alert
                    v-else
                    type="error"
                    :closable="false"
                  >
                    <strong>Not Applicable</strong>
                  </el-alert>
                </div>
                <!-- <div>
                  <div
                    v-if="question.answer.remark !== null"
                  >

                    <hr>
                    <strong>Remark on this response: </strong>
                    <div
                      style="padding: 5px; border: 2px solid #409EFF; border-radius: 8px; margin: 5px;"
                    >

                      {{ question.answer.remark }}
                    </div>
                  </div>
                  <hr>
                </div> -->
              </el-col>
              <el-col
                :lg="8"
                :md="8"
                :sm="24"
                :xs="24"
              >
                <div
                  v-if="question.upload_evidence === 1"
                  style="height: 300px; overflow: auto; background: #fcfcfc; padding: 10px;"
                >
                  <b-button
                    v-if="!isAdmin"
                    variant="gradient-primary"
                    block
                    @click="addEvidence(question.answer.id)"
                  >
                    <feather-icon icon="UploadIcon" />
                    Upload Evidence
                  </b-button>
                  <div v-if="isAdmin">
                    Uploaded Evidences
                  </div>
                  <hr>
                  <b-alert
                    v-for="(evidence, evidence_index) in question.answer.evidences"
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
                        @click="destroyGapAssessmentEvidence(evidence.id)"
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
      </template>
    </app-collapse-item>
    <give-gap-assessment-remarks
      v-if="showRemarkModal"
      v-model="showRemarkModal"
      :answer="selectedAnswerForRemark"
      :is-admin="isAdmin"
      @reload="fetchClausesWithQuestions"
    />
    <b-modal
      v-model="showModal"
      title="Upload Evidence"
      centered
      size="lg"
      hide-footer
    >

      <upload-gap-assessment-evidence
        :answer-id="selectedAnswer"
        @reload="fetchClausesWithQuestions"
      />

    </b-modal>
  </app-collapse>
</template>
<script>
import {
  BButton, BModal, BAlert,
} from 'bootstrap-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import UploadGapAssessmentEvidence from './UploadGapAssessmentEvidence.vue'
import GiveGapAssessmentRemarks from './GiveGapAssessmentRemarks.vue'
import Resource from '@/api/resource'

export default {
  components: {
    AppCollapse,
    AppCollapseItem,
    BButton,
    BAlert,
    BModal,
    UploadGapAssessmentEvidence,
    GiveGapAssessmentRemarks,
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
      clauses: [],
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
    this.fetchClausesWithQuestions()
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
    fetchClausesWithQuestions(load = true) {
      const app = this
      app.showRemarkModal = false
      app.loading = load
      const { client_id } = app.selectedProject
      const { standard_id } = app.selectedProject
      const fetchConsultingsResource = new Resource('clauses/fetch-clauses-with-questions')
      fetchConsultingsResource.list({ client_id, standard_id })
        .then(response => {
          app.clauses = response.clauses
          app.loading = false
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
      // document.getElementById(`quest_button_${index}_${value}`).style.backgroundColor = '#337ab7'
      // eslint-disable-next-line no-plusplus
      // for (let a = 0; a < count; a++) {
      //   if (value !== a) {
      //     this.colorButton(index, a)
      //   }
      // }
      // jQuery('#preview').hide();
      // jQuery('#back_to_quest').hide();
    },
    saveAnswer(answer, field) {
      // console.log(answer[field])
      const param = { answer: answer[field], field }
      const fetchConsultingsResource = new Resource('answers/update')
      fetchConsultingsResource.update(answer.id, param)
        .then(() => {})
    },
    submitAnswers(questions) {
      const message = 'Click OK to confirm submit action. You will not be able to modify responses once you submit'
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const answerIds = []
        questions.forEach(question => {
          answerIds.push(question.answer.id)
        })
        const param = { answer_ids: answerIds, value: 1 }
        const submitAnswersResource = new Resource('answers/submit')
        submitAnswersResource.store(param)
          .then(() => {
            this.fetchClausesWithQuestions()
            this.$emit('reloadAnalytics')
          })
      }
    },
    createException(clauseId, answerId, clauseIndex, questionIndex) {
      const app = this
      app.loadButton = true
      const param = {
        project_id: app.selectedProject.id, clause_id: clauseId, type: 'answer', answer_id: answerId, reason: app.exceptionReason,
      }
      const createExceptionResource = new Resource('exceptions/create')
      createExceptionResource.store(param)
        .then(() => {
          const clause = app.clauses[clauseIndex]
          clause.questions[questionIndex].answer.is_exception = 1
          app.loadButton = false
          app.$emit('reloadAnalytics')
        })
    },
    saveRemark(answerId, clauseIndex, questionIndex) {
      const app = this
      app.loadButton = true
      const remark = app.adminRemark
      const param = { remark }
      const saveRemarkResource = new Resource('answers/remark-on-answer')
      saveRemarkResource.update(answerId, param)
        .then(() => {
          const clause = app.clauses[clauseIndex]
          clause.questions[questionIndex].answer.remark = remark
          app.loadButton = false
          app.adminRemark = ''
        })
    },
    allowModification(questions) {
      const message = 'Click OK to confirm that you allow the modification of this response'
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        const answerIds = []
        questions.forEach(question => {
          answerIds.push(question.answer.id)
        })
        const param = { answer_ids: answerIds, value: 0 }
        const submitAnswersResource = new Resource('answers/submit')
        submitAnswersResource.store(param)
          .then(() => {
            this.$message('Modification Enabled')
            this.fetchClausesWithQuestions()
            this.$emit('reloadAnalytics')
          })
      }
    },
    destroyGapAssessmentEvidence(id) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this document? This cannot be recovered')) {
        app.loadDelete = true
        const destroyEvidenceResource = new Resource('answers/destroy-gap-assessment-evidence')
        destroyEvidenceResource.destroy(id)
          .then(() => {
            app.fetchClausesWithQuestions(false)
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
