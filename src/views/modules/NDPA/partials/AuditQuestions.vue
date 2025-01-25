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
        :name="index"
      >
        <template slot="title">
          <div>
            <div v-if="answer_completion_status !== null && answer_completion_status[clause.id]">
              <b-avatar
                v-if="answer_completion_status[clause.id][0].pending === 0"
                variant="light-success"
              >
                <feather-icon
                  icon="CheckCircleIcon"
                  size="25"
                />
              </b-avatar>
              <b-avatar
                v-else
                variant="light-danger"
              >
                <feather-icon
                  icon="AlertCircleIcon"
                  size="25"
                />
              </b-avatar>
              <strong style="font-size: 16px">&nbsp;&nbsp;{{ `${clause.name} - ${clause.description}` }}</strong>
            </div>
            <div v-else>
              <b-avatar
                variant="light-danger"
              >
                <feather-icon
                  icon="AlertCircleIcon"
                  size="25"
                />
              </b-avatar>
              <strong style="font-size: 16px">&nbsp;&nbsp;{{ `${clause.name} - ${clause.description}` }}</strong>
            </div>
          </div>
        </template>
        <el-container
          v-if="clause.sections.length > 0"
          style="height: 100%; border: 1px solid #eee; background: #fff;"
        >
          <el-aside
            element-loading-text="loading assessment, please wait..."
            width="200px"
            style="padding: 1px !important"
          >
            <div>
              <el-menu>
                <el-submenu
                  v-for="(section, section_index) in clause.sections"
                  :key="section_index"
                  :index="`${index}-${section_index}`"
                >
                  <template slot="title">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="section.description"
                      placement="right"
                      :open-delay="500"
                    >
                      <strong>{{ section.name }}</strong>
                    </el-tooltip>
                  </template>
                  <el-button
                    v-if="userData.all_roles.includes('admin')"
                    type="text"
                    @click="assignQuestions(section.questions)"
                  >
                    <i class="el-icon-s-promotion" />
                    Assign Tasks
                  </el-button>
                  <template
                    v-for="(selectedQuestion, quest_index) in section.questions"
                  >

                    <el-menu-item
                      v-if="(userData.id === selectedQuestion.answer.assignee_id) || userData.all_roles.includes('admin') || isAdmin"
                      :key="quest_index"
                      :index="`${index}-${section_index}-${quest_index}`"
                      style="cursor: pointer;"
                      @click="viewQuestions(selectedQuestion, section, section_index, clause.id, index)"
                    >

                      <strong>
                        <i class="el-icon-caret-right" />

                        {{ `Question - #${selectedQuestion.id}` }}
                      </strong>
                    </el-menu-item>
                  </template>
                </el-submenu>

              </el-menu>
            </div>
          </el-aside>

          <el-container>
            <el-main v-loading="loadView">
              <div
                v-if="viewType === 'welcome'"
                align="center"
              >
                <b-avatar
                  variant="light-success"
                  size="100"
                >
                  <feather-icon
                    icon="HelpCircleIcon"
                    size="70"
                  />
                </b-avatar>
                <p>Click on a Section to access the Complaince Questions</p>
              </div>
              <div
                v-if="viewType === 'load'"
                align="center"
              >
                <h3>Question loading...</h3>
              </div>
              <div v-if="selectedClauseId === clause.id">
                <div v-if="question !== null">
                  <div>
                    <div>
                      <em><h5>{{ selectedSection.name }} - {{ selectedSection.description }}</h5></em>
                    </div>

                  </div>
                  <div v-if="(userData.id === question.answer.assignee_id) || userData.all_roles.includes('admin') || isAdmin">
                    <div
                      class="col-lg-12 col-md-12 col-sm-12 col-xs-12 "
                      style="margin-top: 15px; padding: 5px; border: 5px double #c0c0c0; border-radius: 8px;"
                    >

                      <span
                        v-if="userData.all_roles.includes('admin')"
                        style="cursor: pointer;"
                        @click="assignQuestions([question])"
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
                      <span v-else>
                        <el-alert
                          v-if="question.answer.assignee !== null"
                          type="success"
                          :closable="false"
                          center
                          show-icon
                          :title="`Assigned to ${question.answer.assignee.name}`"
                        />
                        <el-alert
                          v-else
                          type="warning"
                          :closable="false"
                          center
                          show-icon
                          title="Not Assigned"
                        />
                      </span>
                      <div>

                        <span
                          class="pull-right"
                        >
                          <b-button
                            v-if="userData.all_roles.includes('admin') && question.answer.is_submitted === 1"
                            variant="outline-success"
                            size="sm"
                            @click="allowModification([question]);"
                          ><feather-icon
                            icon="ThumbsUpIcon"
                          />
                            Enable Modification
                          </b-button>
                          <!-- <el-dropdown>
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
                              <el-dropdown-item v-if="userData.all_roles.includes('admin') && question.answer.is_submitted === 1">
                                <span @click="allowModification(questions);"><feather-icon icon="ThumbsUpIcon" /> Enable Modification</span>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown> -->
                        </span>

                        <div v-if="(userData.id === question.answer.assignee_id)">
                          <b-button
                            v-if="question.answer.is_submitted === 0 && selectedProject.is_completed === 0"
                            variant="primary"
                            size="sm"
                            @click="submitAnswers([question]);"
                          ><feather-icon
                            icon="SaveIcon"
                          />
                            Submit
                          </b-button>
                          <b-button
                            v-else
                            variant="outline-secondary"
                            size="sm"
                          ><feather-icon
                            icon="SaveIcon"
                          />
                            Submit
                          </b-button>

                        </div>
                        <div v-else>
                          <el-tag
                            v-if="question.answer.is_submitted === 0"
                            type="danger"
                            effect="plain"
                            :closable="false"
                          >Status: Not Submitted</el-tag>
                          <el-tag
                            v-else
                            type="success"
                            effect="plain"
                            :closable="false"
                          >Status: Submitted</el-tag>
                        </div>
                      </div>
                      <hr>
                      <el-row :gutter="5">
                        <el-col
                          :lg="15"
                          :md="15"
                          :sm="24"
                          :xs="24"
                        >
                          <div v-if="showQuestions">
                            <ckeditor
                              id="question"
                              v-model="question.question"
                              :editor="editor"
                              :config="editorConfig"
                              disabled
                            />
                          </div>
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

                                  <div v-if="(userData.id === question.answer.assignee_id) && question.answer.is_submitted === 0">
                                    <div v-if="question.answer.assignee_id !== null">
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
                                          <strong>Kindly justify why it is not applicable, then click on OK</strong>
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
                                            plain
                                            :disabled="exceptionReason === ''"
                                            @click="createException(clause.id, question.answer.id)"
                                          >
                                            OK
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
                          </div>
                        </el-col>
                        <el-col
                          :lg="9"
                          :md="9"
                          :sm="24"
                          :xs="24"
                        >
                          <div
                            v-if="question.expected_document_template_ids.length > 0"
                            v-loading="loadDelete"
                            style="max-height: 250px; overflow: auto; background: #fcfcfc; padding: 10px; border-radius: 8px;"
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
                                        <el-dropdown-item v-if="uploads[template_id][0].link !== null">
                                          <a
                                            :href="baseServerUrl+'storage/'+uploads[template_id][0].link"
                                            target="_blank"
                                          ><feather-icon icon="DownloadIcon" /> Download Evidence
                                          </a>
                                        </el-dropdown-item>
                                        <template v-if="(userData.id === question.answer.assignee_id) || userData.all_roles.includes('admin')">
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

                                        </template>

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
                      <el-row v-if="question.answer.is_submitted === 1">
                        <el-col :md="24">

                          <give-gap-assessment-remarks
                            :answer="question.answer"
                            :is-admin="userData.all_roles.includes('admin')"
                            @reload="fetchClausesWithQuestions"
                          />
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-container>
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
        title="Assign Tasks To Personnel(s)"
        centered
        size="xl"
        hide-footer
      >
        <div v-loading="loadingTaskAssignment">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Task (Question)</th>
                <th>Personnel</th>
                <th>Deadline</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(answer, ansIndex) in selectedAnswers"
                :key="ansIndex"
              >
                <td>
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <span v-html="answer.question" />
                </td>
                <td>
                  <el-select
                    v-model="answer.assignee_id"
                    placeholder="Select Personnel"
                    value-key="id"
                    filterable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="(user, user_index) in clientUsers"
                      :key="user_index"
                      :value="user.id"
                      :label="user.name"
                    />
                  </el-select>
                </td>
                <td>
                  <el-date-picker
                    v-model="answer.end_date"
                    placeholder="Select Due Date"
                    :picker-options="pickerOptions"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;"
                  />
                </td>
                <td>
                  <el-input
                    v-model="answer.comment"
                    placeholder="Give more clarification on what is expected of the assignee"
                    type="textarea"
                    style="width: 100%;"
                  />
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <b-button
                    @click="assignUserToRespond()"
                  >
                    Submit
                  </b-button>
                </td>
              </tr>
            </tbody>
          </table>
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
import moment from 'moment'
import {
  BButton, BModal, BListGroup, BListGroupItem, BBadge, BAvatar,
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
    BAvatar,
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 3600 * 1000 * 24)
        },
      },
      clauses: [],
      questions: [],
      question: null,
      answer_completion_status: null,
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
        user: null,
        userId: '',
        end_date: '',
        formerAssignee: '',
      },
      selectedAnswers: [],
      selectedAnswerId: '',
      showAssigneeModal: false,
      loadingTaskAssignment: false,
      pendingDocuments: [],
      enableDocumentuploadModal: false,
      selectedQuestionsforSubmission: [],
      loadView: false,
      viewType: 'welcome',
      selectedSection: null,
      selectedSectionIndex: null,
      selectedClauseId: null,
      selectedClauseIndex: null,
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
    if (this.userData.all_roles.includes('admin')) {
      this.fetchClientUsers()
    }
  },
  methods: {
    moment,
    viewQuestions(selectedQuestion, section, sectionIndex, clauseId, clauseIndex) {
      const app = this
      app.viewType = 'load'
      app.question = null
      app.loadView = true
      app.selectedClauseId = clauseId
      app.selectedClauseIndex = clauseIndex
      app.selectedSectionIndex = sectionIndex
      app.selectedSection = section
      setTimeout(() => {
        app.question = selectedQuestion
        app.loadView = false
        app.viewType = 'question'
      }, 10)
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
          app.answer_completion_status = response.answer_completion_status
          app.uploads = response.uploads
          // we need to do this to reload the questions after any action was taken
          if (app.selectedClauseIndex !== null) {
            app.questions = app.clauses[app.selectedClauseIndex].sections[app.selectedSectionIndex].questions
          }
          // we want to check for any evidence that are yet pending so that the modal will be updated
          app.checkForPendingDocumentUpload()
          app.loading = false
        })
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
    assignQuestions(questions) {
      const app = this
      const selectedAnswers = []
      questions.forEach(question => {
        selectedAnswers.push({
          question: question.question,
          id: question.answer.id,
          assignee_id: question.answer.assignee_id,
          end_date: question.answer.end_date,
          comment: '',

        })
      })

      app.selectedAnswers = selectedAnswers
      // app.assigneeForm.user = answer.assignee
      // app.assigneeForm.userId = answer.assignee_id
      // app.assigneeForm.formerAssignee = (answer.assignee) ? answer.assignee.name : ''
      app.showAssigneeModal = true
    },
    assignSection() {
    },
    assignUserToRespond() {
      const app = this
      // console.log(answer[field])
      this.$confirm('This will unassign the previous personnel from the task. Continue?', 'Warning', {
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        app.loadingTaskAssignment = true
        const param = { answers: app.selectedAnswers }
        const fetchConsultingsResource = new Resource('ndpa/answers/assign-user-to-respond')
        fetchConsultingsResource.store(param)
          .then(() => {
            app.fetchClausesWithQuestions(false)
            // app.question.answer.assignee = app.assigneeForm.user
            app.$message('Task assigned successfully')
            app.showAssigneeModal = false
            app.loadingTaskAssignment = false
          }).catch(() => {
            app.loadingTaskAssignment = false
            this.$message({
              type: 'danger',
              message: 'An error occured',
            })
          })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Action canceled',
        // })
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
        app.$alert('Please respond to the question', 'No Response')
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
          .then(response => {
            app.viewType = 'load'
            // this.fetchClausesWithQuestions(false)
            setTimeout(() => {
              app.question = response.question
              app.viewType = 'question'
            }, 10)
            this.$emit('reloadAnalytics')
          })
      }
    },
    createException(clauseId, answerId) {
      const app = this
      app.loadButton = true
      const param = {
        project_id: app.selectedProject.id, clause_id: clauseId, type: 'answer', answer_id: answerId, reason: app.exceptionReason,
      }
      const createExceptionResource = new Resource('ndpa/exceptions/create')
      createExceptionResource.store(param)
        .then(() => {
          app.question.answer.is_exception = 1
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
          app.questions[questionIndex].answer.remark = remark
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
