<template>
  <div style="padding: 20px;">

    <el-collapse
      accordion
      @change="handleCollapseChange"
    >
      <el-collapse-item
        v-for="(questions, index) in categorized_questions"
        :key="index"
        :name="index"
      >
        <template slot="title">
          <strong>{{ index }}</strong>
        </template>
        <el-row :gutter="20">
          <el-col
            v-loading="loading"
            :md="16"
          >

            <em>Note: You are required to make your selection from a particular category and SAVE before going to the next category</em>
            <p />
            <aside>
              <el-table
                ref="multipleTable"
                :data="questions"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  style="background: #000000;"
                />
                <el-table-column
                  label="Audit Question"
                  prop="question"
                >
                  <template slot-scope="scope">
                    <div>
                      <div style="background: #333333; color: #ffffff; padding: 10px; border-radius: 5px">
                        <p>Question: {{ scope.row.question }}</p>
                      </div>

                      <p v-if="scope.row.key !== null">
                        Key/Hint: {{ scope.row.key }}
                      </p>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </aside>
          </el-col>
          <el-col :md="8">
            <div v-if="multipleSelection.length > 0">
              <b-button
                variant="primary"
                class="pull-right"
                @click="submit"
              >
                Save
              </b-button>
              <h4>Selected Requirements</h4>
            </div>
            <div
              v-if="multipleSelection.length > 0"
              v-loading="saving"
              style="background: #f0f0f0; padding: 10px;; margin-top: 30px"
            >
              <b-list-group>
                <b-list-group-item
                  v-for="(selection, select_index) in multipleSelection"
                  :key="select_index"
                >
                  <div>
                    <small style="font-weight: 900">{{ selection.question }}</small>
                  </div>
                </b-list-group-item>
              </b-list-group>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>
<script>
import {
  BButton, BListGroup, BListGroupItem,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

export default {
  components: {
    BButton,
    BListGroup,
    BListGroupItem,
    // EditVendor,
    // EditVendorUser,
  },
  data() {
    return {
      form: {
        questions: [],
      },
      categorized_questions: [],
      multipleSelection: [],
      selected_questions: [],
      search: '',
      loading: false,
      saving: false,
    }
  },
  created() {
    this.fetchQuestions()
  },
  methods: {
    fetchQuestions() {
      const app = this
      app.loading = true
      const fetchQuestionsResource = new Resource('vdd/questions/fetch-default-questions')
      fetchQuestionsResource.list()
        .then(response => {
          app.loading = false
          app.categorized_questions = response.questions
        })
    },
    handleSelectionChange(val) {
      const app = this
      app.multipleSelection = val
    },
    handleCollapseChange() {
      const app = this
      app.multipleSelection = []
    },
    performSearch() {
      const app = this
      const { search } = app
      this.questions.filter(data => !search || data.question.toLowerCase().includes(search.toLowerCase()))
    },
    submit() {
      const app = this
      app.saving = true
      const saveQuestionSetupResource = new Resource('vdd/questions/save-imported-questions')
      const param = app.form
      param.questions = app.multipleSelection
      saveQuestionSetupResource.store(param)
        .then(() => {
          app.saving = false
          app.$notify({ title: 'Questions Imported Successfully', type: 'success' })
          app.multipleSelection = []
        })
    },
  },
}
</script>
