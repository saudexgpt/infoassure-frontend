<template>
  <el-card>
    <div
      slot="header"
    >
      <span
        class="pull-right"
        style="cursor:pointer;"
        @click="loadResources()"
      >
        <el-tooltip content="Refresh">
          <feather-icon
            icon="RefreshCwIcon"
            class="ml-50"
            size="30"
          />
        </el-tooltip>
      </span>
      <h3>Vendor Management System Overview</h3>
    </div>
    <VendorOnboardingCount />
    <div v-if="!loading">
      <el-row :gutter="15">
        <!-- <el-col
            :xs="24"
            :sm="24"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <el-card>
              <div
                slot="header"
                class="clearfix"
              >
                <strong>Category Description</strong>
              </div>
              <table class="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(category, index) in categories"
                    :key="index"
                  >
                    <td>{{ category.slug }}</td>
                    <td>{{ category.name }} <br> <small><em>{{ category.description }}</em></small></td>
                  </tr>
                </tbody>
              </table>
            </el-card>

          </el-col> -->
        <el-col
          :xs="24"
          :sm="24"
          :md="7"
          :lg="7"
          :xl="7"
        >
          <el-card>
            <div
              slot="header"
              class="clearfix"
            >
              <el-tooltip
                class="item"
                effect="dark"
                content="Vendors By Inherent Risk Rating"
                placement="top-start"
              >
                <strong>Vendors By IRR <i class="el-icon-question" /></strong>
              </el-tooltip>
            </div>
            <apexchart
              v-if="series3"
              :options="chartOptions3"
              :series="series3"
            />
            <el-empty v-else />
          </el-card>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="10"
          :lg="10"
          :xl="10"
        >
          <el-card>
            <div
              slot="header"
              class="clearfix"
            >
              <strong>Vendors By Category</strong>
            </div>
            <apexchart
              v-if="series1"
              :options="chartOptions1"
              :series="series1"
            />
            <el-empty v-else />
          </el-card>

        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="7"
          :lg="7"
          :xl="7"
        >
          <el-card>
            <div
              slot="header"
              class="clearfix"
            >
              <strong>Vendors Approval</strong>
            </div>
            <apexchart
              v-if="series2"
              :options="chartOptions2"
              :series="series2"
            />
            <el-empty v-else />
          </el-card>
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
  </el-card>
</template>

<script>
import {
// BCard, BCardBody, BAvatar,
} from 'bootstrap-vue'
import VendorOnboardingCount from '@/views/modules/DUE-DILIGENCE/Onboarding/charts/DataCount.vue'
import Pagination from '@/views/components/Pagination-main/index.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Pagination,
    VendorOnboardingCount,
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
          inherent_risk_rating: 'Inherent Risk Rating',

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
      vendor_count: 0,
      approved_vendors: 0,
      rejected_vendors: 0,
      pending_approval: 0,
      loading: false,
      series1: [],
      chartOptions1: {
        chart: {
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: 'end',
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        xaxis: {
          categories: [],
          floating: true,
        },
        // responsive: [{
        //   breakpoint: 480,
        //   options: {
        //     chart: {
        //       width: 200,
        //     },
        //     legend: {
        //       position: 'bottom',
        //     },
        //   },
        // }],
      },
      series2: [],
      chartOptions2: {
        chart: {
          type: 'pie',
        },
        colors: ['#ff9f43', '#ea5455', '#28c76f'],
        labels: ['Pending', 'Rejected', 'Approved'],
        legend: {
          position: 'bottom',
        },
        // responsive: [{
        //   breakpoint: 480,
        //   options: {
        //     chart: {
        //       width: 200,
        //     },
        //     legend: {
        //       position: 'bottom',
        //     },
        //   },
        // }],
      },
      series3: [],
      chartOptions3: {
        chart: {
          type: 'donut',
        },
        plotOptions: {
          pie: {
            startAngle: -90,
            endAngle: 90,
            // offsetY: 10,
          },
        },
        colors: ['#28c76f', '#ff9f43', '#ea5455'],
        labels: ['Low', 'Medium', 'High'],
        legend: {
          position: 'bottom',
        },
        // responsive: [{
        //   breakpoint: 480,
        //   options: {
        //     chart: {
        //       width: 200,
        //     },
        //     legend: {
        //       position: 'bottom',
        //     },
        //   },
        // }],
      },
    }
  },
  mounted() {
    this.loadResources()
  },
  methods: {
    loadResources() {
      const app = this
      app.fetchVendorCategories()
      app.fetchVendorsStat()
      app.fetchDashboardVendors()
    },
    fetchVendorsStat() {
      const app = this
      app.loading = true
      const fetchStaffResource = new Resource('vdd/reports/vendor-onboarding-report')
      fetchStaffResource.list(this.query)
        .then(response => {
          app.vendor_count = response.vendor_count
          app.approved_vendors = response.approved_vendors
          app.rejected_vendors = response.rejected_vendors
          app.pending_approval = response.pending_approval
          app.series1 = response.vendor_categories_series
          app.chartOptions1.xaxis.categories = response.vendor_categories
          app.series2 = [app.pending_approval, app.rejected_vendors, app.approved_vendors]
          app.categories = response.categories
          app.series3 = response.vendor_ratings_series
          app.loading = false
        }).catch(() => { app.loading = false })
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
