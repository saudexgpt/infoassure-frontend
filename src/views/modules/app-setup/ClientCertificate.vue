<template>
  <el-card>
    <b-tabs
      pills
      nav-class="nav-pill-primary"
      content-class="mt-1"
    >
      <!-- This tabs content will always be mounted -->
      <b-tab>
        <template #title>
          <feather-icon icon="ListIcon" />
          <span>Feedback Form Config</span>
        </template>
        <form-fields />
      </b-tab>
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
import FormFields from './FormFields.vue'
import UploadCertificates from './partials/UploadCertificates.vue'

export default {
  components: {
    BTabs,
    BTab,
    FormFields,
    UploadCertificates,
  },
}
</script>
