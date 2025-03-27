<template>
  <div class="app-container">
    <div>
      <div
        class="box"
      >
        <div
          class="box-body"
        >
          <el-form
            ref="form"
            v-loading="loadForm"
            :model="form"
            label-width="120px"
          >
            <el-row
              :gutter="5"
              class="padded"
            >

              <el-col
                :xs="24"
                :sm="12"
                :md="12"
              >
                <label for>Select File (.pdf extension only)</label>
                <input
                  class="form-control"
                  type="file"
                  @change="onImageChange"
                >
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="12"
              >
                <label for>Invoice Number in the file</label>
                <el-input
                  v-model="form.invoice_no"
                  placeholder="Enter invoice number"
                  class="span"
                  :disabled="form.uploadedInvoice === null"
                />
              </el-col>
            </el-row>
            <el-row
              :gutter="5"
              class="padded"
            >
              <el-col
                :xs="24"
                :sm="12"
                :md="12"
              >
                <label for>Total payable amount in the file</label>
                <el-input
                  v-model="form.amount"
                  type="number"
                  outline
                  :disabled="form.uploadedInvoice === null"
                >
                  <template slot="prepend">
                    {{ currency }}
                  </template>
                </el-input>
                <strong style="color: green">
                  {{ currency }}{{ Number(form.amount).toLocaleString() }}
                </strong>
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="12"
              >
                <label for>Invoice Due Date</label>
                <el-date-picker
                  v-model="form.due_date"
                  type="date"
                  placeholder="Invoice Due Date"
                  style="width: 100%;"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  :disabled="form.uploadedInvoice === null"
                />
              </el-col>
            </el-row>
            <el-row
              :gutter="2"
              class="padded"
            >
              <el-col
                :xs="24"
                :sm="24"
                :md="24"
              >
                <div align="right">
                  <div>

                    <el-button
                      type="success"
                      @click="submitNewInvoice"
                    >
                      <i class="el-icon-plus" />
                      Submit Invoice
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Resource from '@/api/resource'

export default {
  // name: 'CreateInvoice',
  props: {
    vendorId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(date) {
          const d = new Date() // today
          d.setDate(d.getDate()) // one year from now
          return date > d
        },
      },
      currency: '₦',
      upload_type: 'normal',
      // customers: [],
      // customer_types: [],
      items_in_stock_dialog: false,
      dialogFormVisible: false,
      userCreating: false,
      loadPreview: false,
      fill_fields_error: false,
      show_product_list: false,
      loadForm: false,
      disable_submit: false,
      can_submit: false,
      form: {
        invoice_no: '',
        due_date: '',
        amount: 0,
        uploadedInvoice: null,
      },
      empty_form: {
        invoice_no: '',
        due_date: '',
        amount: 0,
        uploadedInvoice: null,
      },
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    moment,
    checkPermission,
    checkRole,
    onImageChange(e) {
      const app = this

      const fileType = e.target.files[0].type
      if (fileType !== 'application/pdf') {
        app.$alert('Only .pdf file format is acceptable.')
        return false
      }
      // eslint-disable-next-line prefer-destructuring
      app.form.uploadedInvoice = e.target.files[0]
      return true
    },
    submitNewInvoice() {
      const app = this
      const formData = new FormData()
      formData.append('invoice_no', app.form.invoice_no)
      formData.append('due_date', app.form.due_date)
      formData.append('amount', app.form.amount)
      formData.append('file_uploaded', app.form.uploadedInvoice)
      formData.append('vendor_id', app.vendorId)
      const { form } = app
      const checkEmptyFields = app.form.due_date === '' || app.form.invoice_no === '' || app.form.amount === 0
      if (!checkEmptyFields) {
        app.loadForm = true
        form.vendor_id = app.vendorId
        app.disable_submit = true
        const createInvoice = new Resource('vdd/invoices/upload-invoice')
        createInvoice
          .vStore(formData)
          .then(() => {
            app.$emit('saved')
            app.$message({
              message: 'Invoice Created Successfully!!!',
              type: 'success',
            })
            app.form = app.empty_form

            app.disable_submit = false
            app.loadForm = false
          })
          .catch(error => {
            app.loadForm = false
            console.log(error.message)
          })
      } else {
        app.$alert('Please fill the form fields completely')
      }
    },
    calculateTotal(index) {
      const app = this
      // Get total amount for this item without tax
      if (index !== null) {
        const { quantity } = app.invoice_items[index]
        const unitRate = app.invoice_items[index].rate
        app.invoice_items[index].amount = parseFloat(
          quantity * unitRate,
        ).toFixed(2) // + parseFloat(tax);
      }

      // we now calculate the running total of items invoiceed for with tax //////////
      // let total_tax = 0;
      let subtotal = 0
      // eslint-disable-next-line no-plusplus
      for (let count = 0; count < app.invoice_items.length; count++) {
        // const tax_rate = app.invoice_items[count].tax;
        // const quantity = app.invoice_items[count].quantity;
        // const unit_rate = app.invoice_items[count].rate;
        // total_tax += parseFloat(tax_rate * quantity * unit_rate);
        subtotal += parseFloat(app.invoice_items[count].amount)
      }
      // app.form.tax = total_tax.toFixed(2);
      app.form.subtotal = subtotal.toFixed(2)
      //   app.form.discount = parseFloat(
      //     (app.discount_rate / 100) * subtotal,
      //   ).toFixed(2)
      // subtract discount
      app.form.amount = parseFloat(subtotal - app.form.discount).toFixed(2)
    },
    previewInvoice() {
      const app = this
      app.$alert(app.form)
    },

  },
}
</script>
