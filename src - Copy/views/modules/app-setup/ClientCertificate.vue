<template>
  <el-card>
    <b-tabs
      pills
      nav-class="nav-pill-primary"
      content-class="mt-1"
    >
      <b-tab lazy>
        <template #title>
          <feather-icon icon="FileTextIcon" />
          <span>Upload Certificates</span>
        </template>
        <upload-certificates />
      </b-tab>
    </b-tabs>
  </el-card>
</template>

<script>
import {
  BTabs, BTab,
} from 'bootstrap-vue'
import UploadCertificates from './partials/UploadCertificates.vue'

export default {
  components: {
    BTabs,
    BTab,
    UploadCertificates,
  },
}
</script>
