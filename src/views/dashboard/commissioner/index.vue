<template>
  <div class="app-container">

    <data-analysis />
    <aside>
      <label>Make specific selection for detailed query</label>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" class="box-panel-col" style="background: #f0f0f0; padding: 5px;">
          <multiselect
            v-model="params.lga"
            :options="lgas"
            label="name"
            value="id"
            track-by="id"
            :searchable="true"
            :close-on-select="true"
            placeholder="Select LGA"

          />
          <!-- <el-select v-model="lga_key" placeholder="Select LGA" class="span" @change="fetchSchoolsInLGA">
            <el-option v-for="(lga, index) in lgas" v-bind:value="index" :key="index" :label="lga.name"/>

          </el-select> -->
        </el-col>

      </el-row>
    </aside>

    <report-chart v-if="params.lga" :params="params"/>

  </div>
</template>
<script>
import DataAnalysis from './components/data_analysis.vue';
import ReportChart from './components/report_chart.vue';
import Multiselect from 'vue-multiselect';
import Resource from '@/api/resource';
const stateLGA= new Resource('get-state-lga');
export default {
  components: {
   DataAnalysis, ReportChart, Multiselect,
  },
  data() {
    return {
      school_name: '',

      lgas: [],

      params: {
        lga: '',

      }
    }
  },
  mounted() {
    this.fetchLGAs();
  },
  methods: {
    fetchLGAs()
    {
      let app = this;
      stateLGA.list()
      .then(response => {
        app.lgas = response;

      })

    },
    // fetchSchoolsInLGA()
    // {
    //   let app = this;
    //   let lga = app.params.lga;
    //   //console.log(index)
    //   app.schools = lga.schools;
    //   app.params.school = '';//app.class_teachers[0].id;
    //   //app.fetchSubjectTeachers();
    // },
  },
};
</script>
