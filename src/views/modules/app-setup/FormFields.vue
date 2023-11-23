<template>
  <div v-loading="loader">
    <div slot="header">
      <el-row>
        <span class="pull-right">
          <el-button
            v-if="!add_form_field"
            type="primary"
            @click="add_form_field = true"
          >
            <feather-icon
              icon="PlusIcon"
              class="mr-50"
            />
            <span class="align-middle">Add Form Fields</span>
          </el-button>
          <el-button
            v-if="add_form_field"
            type="danger"
            @click="add_form_field = false"
          >
            <feather-icon
              icon="XIcon"
              class="mr-50"
            />
            <span class="align-middle">Cancel</span>
          </el-button>
        </span>
      </el-row>
    </div>
    <v-client-table
      v-if="!add_form_field"
      v-model="form_fields"
      :columns="columns"
      :options="options"
    >
      <div
        slot="action"
        slot-scope="props"
      >
        <!-- <b-button
          variant="gradient-warning"
          class="btn-icon rounded-circle"
          @click="editThisRow(props.row)"
        >
          <feather-icon icon="EditIcon" />
        </b-button> -->
        <el-button
          type="danger"
          circle
          @click="destroyRow(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </el-button>
      </div>
    </v-client-table>
    <div v-if="add_form_field">
      <add-form-fields @save="updateTable" />
    </div>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import AddFormFields from './partials/AddFormFields.vue'

export default {
  components: {
    AddFormFields,
  },
  data() {
    return {
      form_fields: [],
      columns: [
        'label', 'input_type', 'is_required', 'available_options', 'action', /* 'data_type', 'min_count', 'max_count', */
      ],

      options: {
        headings: {
        },
        // pagination: {
        //   dropdown: true,
        //   chunk: 10,
        // },
        filterByColumn: true,
        texts: {
          filter: 'Search:',
        },
        // editableColumns:['name', 'category.name', 'sku'],
        sortable: ['label'],
        filterable: ['label', 'available_options'],
      },
      loader: false,
      add_form_field: false,
    }
  },
  mounted() {
    this.fetchFormFields()
  },
  methods: {

    fetchFormFields() {
      const app = this
      app.loader = true

      const fetchFormFieldsResource = new Resource('custom-fields')
      fetchFormFieldsResource
        .list()
        .then(response => {
          app.form_fields = response.form_fields
          app.loader = false
        })
        .catch(error => {
          app.loader = false
          console.log(error)
        })
    },
    updateTable() {
      this.add_form_field = false
      this.fetchFormFields()
    },
    destroyRow(row) {
      const app = this

      // eslint-disable-next-line no-alert
      if (window.confirm('Are you sure you want to delete this entry?')) {
        app.loader = true
        const destroyQuestionsResource = new Resource('custom-fields/destroy')
        destroyQuestionsResource.destroy(row.id)
          .then(() => {
            app.fetchFormFields()
            app.loader = false
          })
      }
    },
  },
}
</script>
