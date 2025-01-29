<template>
  <el-card>
    <div slot="header">
      <b-row>
        <b-col
          cols="6"
        >
          <h4>Modules & Packages</h4>
        </b-col>
      </b-row>
    </div>
    <!-- table -->
    <h4>Click on the <code>+</code> sign to manage packages</h4>
    <v-client-table
      v-model="modules"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <div
        slot="child_row"
        slot-scope="{row}"
      >
        <el-row :gutter="20">
          <el-col :md="6">
            <el-card>
              <div slot="header">
                Features of the {{ row.name }} Module
              </div>
              <el-timeline>
                <el-timeline-item
                  v-for="(feature, index) in row.features"
                  :key="index"
                  icon="el-icon-check"
                  color="#0bbd87"
                  size="large"
                >
                  {{ feature.name }}
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-col>
          <el-col
            v-if="checkRole(['super'])"
            :md="18"
          >
            <el-tabs type="border-card">
              <el-tab-pane label="Manage Packages">

                <b-button
                  variant="outline-primary"
                  class="btn-icon"
                  @click="createPackage(row, null, 'Create')"
                >
                  <feather-icon icon="PlusIcon" /> Create
                </b-button>
                <div v-if="row.packages.length > 0">
                  <table class="table">
                    <thead>
                      <tr>
                        <th />
                        <th
                          v-for="(pack, package_index) in row.packages"
                          :key="package_index"
                        >
                          <div>
                            <h3>{{ pack.name }}</h3>
                            <span
                              @click="createPackage(row, pack, 'Update')"
                            >
                              <feather-icon
                                color="#1858b8"
                                size="20"
                                icon="EditIcon"
                              />
                            </span>
                            <span>&nbsp;&nbsp;</span>
                            <span
                              @click="deletePackage(pack)"
                            >
                              <feather-icon
                                color="#f00000"
                                size="20"
                                icon="TrashIcon"
                              />
                            </span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(feature, feature_index) in row.features"
                        :key="feature_index"
                      >
                        <td width="400">
                          <strong>{{ feature.name }}</strong>
                        </td>
                        <th
                          v-for="(pack, package_index) in row.packages"
                          :key="package_index"
                        >
                          <span v-if="pack.features.includes(feature.id)">
                            <feather-icon
                              size="20"
                              color="#30b036"
                              icon="CheckIcon"
                            />
                          </span>
                          <span v-else>
                            <feather-icon
                              size="20"
                              color="#C03639"
                              icon="XIcon"
                            />
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <td>SUBSCRIPTION COST (₦)</td>
                        <td
                          v-for="(pack, package_index) in row.packages"
                          :key="package_index"
                        >
                          <strong>{{ parseFloat(pack.price).toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else>
                  <el-empty description="No package is created yet" />
                </div>
              </el-tab-pane>
              <el-tab-pane label="Activated Partners">
                <b-button
                  variant="outline-primary"
                  class="btn-icon"
                  @click="addModule(row)"
                >
                  <feather-icon icon="PlusIcon" /> Add Partner
                </b-button>
                <table class="table table-bordered">
                  <tbody>
                    <tr
                      v-for="a_module in row.activated_modules"
                      :key="a_module.id"
                    >
                      <td>{{ a_module.partner.name }}</td>
                      <td>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="Remove Partners"
                          placement="top-start"
                        >
                          <b-button
                            variant="gradient-danger"
                            class="btn-icon rounded-circle"
                            @click="removePartnerModule(a_module.id)"
                          >
                            <feather-icon icon="TrashIcon" />
                          </b-button>
                        </el-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-dialog
          :title="`${mode} Package for ${selectedModule.name}`"
          :visible.sync="dialogVisible"
          width="50%"
        >
          <div v-loading="loading">
            <strong>Provide Package Name (e.g Silver, Gold, Platinum)</strong>
            <el-input
              v-model="packageForm.name"
              placeholder="Gold"
              style="width: 100%"
            />
            <br><br>
            <strong>Set Subscription Cost</strong>
            <el-input
              v-model="packageForm.price"
              style="width: 100%"
              type="number"
              placeholder="Input Price"
            >
              <template slot="prepend">
                ₦
              </template>
            </el-input>
            <br><br>
            <aside>
              <strong>Pick Features</strong>
              <el-transfer
                v-model="packageForm.features"
                :titles="['Features List', 'Picked Features']"
                :props="{
                  key: 'id',
                  label: 'name'
                }"
                style="width: 100%"
                :data="selectedModule.features"
              />
            </aside>
            <span
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button
                v-if="mode=== 'Create'"
                type="success"
                @click="submitPackage()"
              >Submit</el-button>
              <el-button
                v-else
                type="warning"
                @click="updatePackage()"
              >Update</el-button>
            </span>
          </div>
        </el-dialog>
      </div>
      <div
        slot="name"
        slot-scope="props"
      >
        {{ `${props.row.name} - ${props.row.full_name}` }}
      </div>
      <div
        slot="action"
        slot-scope="props"
        class="demo-inline-spacing"
      >
        <!-- <b-button
          variant="outline-primary"
          class="btn-icon"
          @click="addModule(props.row)"
        >
          <feather-icon icon="PlusIcon" /> Add Partner
        </b-button> -->
        <b-button
          variant="outline-secondary"
          class="btn-icon"
          @click="setupModule(props.row)"
        >
          <feather-icon icon="ToolIcon" /> Configure
        </b-button>
      </div>
    </v-client-table>
    <add-partners-to-module
      v-if="isCreatePackageModuleSidebarActive"
      v-model="isCreatePackageModuleSidebarActive"
      :selected-package="selectedModule"
      @save="updateTable"
    />
  </el-card>
</template>

<script>
import {
  BButton, BRow, BCol,
} from 'bootstrap-vue'
// import { VueGoodTable } from 'vue-good-table'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'
import AddPartnersToModule from './partials/AddPartnersToModule.vue'
import checkRole from '@/utils/role'

export default {
  components: {
    // VueGoodTable,
    AddPartnersToModule,
    BButton,
    // BPagination,
    // BFormGroup,
    // BFormInput,
    // BFormSelect,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      loading: false,
      isCreatePackageSidebarActive: false,
      isCreatePackageModuleSidebarActive: false,
      isCreateSchoolPackageSidebarActive: false,
      pageLength: 10,
      dir: false,
      dialogVisible: false,
      direction: 'ttb',
      columns: [
        'name',
        // 'slug',
        'action',
      ],

      options: {
        headings: {
          name: 'Module Name',
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
          'name',
        ],
        // filterable: false,
        filterable: [
          'name',
        ],
      },
      modules: [],
      searchTerm: '',
      selectedModule: '',
      selected_row_index: '',
      packageForm: {
        id: null,
        price: 0.00,
        features: [],
        name: '',
        available_module_id: null,
      },
      mode: 'Create',
    }
  },
  created() {
    this.fetchPackages()
  },
  methods: {
    checkRole,
    fetchPackages(load = true) {
      const app = this
      app.dialogVisible = false
      app.loading = load
      const fetchPackageResource = new Resource('packages/fetch-modules')
      fetchPackageResource.list()
        .then(response => {
          app.modules = response.modules
          app.loading = false
        })
    },
    createPackage(selectedModule, packageObj, mode) {
      const app = this
      app.selectedModule = selectedModule
      app.packageForm.id = (packageObj) ? packageObj.id : null
      app.packageForm.name = (packageObj) ? packageObj.name : ''
      app.packageForm.features = (packageObj) ? packageObj.features : []
      app.packageForm.price = (packageObj) ? packageObj.price : 0.00
      app.packageForm.available_module_id = selectedModule.id
      app.mode = mode
      app.dialogVisible = true
    },
    updatePackage() {
      const app = this
      const savePackageResource = new Resource('packages/update')
      const param = app.packageForm
      savePackageResource.update(param.id, param)
        .then(() => {
          app.$message('Package is updated successfully')
          app.fetchPackages(false)
        }).catch(() => {
          app.loading = false
        })
    },
    submitPackage() {
      const app = this
      app.loading = true
      const savePackageResource = new Resource('packages/store')
      const param = app.packageForm
      savePackageResource.store(param)
        .then(() => {
          app.$message('Package is created successfully')
          app.loading = false
          app.fetchPackages()
        }).catch(() => {
          app.loading = false
        })
    },
    deletePackage(pack) {
      const app = this
      app.$confirm(`${pack.name} will be removed from the list of packages. Continue?`, 'Warning', {
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'No',
        type: 'warning',
      }).then(() => {
        app.loading = true
        const savePackageResource = new Resource('packages/destroy')
        savePackageResource.destroy(pack.id)
          .then(() => {
            app.$message('Package is removed successfully')
            app.loading = false
            app.fetchPackages()
          }).catch(() => {
            app.loading = false
          })
      }).catch()
    },
    updateTable() {
      const app = this
      app.fetchPackages()
    },
    addModule(selectedRow) {
      // console.log(props)
      const app = this
      // const editableRow = selected_row;
      app.selectedModule = selectedRow
      app.isCreatePackageModuleSidebarActive = true
    },
    setupModule(row) {
      const moduleSlug = row.slug
      const { id } = row
      this.$router.push({ name: 'ModuleSetup', params: { id, module: moduleSlug } }).catch(() => {})
    },
    removePartnerModule(id) {
      // console.log(props)
      const app = this
      // eslint-disable-next-line no-restricted-globals, no-alert
      if (window.confirm('Kindly confirm action')) {
        // app.packages = []
        const fetchPackageResource = new Resource('packages/deactivate-partners-module')
        fetchPackageResource.destroy(id)
          .then(() => {
            app.fetchPackages()
            app.loading = false
          })
      }
    },
    updateEditedTableRow() {
      const app = this
      app.fetchPackages()
    },
  },
}
</script>
<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
