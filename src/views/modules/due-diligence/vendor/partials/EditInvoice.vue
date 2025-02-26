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
                <label for>Invoice Number</label>
                <el-input
                  v-model="form.invoice_no"
                  placeholder="Enter invoice number"
                  class="span"
                  disabled
                />
              </el-col>
              <el-col
                :xs="24"
                :sm="12"
                :md="12"
              >
                <label for>Invoice Due Date</label>
                <!-- <el-date-picker
                    v-model="form.due_date"
                    type="date"
                    placeholder="Invoice Due Date"
                    style="width: 100%;"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  /> -->
                <el-date-picker
                  v-model="form.due_date"
                  type="date"
                  placeholder="Invoice Due Date"
                  style="width: 100%;"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                />
              </el-col>
            </el-row>
            <div v-if="form.invoice_no !== '' && form.due_date !== ''">
              <el-row
                :gutter="2"
                class="padded"
              >
                <el-col>
                  <div style="overflow: auto">
                    <label for>Products</label>
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th />
                          <th>Description</th>
                          <th>Quantity</th>
                          <th>Rate</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(invoice_item, index) in invoice_items"
                          :key="index"
                        >
                          <td>
                            <span v-if="invoice_item.id === null">
                              <el-button
                                size="mini"
                                type="danger"
                                icon="el-icon-delete"
                                @click="removeLine(index)"
                              />
                              <el-button
                                size="mini"
                                type="success"
                                icon="el-icon-plus"
                                @click="addLine(index)"
                              />
                            </span>
                            <span v-else>
                              {{ index + 1 }}
                            </span>
                          </td>
                          <td>
                            <el-input
                              v-model="invoice_item.description"
                              type="textarea"
                              outline
                              placeholder="Description"
                            />
                          </td>
                          <td>
                            <el-input
                              v-model="invoice_item.quantity"
                              type="number"
                              outline
                              placeholder="Quantity"
                              min="1"
                              @input="calculateTotal(index)"
                            />
                          </td>
                          <td>
                            <el-input
                              v-model="invoice_item.rate"
                              type="number"
                              outline
                              @input="calculateTotal(index)"
                            >
                              <template slot="prepend">
                                {{ currency }}
                              </template>
                            </el-input>
                          </td>
                          <td align="right">
                            <el-input
                              v-model="invoice_item.amount"
                              type="hidden"
                              outline
                            />
                            {{ currency }} {{ Number(invoice_item.amount).toLocaleString() }}
                          </td>
                        </tr>
                        <tr v-if="fill_fields_error">
                          <td colspan="5">
                            <el-alert
                              type="error"
                              :closable="false"
                            >Please fill all empty fields before submitting or adding another row</el-alert>
                          </td>
                        </tr>
                        <tr>
                          <td
                            colspan="4"
                            align="right"
                          >
                            <strong>Subtotal</strong>
                          </td>
                          <td align="right">
                            {{ currency }} {{ Number(form.subtotal).toLocaleString() }}
                          </td>
                        </tr>
                        <tr>
                          <td colspan="3" />
                          <td
                            align="right"
                          >
                            <p>
                              Give Discount
                            </p>
                            <el-input
                              v-model="form.discount"
                              type="number"
                              outline
                              @input="calculateTotal(null)"
                            >
                              <template slot="prepend">
                                {{ currency }}
                              </template>
                            </el-input>
                          </td>
                          <td align="right">
                            {{ currency }} {{ Number(form.discount).toLocaleString() }}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colspan="4"
                            align="right"
                          >
                            <h3>Grand Total</h3>
                          </td>
                          <td align="right">
                            <h3 style="color: green">
                              {{ currency }} {{ Number(form.amount).toLocaleString() }}
                            </h3>
                          </td>
                        </tr>
                        <tr>
                          <td align="right">
                            Notes
                          </td>
                          <td colspan="4">
                            <textarea
                              v-model="form.notes"
                              class="form-control"
                              rows="3"
                              placeholder="Type extra note on this invoice here..."
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
                  <div align="center">
                    <div>

                      <el-button
                        type="success"
                        @click="updateInvoice"
                      >
                        <i class="el-icon-edit" />
                        Update Invoice
                      </el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
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
    invoice: {
      type: Object,
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
      batches_of_items_in_stock: [],
      disable_submit: false,
      can_submit: false,
      form: {
        invoice_no: '',
        status: 'pending',
        due_date: '',
        subtotal: 0,
        discount: 0,
        amount: 0,
        notes: 'All payments are to be made on or before the due date',
        invoice_items: [
          {
            quantity: 1,
            rate: null,
            amount: 0,
            description: null,
          },
        ],
      },
      empty_form: {
        invoice_no: '',
        status: 'pending',
        due_date: '',
        subtotal: 0,
        discount: 0,
        amount: 0,
        notes: 'All payments are to be made on or before the due date',
        invoice_items: [
          {
            quantity: 1,
            rate: null,
            amount: 0,
            description: null,
          },
        ],
      },
      invoice_items: [],
      rules: {
        customer_type: [
          {
            required: true,
            message: 'Customer Type is required',
            trigger: 'change',
          },
        ],
        name: [
          { required: true, message: 'Name is required', trigger: 'blur' },
        ],
        // email: [
        //   { required: true, message: 'Email is required', trigger: 'blur' },
        //   { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] },
        // ],
        // phone: [{ required: true, message: 'Phone is required', trigger: 'blur' }],
      },
      discount_rate: 0,
    }
  },
  computed: {
  },
  watch: {
    invoice_items() {
      this.blockRemoval = this.invoice_items.length <= 1
    },
  },
  created() {
    this.form = this.invoice
    this.invoice_items = this.invoice.invoice_items
    this.addLine()
  },
  methods: {
    moment,
    checkPermission,
    checkRole,
    rowIsEmpty() {
      this.fill_fields_error = false
      const checkEmptyLines = this.invoice_items.filter(
        detail => detail.amount === 0
              || detail.quantity === 0
              || detail.rate === null
              || detail.description === null,
      )
      if (checkEmptyLines.length >= 1) {
        this.fill_fields_error = true
        // this.invoice_items[index].seleted_category = true;
        return true
      }
      return false
    },
    addLine() {
      if (this.rowIsEmpty() && this.invoice_items.length > 0) {
        return false
      }
      // if (this.invoice_items.length > 0)
      //     this.invoice_items[index].grade = '';
      this.invoice_items.push({
        id: null,
        invoice_id: null,
        quantity: 1,
        rate: null,
        amount: 0,
        description: null,
      })
      return true
    },
    removeLine(detailId) {
      this.fill_fields_error = false
      if (!this.blockRemoval) {
        this.invoice_items.splice(detailId, 1)
        this.calculateTotal(null)
      }
    },
    updateInvoice() {
      const app = this
      if (this.rowIsEmpty()) {
        app.$alert('Please fill in all fields on each row')
        return
      }
      const { form } = app
      const checkEmptyFields = form.due_date === ''
      if (!checkEmptyFields) {
        app.loadForm = true
        form.invoice_items = app.invoice_items
        app.disable_submit = true
        const updateInvoice = new Resource('vdd/invoices/update')
        updateInvoice
          .vUpdate(form.id, form)
          .then(() => {
            app.$emit('updated')
            app.$message({
              message: 'Invoice Updated Successfully!!!',
              type: 'success',
            })

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
