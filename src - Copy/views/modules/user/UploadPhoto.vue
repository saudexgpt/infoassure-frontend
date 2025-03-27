<template>
  <div>
    <b-sidebar
      id="sidebar-task-handler"
      sidebar-class="sidebar-lg"
      :visible="isUploadPhotoSidebarActive"
      bg-variant="white"
      shadow
      backdrop
      no-header
      right
      @change="(val) => $emit('update:is-upload-photo-sidebar-active', val)"
    >
      <template #default="{ hide }">
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Change {{ user.first_name }}'s Image
          </h5>
          <div>
            <b-button
              variant="gradient-danger"
              class="btn-icon"
              @click="hide"
            >
              <feather-icon
                icon="XIcon"
              />
            </b-button>
          </div>
        </div>
        <div class="justify-content-between align-items-center px-2 py-1">
          <b-row v-loading="loading">

            <!-- first name -->
            <div
              v-if="user"
              class="customizer-section"
            >
              <span class="school-logo">
                <img
                  align="center"
                  :src="baseServerUrl +'storage/'+ user.photo"
                  alt="logo"
                  width="150"
                >
              </span>
              <b-form-group
                label="Change Image"
              >
                <input
                  type="file"
                  class="form-control"
                  @change="onImageChange"
                >
              </b-form-group>
            </div>
            <!-- submit and reset -->
            <!-- <b-col cols="12">
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit()"
              >
                Submit
              </b-button>
            </b-col> -->
            <b-col
              v-if="error"
              cols="12"
            >
              <b-alert
                variant="danger"
                show
              >
                <div class="alert-body">
                  <span><strong>{{ error_message }}</strong></span>
                </div>
              </b-alert>
            </b-col>
          </b-row>
        </div>
      </template>
    </b-sidebar>
  </div>
</template>

<script>
import {
  BSidebar, BRow, BCol, BFormGroup, BButton, BAlert,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import Resource from '@/api/resource'

export default {
  components: {
    BAlert,
    BSidebar,
    BRow,
    BCol,
    BFormGroup,
    BButton,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isUploadPhotoSidebarActive',
    event: 'update:is-upload-photo-sidebar-active',
  },
  props: {
    isUploadPhotoSidebarActive: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      error: false,
      photoToBeUploaded: '',
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
  },
  methods: {
    onImageChange(e) {
      const app = this
      // console.log(e)
      // eslint-disable-next-line prefer-destructuring
      app.photoToBeUploaded = e.target.files[0]

      app.submitUpload()
    },
    submitUpload() {
      const app = this
      app.loading = true
      const formData = new FormData()
      formData.append('photo', app.photoToBeUploaded)
      formData.append('user_id', app.user.id)
      const updatePhotoResource = new Resource('users/upload-photo')
      updatePhotoResource.store(formData)
        .then(response => {
          app.$emit('save', response)
          app.loading = false
          app.$emit('update:is-upload-photo-sidebar-active', false)
        })
        .catch(e => {
          app.$message(e.response.message)
        })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/include';
</style>
