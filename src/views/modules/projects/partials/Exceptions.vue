<template>
  <el-card>
    <v-client-table
      v-model="exceptions"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="detail"
        slot-scope="{row}"
      >
        <div v-if="row.answer_id !== null">
          <!--eslint-disable-next-line vue/no-v-html-->
          <span v-html="row.answer.question.question" />
        </div>
        <div v-if="row.upload_id !== null">
          {{ row.upload.template_title }}
        </div>
      </div>
      <div
        slot="type"
        slot-scope="{row}"
      >
        <div v-if="row.answer_id !== null">
          Audit Question
        </div>
        <div v-if="row.upload_id !== null">
          Document
        </div>
      </div>
      <div
        slot="action"
        slot-scope="props"
      >
        <el-tooltip
          v-if="!isAdmin && selectedProject.is_completed === 0"
          content="Reverse"
          placement="bottom-start"
        >
          <b-button
            variant="gradient-warning"
            class="btn-icon rounded-circle"
            @click="reverseException(props.row)"
          >
            <feather-icon icon="CornerUpLeftIcon" />
          </b-button>
        </el-tooltip>
      </div>
    </v-client-table>
    <el-row :gutter="20">
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="query.page"
        :limit.sync="query.limit"
        @pagination="fetchExceptions"
      />
    </el-row>
  </el-card>
</template>

<script>
import {
  BButton,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import Pagination from '@/views/components/Pagination-main/index.vue'

export default {
  components: {
    // VueGoodTable,
    Pagination,
    BButton,
  },
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
      isCreateQuestionSidebarActive: false,
      isEditQuestionSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'clause.name',
        'type',
        'detail',
        'reason',
        'action',
      ],

      options: {
        headings: {
          'clause.name': 'Clause',
        },
        pagination: {
          dropdown: true,
          chunk: 10,
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        sortable: [
          'clause.name',
        ],
        // filterable: false,
        filterable: [
          'clause.name',
        ],
      },
      exceptions: [],
      searchTerm: '',
      editable_row: '',
      selected_row_index: '',
      standards: [],
      query: {
        page: 1,
        limit: 50,
      },
      total: 0,
    }
  },
  created() {
    this.fetchExceptions()
  },
  methods: {
    fetchExceptions() {
      const app = this
      const { limit, page } = this.query
      const param = this.query
      param.client_id = app.selectedProject.client_id
      param.project_id = app.selectedProject.id
      app.loading = true
      const fetchQuestionsResource = new Resource('exceptions/fetch')
      fetchQuestionsResource.list(param)
        .then(response => {
          app.exceptions = response.exceptions.data
          app.exceptions.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.exceptions.total
          app.loading = false
        })
    },
    reverseException(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to reverse this entry?')) {
        app.loading = true
        const destroyQuestionsResource = new Resource('exceptions/reverse')
        destroyQuestionsResource.destroy(row.id)
          .then(() => {
            app.fetchExceptions()
            app.$emit('reloadAnalytics')
            app.loading = false
          })
      }
    },
    updateEditedTableRow() {
      const app = this
      app.fetchQuestions()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
