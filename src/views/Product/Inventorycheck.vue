<style>
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
  font-size: 18px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size">
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.in_batch_number" placeholder="入库批次单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.product_name" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.product_specifications" placeholder="产品规格"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.product_code" placeholder="产品代码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="filters.production_time"
              type="date"
              style="width:200px"
              placeholder="生产日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="filters.expiration_time"
              style="width:200px"
              type="date"
              placeholder="过期日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item>
					<el-input v-model="filters.distance_day" placeholder="距保质期到期天数"></el-input>
          </el-form-item>-->
        </el-row>

        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.type_num" placeholder="类别编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.type_name" placeholder="类别名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="filters.storage_time"
              style="width:200px"
              placeholder="入库时间"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.storage_location" placeholder="存放货位"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-input v-model="filters.isphysical_location" placeholder="货位实物是否一致"></el-input> -->
            <el-select
              v-model="filters.isphysical_location"
              style="width:200px"
              placeholder="货位实物是否一致"
            >
              <el-option label="是" value="1">是</el-option>
              <el-option label="否" value="0">否</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.num" placeholder="库存数量"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: left;">
          <el-form-item>
            <el-select v-model="filters.isexpired" style="width: 200px;" placeholder="是否过期">
              <el-option label="是" value="1">是</el-option>
              <el-option label="否" value="0">否</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.order_num" placeholder="单据号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.situation_statement" placeholder="差异说明"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.is_adjustment" style="width: 200px;" placeholder="是否调整">
              <el-option label="是" value="1">是</el-option>
              <el-option label="否" value="0">否</el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.unadjusted_reason" placeholder="未调整原因"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.check_user" placeholder="盘库人"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="filters.check_time"
              placeholder="盘库时间"
              style="width:200px"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="findPage(filters)"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              :label="$t('action.add')"
              type="primary"
              @click="handleAdd"
            />
          </el-form-item>
          <!-- <el-form-item>
					<kt-button icon="fa fa-plus" :label="$t('action.excel')" perms="sys:user:add" type="primary" @click="handleAdd" />
          </el-form-item>-->
          <!-- <el-form-item>
					<kt-button icon="fa fa-print" :label="$t('action.print')" type="primary" @click="print" />
          </el-form-item>-->
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              @click="reset"
              type="primary"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="fa fa-refresh" @click="$refs.CyTable.findPageBeforeRestPages(filters)"></el-button>
            </el-tooltip>
            <el-tooltip content="列显示" placement="top">
              <el-button icon="fa fa-filter" @click="displayFilterColumnsDialog"></el-button>
            </el-tooltip>
            <el-tooltip content="导出" placement="top">
              <el-button icon="fa fa-file-excel-o" @click="downloadExcel"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
      <!--表格显示列界面-->
      <table-column-filter-dialog
        ref="tableColumnFilterDialog"
        :columns="columns"
        @handleFilterColumns="handleFilterColumns"
      ></table-column-filter-dialog>
    </div>
    <!--表格内容栏-->
    <cy-table
      :height="350"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="85%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @closed="handleClose"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="24">
            <div
              class="grid-content bg-purple"
              style="margin-top: -70px;text-align:center"
            >WMS系统库存盘点页面</div>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="入库批次号" prop="in_batch_number">
            <!-- <el-input v-model="dataForm.product_code"  auto-complete="off"></el-input> -->
            <el-select
              style="width: 214px;"
              v-model="dataForm.in_batch_number"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              @change="choseCustomer"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.in_batch_number"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品代码" prop="product_code">
            <el-input v-model="dataForm.product_code" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="存放货位" prop="storage_location">
            <el-input v-model="dataForm.storage_location" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="距保质期到期天数" prop="distance_day">
            <el-input v-model="dataForm.distance_day" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户名称" prop="client_name">
            <el-input v-model="dataForm.client_name" auto-complete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="产品名称" prop="product_name">
            <el-input v-model="dataForm.product_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品规格" prop="product_specifications">
            <el-input v-model="dataForm.product_specifications" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="库存数量" prop="num">
            <el-input v-model="dataForm.num" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="生产日期" prop="production_time">
            <!-- <el-input v-model="dataForm.production_time"  auto-complete="off"></el-input> -->
            <el-date-picker
              v-model="dataForm.production_time"
              type="date"
              placeholder="选择日期"
              style="width:214px"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="过期日期" prop="expiration_time">
            <!-- <el-input v-model="dataForm.expiration_time"  auto-complete="off"></el-input> -->
            <el-date-picker
              v-model="dataForm.expiration_time"
              type="date"
              placeholder="选择日期"
              style="width:214px"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="类别编号" prop="type_num">
            <el-input v-model="dataForm.type_num" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="类别名称" prop="type_name">
            <el-input v-model="dataForm.type_name" auto-complete="off"></el-input>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="单据号" prop="order_num">
            <el-input v-model="dataForm.order_num" auto-complete="off"></el-input>
          </el-form-item>

          <!-- <el-form-item label="是否过期" prop="isexpired">
					<el-select v-model="dataForm.isexpired" style="width: 214px;">
						 <el-option
								     v-for="item in isexpired"
									:key="item.key"
									:label="item.value"
									:value="item.key">
									</el-option>
					</el-select>
          </el-form-item>-->

          <el-form-item label="入库时间" prop="storage_time">
            <el-date-picker
              v-model="dataForm.storage_time"
              type="date"
              placeholder="选择日期"
              style="width:200px"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
            <!-- <el-input v-model="dataForm.storage_time"  auto-complete="off"></el-input> -->
          </el-form-item>
          <el-form-item label="货位实物是否一致" prop="isphysical_location">
            <!-- <el-input v-model="dataForm.isphysical_location"  auto-complete="off"></el-input> -->
            <el-select v-model="dataForm.isphysical_location" style="width: 214px;">
              <el-option label="是" value="1">是</el-option>
              <el-option label="否" value="0">否</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="差异说明" prop="situation_statement">
            <el-input v-model="dataForm.situation_statement" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否调整" prop="is_adjustment">
            <!-- <el-input v-model="dataForm.is_adjustment" auto-complete="off"></el-input> -->
            <el-select v-model="dataForm.is_adjustment" style="width: 214px;">
              <el-option label="是" value="1">是</el-option>
              <el-option label="否" value="0">否</el-option>
            </el-select>
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item label="未调整原因" prop="unadjusted_reason">
            <el-input v-model="dataForm.unadjusted_reason" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="盘库人" prop="check_user">
					<el-input v-model="dataForm.check_user" auto-complete="off"></el-input>
          </el-form-item>-->
          <!-- <el-form-item label="盘库时间" prop="check_time">
					<el-input v-model="dataForm.check_time" auto-complete="off"></el-input>
					<el-date-picker v-model="dataForm.check_time" type="date" placeholder="选择日期" style="width:200px" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>-->
          <!-- <el-form-item label="入库时间" prop="storage_time">
					<el-date-picker v-model="dataForm.storage_time" type="date" placeholder="选择日期" style="width:200px" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					<el-input v-model="dataForm.storage_time"  auto-complete="off"></el-input>
          </el-form-item>-->
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="单据证照" prop="document_license">
            <!-- <el-input v-model="dataForm.document_license" auto-complete="off"></el-input> -->
            <div style="float: left;">
              <ul class="el-upload-list el-upload-list--picture-card">
                <li
                  v-for="(bill_photo,index) in bill_photo_list"
                  :key="index"
                  :tabindex="index"
                  class="el-upload-list__item is-success"
                >
                  <img :src="bill_photo" alt class="el-upload-list__item-thumbnail" />
                  <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                  </label>
                  <i class="el-icon-close"></i>
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview">
                      <i class="el-icon-zoom-in" @click="handlePictureCardPreview(null,bill_photo)"></i>
                    </span>
                    <span class="el-upload-list__item-delete">
                      <i class="el-icon-delete" @click="handleRemove(null,null,index)"></i>
                    </span>
                  </span>
                </li>
              </ul>
            </div>

            <el-upload
              :action="imgUpload"
              :on-success="handleAvatarSuccess"
              list-type="picture-card"
              v-model="dataForm.document_license"
              accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              style="float:left"
              ref="upload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleImage">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <!--打印界面-->
    <el-dialog
      :title="operation?'打印预览':'打印'"
      width="35%"
      :visible.sync="printPage"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-tag style="margin-left: 33%;">北京东晓腾飞供应链管理有限公司</el-tag>
        <div class="demo-image__placeholder">
          <div class="block">
            <el-image :src="src" style="margin-left: 33%;width: 200px;"></el-image>
          </div>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单号:">
              <span>0234612352365</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货物名称:">
              <span>大米</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供货单位:">
              <span>南京无极有限公司</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="校验时间:">
              <span>2019-11-05</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="校验员:">
              <span>李四</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="printPage = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForms"
          :loading="editLoading"
        >{{$t('action.comfirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script src="//unpkg.com/element-ui@2.12.0/lib/index.js"></script>
<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import CyTable from "@/views/Core/CyTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      imgUpload: this.utils.getUpLoadHost(),
      size: "small",
      document_license: "",
      filters: {
        name: ""
      },

      imgs: "",
      fileList: {},
      columns: [],
      isexpired: [{ key: 0, value: "未过期" }, { key: 1, value: "已过期" }],
      options: [],
      productOptions: [],
      filterColumns: [],
      bill_photo_list: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      dialogImageUrl: "",

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,
      dialogVisibleImage: false,
      dataFormRules: {
        client_name: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        product_name: [
          { required: true, message: "请输入产品名称", trigger: "blur" }
        ],
        product_specifications: [
          { required: true, message: "请输入产品规格", trigger: "blur" }
        ],
        product_code: [
          { required: true, message: "请输入产品代码", trigger: "blur" }
        ],
        order_num: [{ required: true, message: "请输入单号", trigger: "blur" }],
        isphysical_location: [
          { required: true, message: "请输入货位实物是否一致", trigger: "blur" }
        ],
        situation_statement: [
          { required: true, message: "请输入差异说明", trigger: "blur" }
        ],
        is_adjustment: [
          { required: true, message: "请输入是否调整", trigger: "blur" }
        ],
        production_time: [
          { required: true, message: "请输入生产日期", trigger: "blur" }
        ],
        expiration_time: [
          { required: true, message: "请输入过期日期", trigger: "blur" }
        ],
        type_num: [
          { required: true, message: "请输入类别编号", trigger: "blur" }
        ],
        type_name: [
          { required: true, message: "请输入类别名称", trigger: "blur" }
        ],
        storage_time: [
          { required: true, message: "请输入入库时间", trigger: "blur" }
        ],
        storage_location: [
          { required: true, message: "请输入存放货位", trigger: "blur" }
        ],
        storage_location: [
          { required: true, message: "请输入存放货位", trigger: "blur" }
        ]
      },
      dataForm: {
        document_license: "",
        product_name: "",
        product_specifications: ""
      },
      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: [],
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change"
          }
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      src:
        "https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab"
    };
  },
  methods: {
    // 获取分页数据
    findPage: function(data) {
      this.filters.t = "inventoryCheck";
      this.$refs.CyTable.findPage(this.filters);
    },
    //查询后台库存表信息
    remoteMethod: function(query) {
      if (query !== "") {
        //查询后台客户信息
        var search = {};
        search.t = "orderStoreSkuForQuery";
        search.in_batch_number = query;
        var this_ = this;
        this.utils.request.queryUserList(search, function(res) {
          this_.options = res.data;
        });
      } else {
        this.options = [];
      }
    },
    searchProductMethod: function(query) {
      if (query !== "") {
        //查询货物信息
        var search = {};
        search.t = "sku";
        search.number = query;
        var this_ = this;
        this.utils.request.queryUserList(search, function(res) {
          this_.productOptions = res.data;
        });
      } else {
        this.options = [];
      }
    },
    //模糊匹配
    choseCustomer: function(selVal) {
      var temp = this.options;
      var this_ = this;

      if (selVal == "" || selVal == null) {
        this_.dataForm.in_batch_number = "";
        this_.dataForm.product_name = "";
        this_.dataForm.product_specifications = "";
        this_.dataForm.production_time = "";
        this_.dataForm.expiration_time = "";
        this_.dataForm.num = "";
        this_.dataForm.product_code = "";
        this_.dataForm.storage_location = "";
        this_.dataForm.client_name = "";
        this_.dataForm.type_name = "";
        this_.dataForm.type_num = "";
      } else {
        $.each(temp, function(key, val) {
          if (val.id == selVal) {
            this_.dataForm.in_batch_number = val.in_batch_number;
            this_.dataForm.product_name = val.name;
            this_.dataForm.product_specifications = val.level; //产品规格
            this_.dataForm.production_time = val.roduction_date; //生产日期
            this_.dataForm.expiration_time = val.expiration_date; //过期日期
            this_.dataForm.num = val.num; //库存数量
            this_.dataForm.product_code = val.product_code; //产品代码
            this_.dataForm.storage_location = val.storage_location; //存放货位
            this_.dataForm.client_name = val.client_name; //客户名称
            this_.dataForm.type_name = val.type_name; //类别名称
            this_.dataForm.type_num = val.type_num; //类别编号
            this_.dataForm.distance_day = val.distance_day; //局保质期天数
            this_.dataForm.order_num = val.bill; //单号
            this_.dataForm.storage_time = val.instock_time; //入库时间
            this_.dataForm.isexpired = val.isexpired; //是否过期

            this_.dataForm = Object.assign({}, this_.dataForm);

            return;
          }
        });
      }
    },
    clearFiles() {
      this.$refs["upload"].clearFiles();
    },
    handleClose() {
      this.clearFiles();
      this.bill_photo_list = [];
      this.$refs.dataForm.resetFields();
    },

    // 批量删除
    handleDelete: function(data) {
      var ids = "";
      for (var i = 0; i < data.params.length; i++) {
        ids = ids + data.params[i].id + ",";
      }
      data.t = "inventoryCheck";
      data.ids = ids;
      this.utils.request.deleteUserInfo(data, this.deleteInfoBack);
    }, //删除callback
    deleteInfoBack(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
      } else {
        this.$message({ message: "操作失败, ", type: "error" });
      }
      this.findPage();
    },
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "库存盘点";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
      this.dataForm.id = "";
      //this.dataForm={};
      if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }
      this.dataForm.document_license = "";
      // this.dataForm = {
      // 	id: 0,
      // 	name: '',
      // 	password: '',
      // 	deptId: 1,
      // 	deptName: '',
      // 	email: 'test@qq.com',
      // 	phone: '13889700023',
      // 	status: 1,
      // 	userRoles: []
      // }
    },
    // 打印
    print: function() {
      this.printPage = true;
      this.operation = true;
    },
    reset: function() {
      this.filters = {};

      this.$refs.CyTable.resetForm();
      this.findPage();
    },

    //图片移除
    handleRemove(file, fileList, index) {
      if (this.utils.isNull(index)) {
        this.fileList = fileList;
        if (fileList.length == 0) {
          this.dataForm.document_license = "";
        } else {
          this.imgs = fileList
            .map(item => item.response.data.imgUrl)
            .toString();
          this.dataForm.document_license = this.imgs;
        }
      } else {
        this.bill_photo_list.splice(index, 1);
      }

      console.log(this.dataForm.document_license);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.ImageUrl = file.url;
      this.dialogVisibleImage = true;
    },
    //上传成功回调
    handleAvatarSuccess(res, file) {
      if (res.data.imgUrl == "") {
        this.$message({ message: "上传失败", type: "error" });
      } else {
        this.dataForm.document_license += res.data.imgUrl + ",";
        console.log(this.dataForm.document_license);
        this.imageUrl = URL.createObjectURL(file.raw);
      }
    },

    // 显示编辑界面
    handleEdit: function(params) {
      console.log(params);
      this.dialogVisible = true;
      this.operation = false;

      this.$nextTick(function() {
        this.dataForm = Object.assign({}, params.row);
      });

      var this_ = this;
      var search = {};
      search.id = params.row.id;
      search.t = "inventoryCheck";

      this.utils.request.queryUserInfo(search, function(res) {
        if (res.code == "0000") {
          this_.tableData = res.data;
          this_.bill_photo_list = this_.dataForm.document_license.split(",");
          this_.dataForm.document_license = "";
        } else {
          this_.$message({ message: "获取产品信息异常", type: "error" });
        }
      });

      // let userRoles = []
      // for(let i=0,len=params.row.length; i<len; i++) {
      // 	userRoles.push(params.row.userRoles[i].roleId)
      // }
      // this.dataForm.userRoles = userRoles;
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            var this_ = this;
            this.editLoading = true;
            let params = Object.assign({}, this.dataForm);
            params.t = "inventoryCheck";
            if (params.is_expired_days >= 0) {
              params.isexpired = 1;
            } else {
              params.isexpired = 0;
            }
            // parma.tableData = JSON.stringify(this.tableData);

            var documentlicense = params.document_license.split(",");
            //连接两个数组
            documentlicense = documentlicense.concat(this.bill_photo_list);

            //过滤多余的','
            params.document_license = documentlicense
              .filter(function(e) {
                if (this_.utils.isNull(e)) {
                } else {
                  return e;
                }
              })
              .join(",");
            this.utils.request.editUserInfo(params, this.editInfoBack);
          });
        }
      });
    }, // 新增修改回调
    editInfoBack: function(data) {
      if (data.code == "0000") {
        this.$message({ message: "操作成功", type: "success" });
      } else {
        this.$message({ message: "操作失败, ", type: "error" });
      }
      this.findPage();
      this.dialogVisible = false;
      this.operation = false;
      this.editLoading = false;
    },

    choseProduct: function(selVal) {
      var temp = this.productOptions;
      var this_ = this;

      if (selVal == "" || selVal == null) {
        this_.dataForm.product_name = "";
        this_.dataForm.level = "";
        this_.dataForm.sku_id = "";
      } else {
        $.each(temp, function(key, val) {
          if (val.id == selVal) {
            this_.dataForm.product_name = val.name;
            this_.dataForm.product_specifications = val.level;
            this_.dataForm.product_code = val.number;
            return;
          }
        });
      }
    },
    handleSelect(item) {
      if (item != null && item != "") {
        //复制
        var driverData = $.extend(true, [], this.productForm.driverData);
        var isFirst = false;
        var this_ = this;
        $.each(driverData, function(key, val) {
          if (val.driver_number == item.driver_number) {
            val.mobile = item.mobile;
            val.driver_type = item.driver_type;
            val.drivername = item.drivername;
            val.remark = item.remark;
            val.id = item.id;
            return false;
          }
        });

        this.productForm.driverData = driverData;
      } else {
      }
    },
    // 时间格式化
    dateFormat: function(row, column, cellValue, index) {
      return format(row[column.property]);
    },

    // 处理表格列过滤显示
    displayFilterColumnsDialog: function() {
      this.$refs.tableColumnFilterDialog.setDialogVisible(true);
    },
    // 处理表格列过滤显示
    handleFilterColumns: function(data) {
      this.filterColumns = data.filterColumns;
      this.$refs.tableColumnFilterDialog.setDialogVisible(false);
    },
    // 处理表格列过滤显示
    initColumns: function() {
      this.columns = [
        //{prop:"id", label:"ID", minWidth:50},
        { prop: "in_batch_number", label: "入库批次号", minWidth: 120 },
        { prop: "client_name", label: "客户名称", minWidth: 120 },
        { prop: "product_name", label: "产品名称", minWidth: 120 },
        { prop: "product_specifications", label: "产品规格", minWidth: 120 },
        { prop: "product_code", label: "产品代码", minWidth: 120 },
        { prop: "order_num", label: "单据号", minWidth: 120 },
        {
          prop: "isphysical_location",
          label: "货位实物是否一致",
          minWidth: 120,
          formatter: this.location
        },
        { prop: "situation_statement", label: "差异说明", minWidth: 120 },
        {
          prop: "is_adjustment",
          label: "是否调整",
          minWidth: 120,
          formatter: this.location
        },
        { prop: "unadjusted_reason", label: "未调整原因", minWidth: 120 },
        { prop: "production_time", label: "生产日期(产品批次)", minWidth: 120 },
        { prop: "expiration_time", label: "过期日期", minWidth: 120 },
        { prop: "distance_day", label: "距保质期到期天数", minWidth: 120 },
        { prop: "type_num", label: "类别编号", minWidth: 120 },
        { prop: "type_name", label: "类别名称", minWidth: 120 },
        { prop: "storage_time", label: "入库时间", minWidth: 120 },
        { prop: "storage_location", label: "存放货位", minWidth: 120 },
        { prop: "num", label: "库存数量(件数)", minWidth: 120 },
        {
          prop: "isexpired",
          label: "是否过期",
          minWidth: 120,
          formatter: this.expired
        },
        // {prop:"document_license", label:"单据证照", minWidth:120},
        { prop: "checkname", label: "盘库人", minWidth: 120 },
        { prop: "create_time", label: "盘库时间", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 120 }
      ];
      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },
    location: function(row, column, cellValue, index) {
      if (cellValue == 1) {
        return "是";
      } else {
        return "否";
      }
    },
    expired: function(row, column, cellValue, index) {
      if (cellValue == 1) {
        return "是";
      } else {
        return "否";
      }
    }
  },
  mounted() {
    this.findPage();
    this.initColumns();
  }
};
</script>

<style scoped>
/deep/ .el-input__inner  {
      width: 200px;
}
 .el-form-item--mini.el-form-item,
 .el-form-item--small.el-form-item  {
      margin-bottom: 10px;
}
</style>