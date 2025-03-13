<template>
  <div>
    <el-row
      v-if="loading"
      :gutter="15"
    >
      <el-col
        v-for="(count, count_index) in 4"
        :key="count_index"
        :xs="24"
        :sm="24"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <el-card>
          <el-skeleton
            :loading="loading"
            :rows="4"
            animated
          />
        </el-card>
      </el-col>
    </el-row>
    <div v-if="!loading">
      <el-row
        :gutter="6"
      >
        <el-col
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <b-card>
            <b-card-body class="d-flex justify-content-between align-items-center">
              <b-avatar
                variant="light-dark"
                size="50"
              >
                <feather-icon
                  size="35"
                  icon="UsersIcon"
                />
              </b-avatar>
              <div class="truncate">
                <h2
                  class="mb-25 font-weight-bolder"
                >
                  {{ vendor_count }}
                </h2>
                <span>Total Vendors</span>
              </div>
            </b-card-body>
          </b-card>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <b-card>
            <b-card-body class="d-flex justify-content-between align-items-center">
              <b-avatar
                variant="light-warning"
                size="50"
              >
                <feather-icon
                  size="35"
                  icon="UserIcon"
                />
              </b-avatar>
              <div class="truncate">
                <h2
                  class="mb-25 font-weight-bolder"
                >
                  {{ pending_approval }}
                </h2>
                <span>Pending</span>
              </div>
            </b-card-body>
          </b-card>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <b-card>
            <b-card-body class="d-flex justify-content-between align-items-center">
              <b-avatar
                variant="light-success"
                size="50"
              >
                <feather-icon
                  size="35"
                  icon="UserCheckIcon"
                />
              </b-avatar>
              <div class="truncate">
                <h2
                  class="mb-25 font-weight-bolder"
                >
                  {{ approved_vendors }}
                </h2>
                <span>Approved</span>
              </div>
            </b-card-body>
          </b-card>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
          :xl="6"
        >
          <b-card>
            <b-card-body class="d-flex justify-content-between align-items-center">
              <b-avatar
                variant="light-danger"
                size="50"
              >
                <feather-icon
                  size="35"
                  icon="UserXIcon"
                />
              </b-avatar>
              <div class="truncate">
                <h2
                  class="mb-25 font-weight-bolder"
                >
                  {{ rejected_vendors }}
                </h2>
                <span>Rejected</span>
              </div>
            </b-card-body>
          </b-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  BCard, BCardBody, BAvatar,
} from 'bootstrap-vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    BCardBody,
    BAvatar,
  },
  data() {
    return {
      vendor_count: 0,
      approved_vendors: 0,
      rejected_vendors: 0,
      pending_approval: 0,
      loading: false,
    }
  },
  mounted() {
    this.fetchVendorsStat()
  },
  methods: {
    fetchVendorsStat() {
      const app = this
      app.loading = true
      const fetchStaffResource = new Resource('vdd/reports/vendor-onboarding-count')
      fetchStaffResource.list(this.query)
        .then(response => {
          app.vendor_count = response.vendor_count
          app.approved_vendors = response.approved_vendors
          app.rejected_vendors = response.rejected_vendors
          app.pending_approval = response.pending_approval
          app.loading = false
        }).catch(() => { app.loading = false })
    },
  },
}
</script>
