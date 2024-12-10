<template>

  <div v-if="showDocumentEditor !== 'none'">
    <div>
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
    </div>
    <div>
      <vue-document-editor
        v-if="showDocumentEditor === 'word'"
        :document-path="selectedDocument.link"
        :document-title="selectedDocument.template_title"
      />
      <vue-spreadsheet-editor
        v-if="showDocumentEditor === 'spreadsheet'"
        :document-path="selectedDocument.link"
        :document-title="selectedDocument.template_title"
      />
    </div>
  </div>
  <div
    v-else
  >
    <el-skeleton
      :loading="loading"
      :rows="5"
      animated
    />
    <el-collapse
      accordion
      type="border"
    >
      <el-collapse-item
        v-for="(clause, index) in clauses"
        :key="index"
      >
        <template slot="title">
          <div>
            <feather-icon
              icon="CheckCircleIcon"
              size="25"
            />
            <strong style="font-size: 16px">&nbsp;&nbsp;{{ `${clause.name} - ${clause.description}` }}</strong>
          </div>
        </template>
        <template v-for="(question, question_index) in clause.questions">

          <div
            :key="question_index"
          >
            <div v-if="(userData.id === question.answer.assignee_id) || userData.all_roles.includes('admin')">
              <div
                v-if="currenctQuestions[index] === question_index"
                class="col-lg-12 col-md-12 col-sm-12 col-xs-12 "
                style="padding: 5px; border: 5px double #c0c0c0;border-radius: 8px;"
              >

                <span
                  style="cursor: pointer;"
                  @click="setAssignee(question.answer)"
                >
                  <el-alert
                    v-if="question.answer.assignee !== null"
                    type="success"
                    :closable="false"
                    center
                    show-icon
                    :title="`Assigned to ${question.answer.assignee.name}`"
                    description="Click to reassign a personnel"
                  />
                  <el-alert
                    v-else
                    type="warning"
                    :closable="false"
                    center
                    show-icon
                    title="Not Assigned"
                    description="Click to assign a personnel"
                  />
                </span>
                <div>

                  <span
                    class="pull-right"
                  >
                    <el-dropdown>
                      <b-button
                        variant="flat"
                        class="btn-icon rounded-circle"
                      >
                        <feather-icon
                          icon="MoreVerticalIcon"
                          size="25"
                        />
                      </b-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <span @click="openRemarkModal(question.answer)"><feather-icon icon="MessageSquareIcon" /> View Remarks</span>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="userData.all_roles.includes('admin')">
                          <span @click="setAssignee(question.answer)"><feather-icon icon="UserCheckIcon" /> Assign Task</span>
                        </el-dropdown-item>
                        <el-dropdown-item v-if="userData.all_roles.includes('admin') && question.answer.is_submitted === 1">
                          <span @click="allowModification(clause.questions);"><feather-icon icon="ThumbsUpIcon" /> Enable Modification</span>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
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
                  <!-- <b-button
                    v-if="isAdmin"
                    variant="success"
                    @click="allowModification(clause.questions);"
                  ><feather-icon
                    icon="ThumbsUpIcon"
                  />
                    Enable Modification
                  </b-button> -->
                  </span>
                  <strong style="color: red">
                    Question {{ question_index + 1 }}  of  {{ clause.questions.length }}
                  </strong>

                  <div>
                    <b-button
                      v-if="question_index !== 0"
                      variant="outline-secondary"
                      size="sm"
                      @click="change(question_index-1, index);"
                    > <feather-icon
                      icon="ChevronLeftIcon"
                    />
                    </b-button>
                    <b-button
                      v-if="parseInt(question_index + 1) < clause.questions.length"
                      variant="outline-secondary"
                      size="sm"
                      style="margin-left: 2px"
                      @click="change(question_index+1, index);"
                    >
                      <feather-icon
                        icon="ChevronRightIcon"
                      />
                    </b-button>
                    <button
                      v-if="parseInt(question_index + 1) === clause.questions.length && question.answer.is_submitted === 0 && selectedProject.is_completed === 0"
                      class="btn btn-success  btn-sm"
                      style="margin-left: 2px"
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
                    <div v-if="showQuestions">
                      <em v-if="question.section">
                        {{ `${question.section.name} - ${question.section.description}` }}
                      </em>
                      <ckeditor
                        id="question"
                        v-model="question.question"
                        :editor="editor"
                        :config="editorConfig"
                        disabled
                      /></div>
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
                          <div>

                            <div v-if="question.answer.is_submitted === 0">
                              <!-- <div v-if="question.answer_type === 'yes-no'">
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

                              </div> -->
                              <!-- <div v-else> -->
                              <div>
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
                                <el-popover
                                  v-if="question.answer.is_exception === 0 && selectedProject.is_completed === 0 && question.can_have_exception === 1"
                                  placement="right"
                                  width="400"
                                  trigger="click"
                                >
                                  <div style="background: #000000; color: #ffffff; padding: 10px; text-align: left; border-radius: 5px;">
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
                                      type="primary"
                                      :disabled="exceptionReason === ''"
                                      @click="createException(clause.id, question.answer.id, index, question_index)"
                                    >
                                      Done
                                    </el-button>
                                  </div>
                                  <el-button
                                    slot="reference"
                                    type="default"
                                    style="margin-left: 10px"
                                  >
                                    NOT APPLICABLE
                                  </el-button>
                                </el-popover>
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
                        <!-- <div v-else>
                          <strong>Response:</strong>&nbsp;{{ question.answer.yes_or_no }}<br><br>
                          {{ question.answer.open_ended_answer }}
                        </div> -->
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <el-alert
                        type="error"
                        :closable="false"
                      >
                        <strong>Not Applicable</strong>. To undo, click on the <code>EXCLUSIONS</code> tab and reverse it
                      </el-alert>
                    <!-- <el-alert
                      v-else
                      type="error"
                      :closable="false"
                    >
                      <strong>Not Applicable</strong>
                    </el-alert> -->
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
                      v-if="question.expected_document_template_ids.length > 0"
                      v-loading="loadDelete"
                      style="height: 300px; overflow: auto; background: #fcfcfc; padding: 10px; border-radius: 8px;"
                    >
                      <h4>Expected Evidences ({{ question.expected_document_template_ids.length }})</h4>
                      <b-list-group>
                        <b-list-group-item
                          v-for="(template_id, template_index) in question.expected_document_template_ids"
                          :key="template_index"
                        >
                          <div v-if="uploads !== null">
                            <small style="font-weight: 900">{{ uploads[template_id][0].template_title }}</small>
                            <span
                              class="pull-right"
                            >
                              <b-badge
                                v-if="uploads[template_id][0].link !== null"
                                variant="success"
                              >
                                <feather-icon
                                  icon="CheckCircleIcon"
                                />
                              </b-badge>
                              <b-badge
                                v-else
                                variant="danger"
                              >
                                <feather-icon
                                  icon="AlertCircleIcon"
                                />
                              </b-badge>
                              <el-dropdown>
                                <b-button
                                  variant="flat"
                                  class="btn-icon rounded-circle"
                                >
                                  <i class="el-icon-more" />
                                <!-- <feather-icon
                                  icon="MoreHorizontalIcon"
                                /> -->
                                </b-button>
                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item>
                                    <a
                                      :href="baseServerUrl+'storage/'+uploads[template_id][0].template_link"
                                      target="_blank"
                                    ><feather-icon icon="DownloadIcon" /> Download Template
                                    </a>
                                  </el-dropdown-item>
                                  <el-dropdown-item v-if="uploads[template_id][0].link === null">
                                    <span @click="addEvidence(uploads[template_id][0])"><feather-icon icon="UploadIcon" /> Upload Evidence</span>
                                  </el-dropdown-item>
                                  <el-dropdown-item
                                    v-if="uploads[template_id][0].link !== null && (uploads[template_id][0].link.split('.').pop() === 'docx' || uploads[template_id][0].link.split('.').pop() === 'doc')"
                                  >
                                    <span @click="viewAndEditDocument(uploads[template_id][0], 'word')"><feather-icon icon="EditIcon" /> Update Evidence</span>
                                  </el-dropdown-item>

                                  <el-dropdown-item
                                    v-if="uploads[template_id][0].link !== null && (uploads[template_id][0].link.split('.').pop() === 'xlsx' || uploads[template_id][0].link.split('.').pop() === 'xls')"
                                  >
                                    <span @click="viewAndEditDocument(uploads[template_id][0], 'spreadsheet')"><feather-icon icon="EditIcon" /> Update Evidence</span>
                                  </el-dropdown-item>
                                  <el-dropdown-item v-if="uploads[template_id][0].link !== null">
                                    <a
                                      :href="baseServerUrl+'storage/'+uploads[template_id][0].link"
                                      target="_blank"
                                    ><feather-icon icon="DownloadIcon" /> Download Evidence
                                    </a>
                                  </el-dropdown-item>
                                <!-- <el-dropdown-item v-if="uploads[template_id][0].link !== null">
                                  <span @click="destroyGapAssessmentEvidence(uploads[template_id][0].id)"><feather-icon icon="TrashIcon" /> Delete Evidence</span>
                                </el-dropdown-item> -->
                                </el-dropdown-menu>
                              </el-dropdown>
                            </span>
                          </div>
                        </b-list-group-item>
                      </b-list-group>
                    </div>
                  </el-col>
                </el-row>
                <br>
                <div>
                  <template
                    v-for="(quest, q_index) in clause.questions"
                  >

                    <button
                      v-if="parseInt(question_index) === q_index"
                      :key="q_index"
                      :class="`btn btn-dark btn-sm`"
                      style="margin: 1px 1px 0 0"
                      @click="change(q_index, index);"
                    > {{ q_index + 1 }}
                    </button>
                    <button
                      v-else
                      :key="q_index"
                      :class="`btn ${(quest.answer.yes_or_no === null && quest.answer.is_exception === 0) ? 'btn-danger' : 'btn-primary'} btn-sm`"
                      style="margin: 1px 1px 0 0"
                      @click="change(q_index, index);"
                    > {{ q_index + 1 }}
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-collapse-item>
      <b-modal
        v-model="showRemarkModal"
        title="Consultant Remarks"
        centered
        size="md"
        hide-footer
      >

        <give-gap-assessment-remarks
          v-model="showRemarkModal"
          :answer="selectedAnswerForRemark"
          :is-admin="isAdmin"
          @reload="fetchClausesWithQuestions"
        />

      </b-modal>
      <b-modal
        v-model="showAssigneeModal"
        title="Assign Task To"
        centered
        size="md"
        hide-footer
      >
        <div v-loading="loadingTaskAssignment">
          <el-col :xs="24">
            <el-select
              v-model="assigneeForm.userId"
              placeholder="Select Personnel"
              filterable
              style="width: 100%;"
              @change="assignUserToRespond()"
            >
              <el-option
                v-for="(user, user_index) in clientUsers"
                :key="user_index"
                :value="user.id"
                :label="user.name"
              />
            </el-select>
            <hr>
          </el-col>
        </div>
      </b-modal>
      <b-modal
        v-if="showModal"
        v-model="showModal"
        :title="`Kindly upload your ${selectedUploadTemplate.template_title}`"
        centered
        size="lg"
        hide-footer
      >

        <upload-gap-assessment-evidence
          :upload-template="selectedUploadTemplate"
          @reload="fetchClausesWithQuestions(); showModal = false"
        />

      </b-modal>
      <b-modal
        v-if="enableDocumentuploadModal"
        v-model="enableDocumentuploadModal"
        title="Kindly upload the Expected Evidences"
        centered
        size="lg"
        hide-footer
      >

        <b-list-group v-if="pendingDocuments.length > 0">
          <b-list-group-item
            v-for="(pendingDocument, p_d_index) in pendingDocuments"
            :key="p_d_index"
          >
            <div>
              <small style="font-weight: 900">{{ pendingDocument.template_title }}</small>
              <span
                class="pull-right"
              >
                <el-tooltip
                  content="Click to upload"
                  placement="top"
                >
                  <b-button
                    variant="gradient-success"
                    class="btn-icon"
                    @click="addEvidence(pendingDocument)"
                  >
                    <feather-icon icon="UploadIcon" />
                  </b-button>
                </el-tooltip>
              </span>
            </div>
          </b-list-group-item>
        </b-list-group>
        <b-button
          v-else
          variant="gradient-secondary"
          @click="enableDocumentuploadModal = false"
        >
          <feather-icon icon="XIcon" /> Click to close
        </b-button>

      </b-modal>
    </el-collapse>
  </div>
</template>
<script>
import {
  BButton, BModal, BListGroup, BListGroupItem, BBadge,
} from 'bootstrap-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import AppCollapse from '@core/components/app-collapse/AppCollapse.vue'
// import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue'
import UploadGapAssessmentEvidence from './UploadGapAssessmentEvidence.vue'
import GiveGapAssessmentRemarks from './GiveGapAssessmentRemarks.vue'
import VueDocumentEditor from '@/views/components/editors/VueDocumentEditor.vue'
import VueSpreadsheetEditor from '@/views/components/editors/VueSpreadsheetEditor.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BBadge,
    BListGroup,
    BListGroupItem,
    // AppCollapse,
    // AppCollapseItem,
    BButton,
    BModal,
    UploadGapAssessmentEvidence,
    GiveGapAssessmentRemarks,
    VueDocumentEditor,
    VueSpreadsheetEditor,
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
      uploads: null,
      currenctQuestions: {},
      currentQuestionsAreSet: false,
      showQuestions: true,
      current_question: 0,
      selectedUploadTemplate: null,
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
      clientUsers: [],
      assigneeForm: {
        userId: '',
      },
      selectedAnswerId: '',
      showAssigneeModal: false,
      loadingTaskAssignment: false,
      pendingDocuments: [],
      enableDocumentuploadModal: false,
      selectedQuestionsforSubmission: [],
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    userData() {
      return this.$store.getters.userData
    },
  },
  created() {
    this.fetchClausesWithQuestions()
    this.fetchClientUsers()
  },
  methods: {
    setCurrentQuestions(clauses) {
      const app = this
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < clauses.length; index++) {
        app.currenctQuestions[index] = 0
      }
      app.currentQuestionsAreSet = true
    },
    change(value, index) {
      const app = this
      if (Object.hasOwnProperty.call(app.currenctQuestions, index)) {
        app.currenctQuestions[index] = value
      }
      app.showQuestions = false
      setTimeout(() => {
        app.showQuestions = true
      }, 5)
    },
    openRemarkModal(selectedAnswer) {
      const app = this
      app.selectedAnswerForRemark = selectedAnswer
      app.showRemarkModal = !app.showRemarkModal
    },
    addEvidence(uploadTemplate) {
      const app = this
      app.selectedUploadTemplate = uploadTemplate
      app.showModal = true
    },
    fetchClausesWithQuestions(load = true) {
      const app = this
      app.showRemarkModal = false
      app.loading = load
      const { client_id } = app.selectedProject
      const { standard_id } = app.selectedProject
      const { id } = app.selectedProject
      const fetchConsultingsResource = new Resource('ndpa/clauses/fetch-clauses-with-questions')
      fetchConsultingsResource.list({ client_id, standard_id, project_id: id })
        .then(response => {
          app.clauses = response.clauses
          app.uploads = response.uploads
          // we want to check for any evidence that are yet pending so that the modal will be updated
          app.checkForPendingDocumentUpload()
          if (!app.currentQuestionsAreSet) {
            app.setCurrentQuestions(app.clauses)
          }
          app.loading = false
        })
    },
    colorButton(index, current) {
      document.getElementById(`quest_button_${index}_${current}`).style.backgroundColor = '#ccc'
      // }
    },
    fetchClientUsers() {
      const app = this
      const fetchConsultingsResource = new Resource('clients/users')
      fetchConsultingsResource.list()
        .then(response => {
          app.clientUsers = response.users
        })
    },
    saveAnswer(answer, field) {
      // console.log(answer[field])
      const param = { answer: answer[field], field }
      const fetchConsultingsResource = new Resource('ndpa/answers/update')
      fetchConsultingsResource.update(answer.id, param)
        .then(() => {})
    },
    setAssignee(answer) {
      const app = this
      app.selectedAnswerId = answer.id
      app.assigneeForm.userId = answer.assignee_id
      app.showAssigneeModal = true
    },
    assignUserToRespond() {
      const app = this
      // console.log(answer[field])
      app.loadingTaskAssignment = true
      const param = { assignee_id: app.assigneeForm.userId }
      const fetchConsultingsResource = new Resource('ndpa/answers/assign-user-to-respond')
      fetchConsultingsResource.update(app.selectedAnswerId, param)
        .then(() => {
          app.fetchClausesWithQuestions(false)
          app.$message('Task assigned successfully')
          app.showAssigneeModal = false
          app.loadingTaskAssignment = false
        })
    },
    checkForPendingDocumentUpload() {
      const app = this
      const questions = app.selectedQuestionsforSubmission
      if (questions.length > 0) {
        const pendingDocuments = []
        questions.forEach(question => {
          const templateIds = question.expected_document_template_ids
          templateIds.forEach(templateId => {
            const { link } = app.uploads[templateId][0]
            if (link === null) {
              pendingDocuments.push(app.uploads[templateId][0])
            }
          })
        })
        app.pendingDocuments = pendingDocuments
        return pendingDocuments
      }
      return false
    },
    uploadPendingDocuments(documents) {
      const app = this
      app.pendingDocuments = documents
      app.enableDocumentuploadModal = true
    },
    submitAnswers(questions) {
      const app = this

      const answerIds = []
      let noAnswer = 0
      questions.forEach(question => {
        answerIds.push(question.answer.id)
        if ((question.answer.yes_or_no === null && question.answer.open_ended_answer === null) && question.answer.is_exception === 0) {
          noAnswer += 1
        }
      })

      if (noAnswer > 0) {
        app.$alert('Please respond to all questions in this part. The RED navigation button suggests the unanswered question', 'Incomplete Response')
        return
      }
      app.selectedQuestionsforSubmission = questions
      const pendingDocuments = app.checkForPendingDocumentUpload()

      if (pendingDocuments.length > 0) {
        app.uploadPendingDocuments(pendingDocuments)
        return
      }

      const message = 'Click OK to confirm submit action. You will not be able to modify responses once you submit'
      // eslint-disable-next-line no-alert
      if (window.confirm(message)) {
        app.$message('Response Submitted. Background assessment is on going.')
        const param = { answer_ids: answerIds, value: 1 }
        const submitAnswersResource = new Resource('ndpa/answers/submit')
        submitAnswersResource.store(param)
          .then(() => {
            this.fetchClausesWithQuestions(false)
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
      const createExceptionResource = new Resource('ndpa/exceptions/create')
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
      const saveRemarkResource = new Resource('ndpa/answers/remark-on-answer')
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
        const submitAnswersResource = new Resource('ndpa/answers/submit')
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
        const destroyEvidenceResource = new Resource('ndpa/answers/destroy-gap-assessment-evidence')
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
    viewAndEditDocument(data, type) {
      const app = this
      app.selectedDocument = data
      app.showDocumentEditor = type
    },
  },

}
</script>
