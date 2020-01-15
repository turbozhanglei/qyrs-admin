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
  align: "center";
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
            <el-input v-model="filters.product_name" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.product_specifications" placeholder="产品规格"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.production_Date" placeholder="生产日期"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.expiration_date" placeholder="过期日期"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-select v-model="filters.storage_warehouse" style="width: 192px;" placeholder="类别编号">  
					<el-option label="顺义库" value="顺义库"></el-option>
					<el-option label="顺义八喜库" value="顺义八喜库"></el-option>
					<el-option label="通州库" value="通州库"></el-option>
					<el-option label="通州库" value="顺义库"></el-option>
            </el-select>-->
            <el-input v-model="filters.storage_time" placeholder="入库时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.out_order_mycompany" placeholder="我司出库单号"></el-input>
          </el-form-item>
        </el-row>

        <el-row style="text-align: left;">
          <el-form-item>
            <!-- <el-select v-model="filters.storage_area" style="width: 192px;" placeholder="存放区域">  
					<el-option label="自有库" value="自有库"></el-option>
					<el-option label="委外库" value="委外库"></el-option>
            </el-select>-->
            <el-input v-model="filters.storage_location" placeholder="存放货位"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.out_Date" placeholder="出库时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.out_weight" placeholder="出库产品总重量"></el-input>
            <!-- <el-select v-model="filters.uncheck_repository" style="width: 192px;" placeholder="待检存放库">
					<el-option label="顺义库" value="顺义库"></el-option>
					<el-option label="顺义八喜库" value="顺义八喜库"></el-option>
					<el-option label="通州库" value="通州库"></el-option>
					<el-option label="通州库" value="顺义库"></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.out_num" placeholder="出库数量"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.out_order_client" placeholder="客户出库单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.receive_warehouse_name" placeholder="收货仓库名称"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.isexpired" placeholder="是否过期"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.distance_day" placeholder="距保质期到期天数"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.out_weight" placeholder="出库承运车辆"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.out_num" placeholder="承运车辆车牌号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.out_order_client" placeholder="承运车型"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.receive_warehouse_name" placeholder="承运司机姓名"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.receive_receive_address" placeholder="收货仓库具体地址"></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-select v-model="filters.isexpired" style="width: 192px;" placeholder="是否过期">
					<el-option label="是" value="是"></el-option>
					<el-option label="否" value="否"></el-option>
            </el-select>-->
            <el-input v-model="filters.receive_name" placeholder="收货方对接人"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.phone" placeholder="联系方式（手机）"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.client_maker" placeholder="客户方制单人"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.operator" placeholder="我司操作员"></el-input>
          </el-form-item>
        </el-row>
        <el-row style="text-align: left;">
          <el-form-item>
            <el-input v-model="filters.create_Date" placeholder="制单时间"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="filters.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              perms="sys:role:view"
              type="primary"
              @click="$refs.CyTable.findPageBeforeRestPages(filters)"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              :label="$t('action.add')"
              perms="sys:user:add"
              type="primary"
              @click="handleAdd"
            />
          </el-form-item>
          <!-- <el-form-item>
					<kt-button icon="fa fa-plus" :label="$t('action.excel')" perms="sys:user:add" type="primary" @click="handleAdd" />
          </el-form-item>-->
          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              :label="$t('action.print')"
              perms="sys:user:print"
              type="primary"
              @click="print"
            />
          </el-form-item>

          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              label="出库"
              type="primary"
              @click="outSku"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              :label="$t('action.reset')"
              perms="
					basics:warehouseinformation:reset"
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
            <!-- <el-tooltip content="导出" placement="top">
					<el-button icon="fa fa-file-excel-o"></el-button>
            </el-tooltip>-->
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
    <kt-table
      :height="350"
      permsEdit="sys:user:edit"
      permsDelete="sys:user:delete"
      @selectionChange="selectionChange"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    ></kt-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="85%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
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
            >WMS系统订单出库页面</div>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="存放货位" prop="cargo_id">
            <el-select v-model="dataForm.cargo_id" placeholder="请选择" @change="querySettingSkus">
              <el-option
                v-for="item in settings"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户名称" prop="customer_id">
            <el-select v-model="dataForm.customer_id" placeholder="请选择">
              <el-option
                v-for="item in customers"
                :key="item.id"
                :label="item.legalname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户出库单号" prop="customer_no">
            <el-input v-model="dataForm.customer_no" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="单据证照" prop="order_licence">
            <el-input v-model="dataForm.order_licence" auto-complete="off"></el-input>
          </el-form-item>

          <el-divider></el-divider>
        </el-row>
        <el-row>
          <el-form-item label="收货仓库名称" prop="recipient_store">
            <el-input v-model="dataForm.recipient_store" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="收货仓库具体地址" prop="recipient_store_address">
            <el-input v-model="dataForm.recipient_store_address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="收货方对接人" prop="recipient_people">
            <el-input v-model="dataForm.recipient_people" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系方式（手机）" prop="recipient_people_mobile">
            <el-input v-model="dataForm.recipient_people_mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="预入库时间" prop="storage_time">
            <!-- <el-input v-model="dataForm.storage_time"  auto-complete="off" type="datetime"></el-input> -->
            <el-date-picker
              v-model="dataForm.storage_time"
              type="date"
              placeholder="选择日期"
              style="width:86%"
            ></el-date-picker>
          </el-form-item>
          <el-divider></el-divider>
        </el-row>
        <!-- <el-row>
				<el-form-item label="承运车辆" prop="driver_id">
					<el-select v-model="dataForm.driver_id" @change="getDriverInfo" placeholder="请选择">
						<el-option
						v-for="item in drivers"
						:key="item.id"
						:label="item.driver_number"
						:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="承运车型" prop="driver_car_type">
					<el-input v-model="dataForm.driver_type" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="承运司机姓名" prop="driver_name">
					<el-input v-model="dataForm.drivername" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="承运司机联系方式" prop="driver_phone">
					<el-input v-model="dataForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
        </el-row>-->
        <el-row>
          <el-form-item label="客户方制单人" prop="client_maker">
            <el-input v-model="dataForm.client_maker" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="出库时间" prop="out_stock">
            <!-- <el-input v-model="dataForm.out_Date"  auto-complete="off"></el-input> -->
            <el-date-picker
              v-model="dataForm.out_stock"
              type="date"
              placeholder="选择日期"
              style="width:86%"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
     
      <div>
        <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" tooltip-effect="dark" ref="multipleTable">
            <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="产品名称" width="180" prop="name"></el-table-column>
          <el-table-column label="产品规格" width="180" prop="level"></el-table-column>
          <el-table-column label="托盘编码" width="180" prop="tnumber"></el-table-column>
          <el-table-column label="托盘名称" width="180" prop="tname"></el-table-column>
          <el-table-column label="生产日期" width="180" prop="roduction_date"></el-table-column>
          <el-table-column label="过期时间" width="180" prop="expiration_date"></el-table-column>
          <el-table-column label="下单时间" width="180" prop="create_time"></el-table-column>
          <el-table-column label="下单数量" width="180" prop="stock"></el-table-column>
          <el-table-column label="出库数量" width="180">
            <template slot-scope="scope">
              <input type="text" class="el-input__inner" style="width: 150px;" v-model="stock_num['stock_'+scope.row.id]"  placeholder="请输入出库数量" @change="getStockNum(scope.row)"/>
            </template>
          </el-table-column>

          <el-table-column label="姓名" width="180">
            <template slot-scope="scope">
              <div v-for="item in driver_list['keys_'+scope.row.id]" :key="item.id">
                <el-popover trigger="hover" placement="top">
                  <p>联系方式: {{ item.mobile }}</p>
                  <p>车辆类型: {{ item.type_val }}</p>
                  <p>车牌号: {{ item.driver_number }}</p>
                  <div slot="reference" class="name-wrapper" style="margin:10px;float:left">
                    <el-tag size="medium">{{ item.drivername }}</el-tag>
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="备注" width="180" prop="remark"></el-table-column>

          <el-table-column label="操作" width="250" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini"  @click="productAdd(scope.row)">绑定司机</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

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

    <!--产品编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="80%"
      :visible.sync="productmodal"
      :close-on-click-modal="false"
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
            >绑定司机</div>
          </el-col>
        </el-row>
        <el-row>
          <!--表格内容栏-->
          <!-- <el-table :data="pageDriverResult" style="width: 100%" @current-change="handleSelectionChange" tooltip-effect="dark" ref="multipleTable">
            <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="司机姓名" width="180" prop="drivername"></el-table-column>
          <el-table-column label="联系方式" width="180" prop="mobile"></el-table-column>
          <el-table-column label="车辆类型" width="180" prop="type_val"></el-table-column>
          <el-table-column label="车牌号" width="180" prop="driver_number"></el-table-column>
        </el-table>
  -->
          <kt-table
            :height="350"
            :data="pageDriverResult"
            :columns="filterColumnsPro"
            @selectionChange="driverSelectionChange"
            @findPage="getDriverPage"
          ></kt-table>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="productmodal = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="driverSubmitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
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
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.comfirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput";
import KtTable from "@/views/Core/KtTable";
import KtButton from "@/views/Core/KtButton";
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog";
import { format } from "@/utils/datetime";
export default {
  components: {
    PopupTreeInput,
    KtTable,
    KtButton,
    TableColumnFilterDialog
  },
  data() {
    return {
      tableData1: [{}, {}],
      tableData: [
      ],
      size: "small",
      filters: {
        name: ""
      },
      check_id:'',
      driver_list:{},
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},
      pageDriverResult:{},
      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,
      productmodal: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        property: [{ required: true, message: "请仓库属性", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        
      },
      selections:[],
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
        "https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab",
      settings: [],
      customers: [],
      drivers: [],
      stock_num:{},
      products:[]
    };
  },
  methods: {
    // 获取分页数据
    findPage(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      var that = this;
      this.filters.t = "outSku";
      this.filters.start = this.pageRequest.pageNum;
      this.filters.limit = this.pageRequest.pageSize;
      this.utils.request.queryUserPage(this.filters, function(datas) {
        that.pageResult = {
          content: datas.rows,
          totalSize: parseInt(datas.total)
        };
      });
    },
    // 加载用户角色信息
    findUserRoles: function() {
      this.$api.role.findAll().then(res => {
        // 加载角色集合
        this.roles = res.data;
      });
    },
    // 批量删除
    handleDelete: function(data) {
      this.$api.user
        .batchDelete(data.params)
        .then(data != null ? data.callback : "");
    },
    // 显示新增界面
    handleAdd: function() {
      var this_ = this;
      this.dialogVisible = true;
      this.operation = true;
      //加载货位
      this.utils.request.queryUserList({ t: "warehouseSiteSetting" }, function(
        data
      ) {
        this_.settings = data.data;
      });
      //加载客户
      this.utils.request.queryUserList({ t: "wcustomer" }, function(data) {
        this_.customers = data.data;
      });
      //加载司机
      this.utils.request.queryUserList({ t: "wdriver" }, function(data) {
        this_.drivers = data.data;
      });
    },
    // 打印
    print: function() {
      this.printPage = true;
      this.operation = true;
    },
    // 新增商品信息
    productAdd: function(data) {
      this.check_id=data.id;
      this.productmodal = true;
      this.operation = true;
    },

    // 显示编辑界面
    handleEdit: function(params) {
      console.log(params);
      this.dialogVisible = true;
      this.operation = false;
      this.dataForm = Object.assign({}, params.row);
      let userRoles = [];
      for (let i = 0, len = params.row.userRoles.length; i < len; i++) {
        userRoles.push(params.row.userRoles[i].roleId);
      }
      this.dataForm.userRoles = userRoles;
    },
    // 编辑
    submitForm: function() {
      var this_=this;
      this.$confirm("确认选择吗？", "提示", {}).then(() => {
          this.editLoading = true;
          this.editLoading = false;
          this_.dataForm.driver_list=JSON.stringify(this_.driver_list);
          this_.dataForm.stock_num=JSON.stringify(this_.stock_num);
          this_.dataForm.products=JSON.stringify(this_.products);
          if(null==this_.driver_list){
              this_.$message({ message: "司机不能为空", type: "warning" });
              return false;
          }
          if(null==this_.stock_num || this_.stock_num.length<=0 ){
              this_.$message({ message: "出库数量不能为空", type: "warning" });
              return false;
          }
          this_.utils.request.saveSaleOrder(this_.dataForm, function(datas) {
            
          });
          this.$message({ message: "操作成功", type: "success" });
          this.dialogVisible = false;
      });
    },
    // 编辑
    driverSubmitForm: function() {
      var this_=this;
      this.$confirm("确认选择吗？", "提示", {}).then(() => {
          console.log(this_.driver_list)
          this.editLoading = true;
          this.editLoading = false; 
          this.$message({ message: "操作成功", type: "success" });
          this.productmodal = false;
          this.operation = false;
      });
    },
    // 获取部门列表
    findDeptTree: function() {
      this.$api.dept.findDeptTree().then(res => {
        this.deptData = res.data;
        console.log(this.deptData);
      });
    },
    // 菜单树选中
    deptTreeCurrentChangeHandle(data, node) {
      this.dataForm.deptId = data.id;
      this.dataForm.deptName = data.name;
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
        { prop: "order_no", label: "出库单号", minWidth: 120 },
        { prop: "name", label: "存放货位", minWidth: 150 },
        { prop: "username", label: "客户名称", minWidth: 150 },
        { prop: "customer_no", label: "客户出库单号", minWidth: 150 },
        { prop: "order_licence", label: "单据证照", minWidth: 150 },
        { prop: "recipient_store", label: "收货仓库", minWidth: 150 },
        {
          prop: "recipient_store_address",
          label: "收货仓库地址",
          minWidth: 120
        },
        { prop: "recipient_people", label: "收货人", minWidth: 120 },
        { prop: "recipient_people_mobile", label: "联系方式", minWidth: 120 },
        { prop: "storage_time", label: "预入库时间", minWidth: 120 },
        { prop: "driver_number", label: "出库承运车辆", minWidth: 120 },
        { prop: "driver_type", label: "承运车型", minWidth: 120 },
        { prop: "drivername", label: "承运司机", minWidth: 120 },
        { prop: "mobile", label: "司机联系方式", minWidth: 120 },
        { prop: "customer_make", label: "客户方制单人", minWidth: 120 },
        { prop: "create_time", label: "制单时间", minWidth: 120 },
        { prop: "out_stock", label: "出库日期", minWidth: 120 },
        { prop: "order_status", label: "状态", minWidth: 120 },
        { prop: "creator_name", label: "操作人", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 120 }
      ];
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));

      this.columnsPro = [ 
        { prop: "drivername", label: "司机姓名", minWidth: 120 },
        { prop: "mobile", label: "联系方式", minWidth: 120 },
        { prop: "type_val", label: "车辆类型", minWidth: 120 },
        { prop: "driver_number", label: "车牌号", minWidth: 120 },
      ];
      this.filterColumnsPro = JSON.parse(JSON.stringify(this.columnsPro));
    },
    getDriverInfo() {
      var this_ = this;
      //加载司机详细信息
      this.utils.request.queryUserInfo(
        { t: "wdriver", id: this.dataForm.driver_id },
        function(data) {
          if (null != data.data) {
            this_.dataForm.driver_type = data.data.driver_type_val;
            this_.dataForm.drivername = data.data.drivername;
            this_.dataForm.mobile = data.data.mobile;
            this_.$forceUpdate();
          }
        }
      );
    },
    querySettingSkus() {
      var this_ = this;
      //加载司机详细信息
      this.utils.request.queryUserList(
        {
          t: "norderStoreSku",
          sql: "querySettingSkus",
          setting_id: this.dataForm.cargo_id
        },
        function(data) {
          if (null != data.data) {
			      this_.tableData=data.data
          }
        }
      );
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.products=val;
      this.multipleSelection = val;
    },  
    driverSelectionChange(val) {
      var array=[];
      for(var i=0;i<val.selections.length;i++){
        array.push(val.selections[i]);
      }
      this.$set(this.driver_list,`keys_${this.check_id}`,array)
      this.$forceUpdate();
    },
    getDriverPage(data) {
      if (data !== null) {
        this.pageRequest = data.pageRequest;
      }
      var that = this;
      this.filters.t = "wdriver";
      this.filters.start = this.pageRequest.pageNum;
      this.filters.limit = this.pageRequest.pageSize;
      this.utils.request.queryUserPage(this.filters, function(datas) {
        that.pageDriverResult = {
          content: datas.rows,
          totalSize: parseInt(datas.total)
        };
      });
    },
    getStockNum(data){
      if(parseFloat(this.stock_num['stock_'+data.id])>parseFloat(data.stock)){
        this.$message({ message: "出库数量不能大于库存数量", type: "warning" });
        this.$set(this.stock_num,`stock_${data.id}`,'')
      }
    },
     selectionChange:function(data){
			this.selections = data.selections;
		},
    //出库
     outSku: function(){
    
		   if(this.selections.length == 0){
				this.$message({message: '请至少选择一条数据', type: 'error'})
				return;
       } else{
         var  data = {};
		    	var ids = "";
                var sale_ids="";
          $.each(this.selections,function(key,value){

            ids = ids + ","  + value.id;

          })
            $.each(this.selections,function(key,value){

            sale_ids = sale_ids + ","  + value.sale_id;

          })
			
			   data.ids = ids;
                data.sale_ids=sale_ids;
         var this_ = this;
         this.utils.request.upSkuStatus(data,function(){

           if(res.code == "0000"){
					 this_.$message({message: '出库完成', type: 'success'});
					 this_.checkpage=false;
					 this_.findPage()
				 }else{
 					 this_.$message({message: res.msg, type: 'error'})
				 }
         })

         
       }
       
           this.checkpage=true;
		},
  },
  mounted() {
    this.findDeptTree();
    this.initColumns();
  }
};
var testdata = { 
};
</script>

<style scoped>
/deep/ .el-input__inner {
  width: 200px;
}
</style>