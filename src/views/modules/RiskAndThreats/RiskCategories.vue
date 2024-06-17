<!-- eslint-disable vue/html-indent -->
<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside
      width="300px"
      style="background-color: #fcfcfc;"
    >
      <div style="text-align: center; background-color: #000000; color: #ffffff; border-top-left-radius: 5px; border-top-right-radius: 5px;">
        <span>Risk Categories</span>
      </div>
      <aside>
        <el-input
          v-model="filterText"
          placeholder="Filter keyword"
        />
      </aside>
      <el-tree
        ref="tree"
        class="filter-tree"
        :highlight-current="true"
        :accordion="true"
        :data="categories"
        :props="treeProps"
        :filter-node-method="filterNode"
        @node-click="viewDetails"
      />
      <!-- <el-menu
        background-color="#fcfcfc"
        text-color="#00000"
      >
        <el-menu-item
          v-for="(category, index) in categories"
          :key="index"
          :index="index"
          @click="viewDetails(category)"
        >
          <span slot="title">{{ category.name }}</span>
        </el-menu-item>
      </el-menu> -->
    </el-aside>

    <el-container
      v-loading="loading"
    >
      <el-header
        style="text-align: right; font-size: 12px; padding: 10px"
      >
        <el-button
          type="primary"
          plain
          size="mini"
          @click="createNew()"
        >
          Create New
        </el-button>
      </el-header>

      <el-main>
        <div>
          <el-form
            label-position="left"
            label-width="150px"
            :model="form"
          >
            <el-form-item>
              <h3 v-if="isEdit">
                Edit Risk Category
              </h3>
              <h3 v-else>
                Create New Risk Category
              </h3>
            </el-form-item>
            <el-form-item label="Title">
              <el-input
                v-model="form.name"
                placeholder="Enter Category Title"
              />
            </el-form-item>
            <el-form-item label="Sub-Categories">
              <el-tag
                v-for="sub_category in sub_categories"
                :key="sub_category"
                closable
                type="success"
                :disable-transitions="false"
                @close="handleClose(sub_category)"
              >
                {{ sub_category }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="saveTagInput"
                v-model="inputValue"
                class="input-new-tag"
                placeholder="Type sub category"
                size="mini"
                style="width: 30%"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >
                + Add New
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="isEdit"
                :disabled="form.name === ''"
                type="primary"
                style="width: 30%"
                @click="updateEntry(form.id)"
              >
                Update
              </el-button>
              <el-button
                v-else
                type="success"
                :disabled="form.name === ''"
                style="width: 30%"
                @click="submitEntry()"
              >
                Save
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    selectedClient: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: { name: '', sub_categories: [] },
      categories: [],
      sub_categories: [],
      loading: false,
      isEdit: false,
      treeProps: {
        children: 'sub_categories',
        label: 'name',
      },
      inputVisible: false,
      inputValue: '',
      filterText: '',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  created() {
    this.fetchCategory()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      const valLowercase = value.toLowerCase()
      const dataLowercase = data.name.toLowerCase()
      return dataLowercase.indexOf(valLowercase) !== -1
    },
    handleClose(tag) {
      this.sub_categories.splice(this.sub_categories.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const { inputValue } = this
      if (inputValue) {
        this.sub_categories.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    createNew() {
      const app = this
      app.isEdit = false
      app.form = { name: '', sub_categories: [] }
      app.sub_categories = []
    },
    viewDetails(category) {
      if (category.id) {
        const app = this
        app.form = category
        const subCategories = []
        if (category.sub_categories !== null) {
          category.sub_categories.forEach(subCat => {
            subCategories.push(subCat.name)
          })
        }
        app.sub_categories = subCategories
        app.isEdit = true
      }
    },
    fetchCategory() {
      const app = this
      const fetchEntryResource = new Resource('risk-assessment/fetch-categories')
      app.loading = true
      fetchEntryResource.list({ client_id: app.selectedClient.id })
        .then(response => {
          app.categories = response.categories
          // eslint-disable-next-line prefer-destructuring
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    submitEntry() {
      const app = this
      const saveEntryResource = new Resource('risk-assessment/save-categories')
      app.loading = true
      const { form } = app
      form.client_id = app.selectedClient.id
      form.sub_categories = app.sub_categories
      saveEntryResource.store(form)
        .then(() => {
          app.fetchCategory()
          app.loading = false
          app.$notify('Saved')
          app.form = { name: '', sub_categories: [] }
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    updateEntry(id) {
      const app = this
      const saveEntryResource = new Resource('risk-assessment/update-category')
      app.loading = true
      const { form } = app
      form.client_id = app.selectedClient.id
      form.sub_categories = app.sub_categories
      saveEntryResource.update(id, form)
        .then(() => {
          app.fetchCategory()
          app.$notify('Updated')
          app.loading = false
        })
        .catch(error => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    deleteEntry(row) {
      const app = this
      // eslint-disable-next-line no-alert
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('risk-assessment/delete-category')
        app.loading = true
        saveEntryResource.destroy(row.id)
          .then(() => {
            app.fetchCategory()
            app.loading = false
          })
          .catch(error => {
          // console.log(error.response)
            app.$message.error(error.response.data.error)
            app.loading = false
          })
      }
    },
  },
}
</script>
<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
