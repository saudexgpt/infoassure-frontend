<template>
  <div>
    <div
      style="cursor:pointer; margin-bottom: 5px;"
      @click="loadResources()"
    >
      <el-button
        type="primary"
        plain
        @click="loadResources()"
      >
        <feather-icon
          icon="RefreshCwIcon"
          class="ml-50"
        /> Refresh
      </el-button>
    </div>
    <DataCount v-if="showChart" />
    <el-row :gutter="15">
      <el-col
        :xs="24"
        :sm="24"
        :md="7"
        :lg="7"
        :xl="7"
      >
        <VendorByIRR v-if="showChart" />
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="10"
        :lg="10"
        :xl="10"
      >
        <VendorByCategory v-if="showChart" />

      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="7"
        :lg="7"
        :xl="7"
      >
        <VendorByApproval v-if="showChart" />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <v-client-table
          v-model="vendors"
          v-loading="loading"
          :columns="columns"
          :options="options"
        >

          <div
            slot="inherent_risk_rating"
            slot-scope="{row}"
          >

            <el-tag
              v-if="row.inherent_risk_rating === 3"
              effect="dark"
              type="danger"
            >
              High
            </el-tag>
            <el-tag
              v-if="row.inherent_risk_rating === 2"
              effect="dark"
              type="warning"
            >
              Medium
            </el-tag>
            <el-tag
              v-if="row.inherent_risk_rating === 1"
              effect="dark"
              type="success"
            >
              Low
            </el-tag>
          </div>
          <div
            slot="second_approval"
            slot-scope="{row}"
          >
            <div v-if="row.second_approval !== null">

              <el-tag
                v-if="row.second_approval.action === 'Approve'"
                type="success"
              >
                Approved
              </el-tag>
              <el-tag
                v-if="row.second_approval.action === 'Reject'"
                type="danger"
              >
                Rejected
              </el-tag>
            </div>
            <div v-else>
              <el-tag
                type="warning"
              >
                Pending
              </el-tag>
            </div>
          </div>
          <div
            slot="action"
            slot-scope="props"
          >
            <b-button
              variant="secondary"
              @click="editVendor(props.row)"
            >
              <span><feather-icon icon="EditIcon" /></span>
            </b-button>
          </div>
        </v-client-table>
        <hr>
        <el-row :gutter="20">
          <pagination
            v-show="total > 10"
            :total="total"
            :page.sync="query.page"
            :limit.sync="query.limit"
            @pagination="fetchDashboardVendors"
          />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
} from 'bootstrap-vue'
import Pagination from '@/views/components/Pagination-main/index.vue'
import DataCount from './charts/DataCount.vue'
import VendorByIRR from './charts/VendorByIRR.vue'
import VendorByCategory from './charts/VendorByCategory.vue'
import VendorByApproval from './charts/VendorByApproval.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Pagination,
    DataCount,
    VendorByIRR,
    VendorByCategory,
    VendorByApproval,
  },
  data() {
    return {
      categories: [],
      vendors: [],
      query: {
        page: 1,
        limit: 50,
      },
      total: 0,
      columns: [
        'name',
        'category.slug',
        'business_type',
        'second_approval',
        'inherent_risk_rating',
      ],

      options: {
        headings: {
          name: 'Vendor Name',
          'category.slug': 'Category',
          second_approval: 'Status',
          inherent_risk_rating: 'Rating',

          // id: 'S/N',
        },
        filterByColumn: false,
        // rowAttributesCallback(row) {
        //   if (row.second_approval === null) {
        //     return { style: 'background: #fcf1c0; color: #000000' }
        //   }
        //   if (row.second_approval.action === 'Approve') {
        //     return { style: 'background: #eaf8e5; color: #000000' }
        //   }
        //   if (row.second_approval.action === 'Reject') {
        //     return { style: 'background: #f5dbd3; color: #000000' }
        //   }
        //   return {}
        // },
        sortable: [],
        // filterable: false,
        filterable: false,
      },
      showChart: true,
      loading: false,
    }
  },
  mounted() {
    this.loadResources()
  },
  methods: {
    loadResources() {
      const app = this
      app.showChart = false
      setTimeout(() => {
        app.showChart = true
      }, 100)

      app.fetchVendorCategories()
      app.fetchDashboardVendors()
    },
    fetchVendorCategories() {
      const app = this
      const fetchCategoryResource = new Resource('vdd/fetch-vendor-categories')
      fetchCategoryResource.list()
        .then(response => {
          app.categories = response.categories
        }).catch()
    },
    fetchDashboardVendors() {
      const app = this
      const { limit, page } = this.query
      app.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-vendors')
      fetchStaffResource.list(this.query)
        .then(response => {
          app.vendors = response.vendors.data
          app.vendors.forEach((element, index) => {
            // eslint-disable-next-line no-param-reassign, dot-notation
            element['index'] = (page - 1) * limit + index + 1
          })
          app.total = response.vendors.total
          app.loading = false
        })
    },
  },
}
</script>
