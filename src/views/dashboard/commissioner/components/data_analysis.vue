<template>
  <div>
    <legend align="center">{{response_data.data_info}}</legend>
    <el-row :gutter="10" class="panel-group">

      <el-col :xs="12" :sm="12" :md="6">
        <div class="small-box bg-aqua">
          <div class="inner">
            <h3><count-to :start-val="0" :end-val="response_data.maleStudents" :duration="2600" class="card-panel-num" /></h3>

            <p>Male Students</p>
          </div>
          <div class="icon">
            <i class="fa fa-male"></i>
          </div>

        </div>


      </el-col>
      <el-col :xs="12" :sm="12" :md="6">

        <div class="small-box bg-red">
          <div class="inner">
            <h3><count-to :start-val="0" :end-val="response_data.femaleStudents" :duration="2600" class="card-panel-num" /></h3>

            <p>Female Students</p>
          </div>
          <div class="icon">
            <i class="fa fa-female"></i>
          </div>

        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <div class="small-box bg-green">
          <div class="inner">
            <h3><count-to :start-val="0" :end-val="response_data.totalStaff" :duration="2600" class="card-panel-num" /></h3>

            <p>Total Staff</p>
          </div>
          <div class="icon">
            <i class="fa fa-users"></i>
          </div>

        </div>

      </el-col>
      <el-col :xs="12" :sm="12" :md="6">
        <div class="small-box bg-blue">
          <div class="inner">
            <h3><count-to :start-val="0" :end-val="response_data.totalClasses" :duration="2600" class="card-panel-num" /></h3>

            <p>Classes</p>
          </div>
          <div class="icon">
            <svg-icon icon-class="tree" class-name="card-panel-icon" />
          </div>

        </div>


      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to';
import Resource from '@/api/resource';
const dataAnalysisResource = new Resource('dashboard/commissioner');
export default {

  components: {
    CountTo,
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      };
      return statusMap[status];
    },
  },
  data(){
    return {
      role: 'commissioner',

      response_data: {
        maleStudents: 0,
        femaleStudents: 0,
        totalStudents: 0,
        totalStaff: 0,
        totalClasses: 0,
        data_info: '',
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {

    async fetchData() {
      // let app = this;
      // this.listLoading = true;

      const { data } = await dataAnalysisResource.list();
      this.response_data = data;

      // console.log(data.maleStudents);
      // this.total = data.total;
      // this.listLoading = false;
    },
  },
};
</script>

