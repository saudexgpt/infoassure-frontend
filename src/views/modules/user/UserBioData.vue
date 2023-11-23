<template>
  <b-card v-if="user">
    <!-- User Avatar & Action Buttons -->
    <el-row :gutter="20">
      <el-col :lg="8">

        <div
          align="center"
          style="background: #f0f0f0; padding: 10px"
        >
          <img
            :src="baseServerUrl +'storage/'+ user.photo"
            alt="Photo"
            width="120"
            onerror="this.src='/images/profile-image.png'"
            style="border: #000000 solid 3px; border-radius: 5px"
          >
          <div>
            <br>
            <h5>{{ user.name }}</h5>
            <small class="font-weight-bold">{{ user.email }}</small><br>
            <span class="font-weight-bold">{{ user.phone }}</span>
          </div>
          <!-- <b-avatar
            :src="baseServerUrl +'storage/'+user.photo"
            variant="light-primary"
            onerror="this.src='/images/profile-image.png'"
            size="120px"
            rounded
          /> -->
          <!-- <div class="d-flex flex-column ml-1">
            <div class="mb-1">
              <h2 class="mb-0">
                {{ user.first_name +' ' + user.last_name }}
              </h2>
              <small class="font-weight-bold">{{ user.email }}</small><br>
              <span class="font-weight-bold">{{ user.phone }}</span>
            </div>
          </div> -->
        </div>
        <!-- We want to make sure only the owner of the data can modify it-->
        <div
          v-if="userData.id === user.id"
          class="demo-inline-spacing"
        >
          <b-button
            v-if="user.role !== 'student'"
            size="sm"
            variant="primary"
            @click="changePhoto()"
          >
            Change Photo
          </b-button>
          <b-button
            size="sm"
            variant="danger"
            @click="dialogVisible = true"
          >
            Update Password
          </b-button>
        </div>
      </el-col>
      <el-col :lg="16">
        <div label="Full Name">
          <strong>Full Name</strong>
          <el-input v-model="user.name" />
        </div>
        <div label="Email">
          <strong>Email</strong>
          <el-input
            v-model="user.email"
          />
        </div>
        <div label="Phone">
          <strong>Phone</strong>
          <el-input
            v-model="user.phone"
          />
        </div>
        <div>
          <br>
          <el-button
            type="primary"
            @click="updateBioData"
          >
            Update
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="Change Password"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div
        v-loading="load"
      >
        <validation-observer>
          <b-form
            v-loading="load"
            method="POST"
            class="auth-login-form mt-2"
            @submit.prevent="updatePassword"
          >
            <!-- email -->
            <b-form-group
              label-for="login-email"
            >
              <b-form-input
                id="login-email"
                v-model="form.email"
                class="round"
                name="login-email"
                placeholder="Email"
                disabled
              />
            </b-form-group>
            <b-form-group
              label-for="old-password"
            >
              <validation-provider
                #default="{ errors }"
                name="Old Password"
                rules="required"
              >
                <b-form-input
                  id="old-password"
                  v-model="form.password"
                  class="round"
                  name="old-password"
                  placeholder="Enter old password"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <!-- forgot password -->
            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="Password"
                vid="Password"
                rules="required|password|min:9"
              >
                <b-input-group
                  class="input-group-merge round"
                >
                  <b-form-input
                    v-model="form.new_password"
                    class="form-control-merge"
                    :type="passwordFieldType"
                    name="login-password"
                    placeholder="New Password"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>

            <b-form-group>
              <validation-provider
                #default="{ errors }"
                name="Confirm Password"
                rules="required|confirmed:Password"
              >
                <b-input-group
                  class="input-group-merge round"
                >
                  <b-form-input
                    v-model="form.confirm_password"
                    class="form-control-merge"
                    :type="passwordFieldType"
                    name="login-password"
                    placeholder="Confirm Password"
                  />
                  <b-input-group-append is-text>
                    <feather-icon
                      class="cursor-pointer"
                      :icon="passwordToggleIcon"
                      @click="togglePasswordVisibility"
                    />
                  </b-input-group-append>
                </b-input-group>
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
            <b-button
              pill
              variant="gradient-warning"
              block
              @click="updatePassword"
            >
              Update Password
            </b-button>
            <br>
            <!-- <a href="/dashboard">
                I will do that later from my profile
              </a> -->
          </b-form>
        </validation-observer>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="dialogVisible = false"
        >Cancel</el-button>
        <!-- <el-button
          type="success"
          @click="updatePassword()"
        >Submit</el-button> -->
      </span>
    </el-dialog>
    <upload-photo
      v-if="isUploadPhotoSidebarActive"
      v-model="isUploadPhotoSidebarActive"
      :user="user"
      @save="updatePhoto"
    />
  </b-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BButton, BCard, BForm, BFormGroup, BInputGroup, BInputGroupAppend, BFormInput,
} from 'bootstrap-vue'
import { mapGetters } from 'vuex'
// import { avatarText } from '@core/utils/filter'
import UploadPhoto from '@/views/modules/user/UploadPhoto.vue'
import Resource from '@/api/resource'

export default {
  components: {
    BCard,
    BButton,
    BForm,
    BFormGroup,
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
    // BAvatar,
    UploadPhoto,
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    // const { resolveUserRoleVariant } = useUsersList()
    return {
      // avatarText,
      // resolveUserRoleVariant,
      form: {
        email: '',
        password: '',
        new_password: '',
        confirm_password: '',
        include_old_password: true,
      },
      dialogVisible: false,
      load: false,
      isUploadPhotoSidebarActive: false,
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    ...mapGetters([
      'userData',
    ]),
  },
  mounted() {
    this.form.email = this.user.email
  },
  methods: {
    updatePassword() {
      const app = this
      if (app.form.confirm_password === app.form.new_password && app.form.new_password !== '') {
        app.load = true
        this.$store.dispatch('user/updatePassword', app.form)
          .then(() => {
            app.$message('Password updated successfully')
            app.logout()
          }).catch(error => {
            console.log(error)
            app.load = false
            this.$message({
              message: error.response.data.message,
              type: 'danger',
            })
          })
      } else {
        app.$alert('New Password does not match')
      }
    },
    changePhoto() {
      const app = this
      app.isUploadPhotoSidebarActive = true
    },
    updatePhoto(photo) {
      const app = this
      app.user.photo = photo
    },
    updateBioData() {
      this.updating = true
      const userResource = new Resource('users/update-profile')
      userResource
        .update(this.user.id, this.user)
        .then(() => {
          this.updating = false
          this.$message({
            message: 'Profile updated successfully',
            type: 'success',
          })
        })
        .catch(error => {
          console.log(error)
          this.updating = false
        })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login').catch(() => {})
    },
  },
}
</script>

<style scoped>
.card-body {
  padding: 0.5rem;
}
.padded-th {
  padding: 1rem;
}
</style>
