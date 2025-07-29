<template>
  <div v-loading="loading">
    <!-- <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h3 class="mel-0">
            RISK AND CONTROL MATRIX
          </h3>
        </div> -->
    <el-row>
      <el-col md="6">
        <el-form-group label="Personal Data Item (multiple selection enabled)">
          <el-tooltip
            target="personal_data_item"
            title="The actual data involved; this may be a single item or a logical group of data e.g. 'customer name' or 'customer name and address'"
          />
          <!-- <textarea
            id="personal_data_item"
            v-model="form.personal_data_item"
            placeholder="Enter Personal Data Item"
            class="form-control"
            @blur="updateField($event.target.value, 'personal_data_item')"
          /> -->
          <el-tag v-for="pdi in form.personal_data_item" :key="pdi" :closable="false">
            {{ pdi }}
          </el-tag>
          <p></p>
          <el-select
            id="personal_data_item"
            v-model="form.personal_data_item"
            multiple
            filterable
            allow-create
            collapse-tags
            default-first-option
            placeholder="Example: Name, Address, BVN, etc"
            style="width: 100%"
            @input="updateField($event, 'personal_data_item')"
          >
            <el-option
              v-for="item in personalDataItems"
              :key="item.id"
              :label="item.item"
              :value="item.item"
            />
          </el-select>
          <small>You can type in an item if it is not on the list.</small>
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Description">
          <el-tooltip
            target="description"
            title="More information about the data item(s), if any"
          />
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Enter Description"
            class="form-control"
            @blur="updateField($event.target.value, 'description')"
          ></textarea>
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Is the personal data sensitive?">
          <el-tooltip
            target="sensitive_personal_data"
            title="Does the personal data fall into one or more of the special categories defined by the GDPR, namely  racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, genetic data, biometric data, data concerning health or data concerning a natural person's sex life or sexual orientation "
          />
          <select
            id="sensitive_personal_data"
            v-model="form.sensitive_personal_data"
            class="form-control"
            @change="
              (updateField($event.target.value, 'sensitive_personal_data'),
              updateField('N/A', 'exception_used_personal_data'))
            "
          >
            <option v-for="option in yes_no" :key="option" :value="option" :label="option"></option>
          </select>
        </el-form-group>
      </el-col>
      <el-col v-if="form.sensitive_personal_data === 'Yes'" md="6">
        <el-form-group label="Exception Used">
          <el-tooltip
            target="exception_used_personal_data"
            title="For special category data, what is the Article 9 paragraph 2 exception used to allow processing?"
          />
          <select
            id="exception_used_personal_data"
            v-model="form.exception_used_personal_data"
            class="form-control"
            @change="updateField($event.target.value, 'exception_used_personal_data')"
          >
            <option
              v-for="option in exceptions"
              :key="option"
              :value="option"
              :label="option"
            ></option>
          </select>
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Was the data obtained from the data subject directly?">
          <el-tooltip
            target="obtained_from_data_source"
            title="Was the data obtained from the data subject directly or was it obtained from another source, such as a supplied database?"
          />
          <select
            id="obtained_from_data_source"
            v-model="form.obtained_from_data_source"
            class="form-control"
            @change="updateField($event.target.value, 'obtained_from_data_source')"
          >
            <option v-for="option in yes_no" :key="option" :value="option" :label="option"></option>
          </select>
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Owner">
          <el-tooltip target="owner" title="The role that is responsible for the personal data" />
          <input
            id="owner"
            v-model="form.owner"
            class="form-control"
            @blur="updateField($event.target.value, 'owner')"
          />
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Processing Purpose">
          <el-tooltip
            target="processing_purpose"
            title="The use that the personal data is put to e.g. 'fulfilling a sale' or 'sending marketing information'"
          />
          <textarea
            id="processing_purpose"
            v-model="form.processing_purpose"
            class="form-control"
            @blur="updateField($event.target.value, 'processing_purpose')"
          ></textarea>
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Lawful basis of processing">
          <el-tooltip
            target="lawful_basis_of_processing"
            title="The rationale for why the processing is lawful under Article 6 of the GDPR. Options include consent, contractual and legal."
          />
          <select
            id="lawful_basis_of_processing"
            v-model="form.lawful_basis_of_processing"
            class="form-control"
            @change="
              (updateField($event.target.value, 'lawful_basis_of_processing'),
              updateField('N/A', 'how_is_consent_obtained'))
            "
          >
            <option
              v-for="option in lawful_bases"
              :key="option"
              :value="option"
              :label="option"
            ></option>
          </select>
        </el-form-group>
      </el-col>
      <el-col v-if="form.lawful_basis_of_processing === 'Consent-based'" md="6">
        <el-form-group label="How is the consent obtained?">
          <el-tooltip
            target="how_is_consent_obtained"
            title="If the lawful basis of the processing is consent, how does the data subject signify consent and how would this be evidenced?
  "
          />
          <input
            id="how_is_consent_obtained"
            v-model="form.how_is_consent_obtained"
            class="form-control"
            @blur="updateField($event.target.value, 'how_is_consent_obtained')"
          />
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Is decision making automated?">
          <el-tooltip
            target="automated_decision_making"
            title="Does the business process involve a decision based solely on automated processing which may significantly affect the data subject?"
          />
          <select
            id="automated_decision_making"
            v-model="form.automated_decision_making"
            class="form-control"
            @change="updateField($event.target.value, 'automated_decision_making')"
          >
            <option v-for="option in yes_no" :key="option" :value="option" :label="option"></option>
          </select>
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Level of data access">
          <el-tooltip
            target="level_of_data_subject_access"
            title="What access does the data subject have to their personal data to exercise their rights e.g review it for accuracy and change it?"
          />
          <input
            id="level_of_data_subject_access"
            v-model="form.level_of_data_subject_access"
            class="form-control"
            @blur="updateField($event.target.value, 'level_of_data_subject_access')"
          />
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Location Stored">
          <el-tooltip
            target="location_stored"
            title="The physical place the data reside in e.g. a server or a filing cabinet"
          />
          <input
            id="location_stored"
            v-model="form.location_stored"
            class="form-control"
            @blur="updateField($event.target.value, 'location_stored')"
          />
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Country Stored In">
          <el-tooltip
            target="country_stored_in"
            title="The country the data are stored in e.g. the physical location of the servers that hold the data"
          />
          <el-select
            id="country_stored_in"
            v-model="form.country_stored_in"
            filterable
            style="width: 100%"
            @change="updateField($event, 'country_stored_in')"
          >
            <el-option v-for="option in countries" :key="option" :value="option" :label="option" />
          </el-select>
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Retention Period">
          <el-tooltip
            target="retention_period"
            title="How long is the data kept for before being deleted or amended so that it no longer represents personal data?"
          />
          <input
            id="retention_period"
            v-model="form.retention_period"
            class="form-control"
            @blur="updateField($event.target.value, 'retention_period')"
          />
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Encryption Level">
          <el-tooltip
            target="encryption_level"
            title="What is the level of encryption on the data?"
          />
          <input
            id="encryption_level"
            v-model="form.encryption_level"
            class="form-control"
            @blur="updateField($event.target.value, 'encryption_level')"
          />
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Access Control">
          <el-tooltip
            target="access_control"
            title="What are the appropriate access controls applied to the data?"
          />
          <input
            id="access_control"
            v-model="form.access_control"
            class="form-control"
            @blur="updateField($event.target.value, 'access_control')"
          />
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Third parties shared with">
          <el-tooltip
            target="third_parties_shared_with"
            title="Names of third parties with whom the data are shared i.e. those that will also hold and process the data on their own account (not simply hosting a storage location that you control)"
          />
          <textarea
            id="third_parties_shared_with"
            v-model="form.third_parties_shared_with"
            class="form-control"
            @blur="updateField($event.target.value, 'third_parties_shared_with')"
          ></textarea>
        </el-form-group>
      </el-col>
      <el-col md="6">
        <el-form-group label="Comments">
          <el-tooltip target="comments" title="Any other relevant information" />
          <textarea
            id="comments"
            v-model="form.comments"
            class="form-control"
            @blur="updateField($event.target.value, 'comments')"
          ></textarea>
        </el-form-group>
      </el-col>
    </el-row>
    <el-button type="primary" @click="$emit('updated')"> Update </el-button>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedData: {
      type: Object,
      required: true
    },
    countries: {
      type: Array,
      required: true
    },
    personalDataItems: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      yes_no: ['Yes', 'No'],
      lawful_bases: [
        'Consent-based',
        'Contractual',
        'Legal Obligation',
        'Vital Interests',
        'Public Interests',
        'Legitimate Interests'
      ],
      exceptions: [
        'Explicit Consent',
        'Legal Obligation',
        'Public Data',
        'Legal Claims',
        'Public Interest',
        'Health Purposes',
        'Public Health',
        'Archiving and Research'
      ],
      form: {
        client_id: '',
        business_unit_id: '',
        business_process_id: '',
        standard_id: '',
        personal_data_item: [],
        description: '',
        sensitive_personal_data: '',
        exception_used_personal_data: '',
        obtained_from_data_source: '',
        owner: '',
        processing_purpose: '',
        lawful_basis_of_processing: '',
        how_is_consent_obtained: '',
        automated_decision_making: '',
        level_of_data_subject_access: '',
        location_stored: '',
        country_stored_in: '',
        retention_period: '',
        encryption_level: '',
        access_control: '',
        third_parties_shared_with: '',
        comments: ''
      },
      loading: false,
      selectedClient: {},
      uploadableFile: null
    }
  },
  watch: {
    selectedData() {
      this.form = this.selectedData
    }
  },
  created() {
    this.form = this.selectedData
  },
  methods: {
    updateField(value, field) {
      const params = {
        field,
        value
      }
      const updateResources = new Resource('pda/update')
      updateResources
        .update(app.selectedData.id, params)
        .then((response) => {
          this.form = response.pda
          // app.$message('Updated')
        })
        .catch()
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
