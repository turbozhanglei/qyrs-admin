<template>
  <div class="page-container">
    <!--工具栏-->
    <div class="toolbar" style="float:left;padding-top:10px;padding-left:15px;">
      <el-form :inline="true" :model="filters" :size="size" ref="filters" class="form">
        <el-form-item prop="sku_number">
          <el-input v-model="filters.sku_number" placeholder="产品代码"></el-input>
        </el-form-item>
        <el-form-item prop="sku_name">
          <el-input v-model="filters.sku_name" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item prop="sku_level">
          <el-input v-model="filters.sku_level" placeholder="产品规格"></el-input>
        </el-form-item>
        <el-form-item prop="sku_type_number">
          <el-input v-model="filters.sku_type_number" placeholder="类别编号"></el-input>
        </el-form-item>
        <el-form-item prop="sku_type_text">
          <el-input v-model="filters.sku_type_text" placeholder="类别名称"></el-input>
        </el-form-item>

        <el-form-item prop="unit_weight">
          <el-input v-model="filters.unit_weight" placeholder="单件产品重量"></el-input>
        </el-form-item>
        <el-form-item prop="unit_volume">
          <el-input v-model="filters.unit_volume" placeholder="单件产品体积"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.driver_car_number" placeholder="到货车辆车牌号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.driver_car_type" placeholder="到货承运车型"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.driver_name" placeholder="到货承运司机姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.driver_phone" placeholder="到货承运司机联系方式"></el-input>
        </el-form-item>
        <el-form-item prop="bill">
          <el-input v-model="filters.bill" placeholder="单据号"></el-input>
        </el-form-item>

        <el-form-item prop="isexpired">
          <el-select v-model="filters.isexpired" placeholder="是否过期">
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="client_name">
          <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
        </el-form-item>

        <el-form-item prop="creator_name">
          <el-input v-model="filters.creator_name" placeholder="检验员"></el-input>
        </el-form-item>

        <el-form-item prop="inspecter_result">
          <el-select v-model="filters.inspecter_result" placeholder="检验结论">
            <el-option label="全部合格" value="0"></el-option>
            <el-option label="部分合格" value="1"></el-option>
            <el-option label="部分不合格" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="remark">
          <el-input v-model="filters.remark" placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item prop="order_no">
          <el-input v-model="filters.order_no" placeholder="入库订单号"></el-input>
        </el-form-item>

        <el-row>
          <el-form-item>
            <el-form-item prop="status">
              <el-select v-model="filters.status" placeholder="状态" @change="qualityStatus">
                <el-option label="待分配" value="0"></el-option>
                <el-option label="已分配" value="1"></el-option>
              </el-select>
            </el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="$refs.CyTable.findPageBeforeRestPages(filters)"
            />
          </el-form-item>
          <!-- <el-form-item>
            <kt-button
              icon="el-icon-printer"
              :label="$t('action.print')"
              type="primary"
              @click="print"
            />
          </el-form-item>-->
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="resetSelection"
            />
            <kt-button icon="el-icon-setting" label="库位配置" @click="handleEdit" type="primary" />
            <kt-button
              icon="fa el-icon-folder-add"
              label="批量入库"
              @click="batchIntoStoreBuySku"
              type="primary"
            />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="toolbar" style="float:right;padding-top:10px;padding-right:15px;">
      <el-form :inline="true" :size="size" label-width="120px">
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
      :showOperation="false"
      :data="pageResult"
      :columns="filterColumns"
      @findPage="findPage"
      @selectionChange="selectionChange"
      ref="CyTable"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增':'编辑'"
      width="85%"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        :model="dataForm"
        label-width="80px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        class="form"
        label-position="right"
        inline
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="客户名称" prop="client_name">
          <el-input v-model="dataForm.client_name"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" prop="sku_name">
          <el-input v-model="dataForm.sku_name"></el-input>
        </el-form-item>
        <el-form-item label="产品代码" prop="sku_number">
          <el-input v-model="dataForm.sku_number"></el-input>
        </el-form-item>

        <el-form-item label="产品规格" prop="sku_level">
          <el-input v-model="dataForm.sku_level"></el-input>
        </el-form-item>
        <el-form-item label="类别编号" prop="sku_type_number">
          <el-input v-model="dataForm.sku_type_number"></el-input>
        </el-form-item>
        <el-form-item label="类别名称" prop="sku_type_text">
          <el-input v-model="dataForm.sku_type_text"></el-input>
        </el-form-item>
        <el-form-item label="生产日期" prop="roduction_date">
          <el-date-picker
            v-model="dataForm.roduction_date"
            type="datetime"
            placeholder="选择日期"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="过期日期" prop="expiration_date">
          <el-date-picker
            v-model="dataForm.expiration_date"
            type="datetime"
            placeholder="选择日期"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="单据号" prop="bill">
          <el-input v-model="dataForm.bill"></el-input>
        </el-form-item>

        <!-- 				
				<el-form-item label="待检存放库" prop="uncheck_repository">
					<el-input v-model="dataForm.uncheck_repository"  ></el-input>
        </el-form-item>-->
        <el-form-item label="单件产品体积(m3)" prop="unit_volume">
          <el-input v-model="dataForm.unit_volume"></el-input>
        </el-form-item>
        <el-form-item label="单件产品重量(kg)" prop="unit_weight">
          <el-input v-model="dataForm.unit_weight"></el-input>
        </el-form-item>
        <el-form-item label="到货数量" prop="arrival_num" required>
          <el-input type="number" v-model="dataForm.arrival_num"></el-input>
        </el-form-item>
        <el-form-item label="合格数量" prop="qualified_num" required>
          <el-input type="number" @change="dealWithqualifiedNum" v-model="dataForm.qualified_num"></el-input>
        </el-form-item>
        <el-form-item label="不合格数量" prop="unqualified_num" required>
          <el-input type="number" v-model="dataForm.unqualified_num"></el-input>
        </el-form-item>
        <el-form-item label="是否过期" prop="isexpired" required>
          <el-select v-model="dataForm.isexpired" placeholder="请选择">
            <el-option
              v-for="item in isexpiredOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检验结论" prop="inspecter_result" required>
          <el-select v-model="dataForm.inspecter_result" placeholder="请选择">
            <el-option
              v-for="item in inspecterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="检验员" prop="creator_name">
          <el-input v-model="dataForm.creator_name"></el-input>
        </el-form-item>

        <el-form-item label="单据证照" prop="bill_photo">
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
            v-model="dataForm.bill_photo"
            accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
            :on-remove="handleRemove"
            :on-preview="handlePictureCardPreview"
            style="float:left"
            ref="upload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" type="textarea" style="width:600px" :rows="5"></el-input>
          </el-form-item>
        </el-row>
        <div class="toolbar" style="float:right;padding-right:15px;">
          <div slot="footer" class="dialog-footer" style="text-align:center">
            <kt-button icon="fa fa-plus" :label="$t('action.add')" type="primary" @click="trayAdd" />
          </div>
        </div>
        <div style="clear:both">
          <el-table :data="siteSettingData" style="width: 100%" class="table">
            <el-table-column label="托盘编号" prop="tray_number">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.tray_number"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  @change="choseTray($event,scope.row)"
                  :remote-method="remoteMethod"
                  v-if="scope.row.status != 2"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.number"
                    :value="item"
                  ></el-option>
                </el-select>
                <span v-else>{{scope.row.tray_number}}</span>
              </template>
            </el-table-column>
            <el-table-column label="托盘名称" prop="tray_name">
              <template slot-scope="scope">
                <el-input v-model="scope.row.tray_name" v-if="scope.row.status != 2"></el-input>
                <span v-else>{{scope.row.tray_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="仓库" prop="warehouse_id">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.warehouse_id"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="warehouseMethod"
                  @change="choseHouse($event,scope.$index,scope.row)"
                  v-if="scope.row.status != 2"
                >
                  <el-option
                    v-for="item in warehouseoptions"
                    :key="item.warehouse_id"
                    :label="item.name"
                    :value="item.warehouse_id"
                  ></el-option>
                </el-select>
                <span v-else>{{scope.row.house_name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="库区" prop="warehouse_area_id">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.warehouse_area_id"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="warehouseAreaMethod"
                  @change="choseArea($event,scope.$index,scope.row)"
                  v-if="scope.row.status != 2" 
                >
                  <el-option
                    v-for="item in warehouseareaoptions"
                    :key="item.warehouse_area_id"
                    :label="item.name"
                    :value="item.warehouse_area_id"
                  ></el-option>
                </el-select>
                <span v-else>{{scope.row.area_name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="数量" width="120" prop="stock">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.stock"
                  type="number"
                  @change="dealWithStock($event,scope.$index,scope.row)"
                  v-if="scope.row.status != 2"
                ></el-input>
                <span v-else>{{scope.row.stock}}</span>
              </template>
            </el-table-column>

            <el-table-column label="待分配数量" width="120" prop="allocated_num">
              <template slot-scope="scope">{{ dataForm.allocated_num}}</template>
            </el-table-column>

            <el-table-column label="货位" prop="setting_id">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.setting_id"
                  clearable
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="(query)=>{warehousesettingMethod(query,scope.$index,scope.row)}"
                  @change="chosesetting($event,scope.$index,scope.row)"
                  v-if="scope.row.status != 2"
                >
                  <el-option
                    v-for="item in warehoussettingoptions"
                    :key="item.id"
                    :label="item.number"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <span v-else>{{scope.row.set_number}}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="285">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="success">打印</el-button> -->
                <el-button
                  size="mini"
                  type="success"
                  v-if="scope.row.status != 2"
                  @click="handleIntoStoreBuySku(scope.$index, scope.row)"
                >入库</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  v-if="scope.row.status != 2"
                  @click="handleDeleteOrderBuySku(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size" type="primary" @click.native="submitForm">{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <!--打印界面-->
    <el-dialog title="打印预览'" width="35%" :visible.sync="printPage" :close-on-click-modal="false"></el-dialog>

    <!--图片预览-->
    <el-dialog :visible.sync="showPictureDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

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
      showPictureDialogVisible: false,
      dialogImageUrl: "",
      bill_photo_list: [],
      size: "small",
      size: "small",
      siteSettingData: [],
      inspecterOptions: [
        {
          value: 0,
          label: "全部合格"
        },
        {
          value: 1,
          label: "部分合格"
        },
        {
          value: 2,
          label: "部分不合格"
        }
      ],
      isexpiredOptions: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        }
      ],
      filters: {
        t: "order_buy_checked",
        order_no: "",
        buy_sku_status: 2,
        status: "0",
        sku_number: "",
        sku_name: "",
        sku_level: "",
        sku_type_number: "",
        sku_type_text: "",
        unit_weight: "",
        unit_volume: "",
        driver_car_number: "",
        driver_car_type: "",
        driver_name: "",
        driver_phone: "",
        bill: "",
        isexpired: "",
        client_name: "",
        creator_name: "",
        inspecter_result: "",
        remark: ""
      },
      columns: [],
      filterColumns: [],
      pageRequest: { pageNum: 1, pageSize: 10 },
      pageResult: {},

      operation: false, // true:新增, false:编辑
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      printPage: false,
      dataFormRules: {
        arrival_num: [{ required: true, message: "请输入到货数量" }],
        qualified_num: [{ required: true, message: "请输入合格数量" }],
        unqualified_num: [{ required: true, message: "请输入不合格数量" }],
        inspecter_result: [{ required: true, message: "请输入校验结论" }],
        isexpired: [{ required: true, message: "请输入是否过期" }]
      },

      // 新增编辑界面数据
      dataForm: {
        bill_photo: "",
        allocated_num: 0
      },
      deptData: [],
      selections: [],

      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      src:
        "https://ss1.bdstatic.com/6OF1bjeh1BF3odCf/it/u=829888290,2650878176&fm=74&app=80&f=JPG&size=f121,121?sec=1880279984&t=274501980523d63a7d93c94f85aabbab",
      options: [],
      warehouseoptions: [],
      warehouseareaoptions: [],
      warehoussettingoptions: []
    };
  },
  methods: {
    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            "库存分配"
          );
        })
        .catch(() => {});
    },

    remoteMethod: function(query) {
      if (query !== "") {
        //查询后台客户信息
        var search = {};
        search.t = "wtray";
        search.code = query;
        var this_ = this;
        this.utils.request.queryUserList(search, function(res) {
          this_.options = res.data;
        });
      } else {
        this.options = [];
      }
    },

    initWarehouseoptions() {
      var search = {};
      search.t = "warehouseSiteSetting";
      search.sql = "selectWarehouseList";
      var this_ = this;
      this.utils.request.queryUserList(search, function(res) {
        this_.warehouseoptions = res.data;
      });
    },
    warehouseMethod: function(query) {
      //查询后台客户信息
      var search = {};
      search.t = "warehouseSiteSetting";
      search.sql = "selectWarehouseList";
      search.house_name = query;
      var this_ = this;
      this.utils.request.queryUserList(search, function(res) {
        this_.warehouseoptions = res.data;
      });
    },

    initWarehouseareaoptions(filter, index, row) {
      //查询后台客户信息
      var search = Object.assign({}, filter); 
      search.t = "warehouseSiteSetting";
      search.sql = "selectAreaList"; 
      var this_ = this;
      this.utils.request.queryUserList(search, function(res) {
        this_.warehouseareaoptions = res.data;
        if (res.data == null && !this_.utils.isNull(row)) {
          this_.$message({ message: "该仓库无可用货位", type: "error" });

          //库区,货位清空
          row.warehouse_area_id = "";
          row.set_number = "";
          row.setting_id = "";
        }
      });
    },

    warehouseAreaMethod: function(query) {},

    //初始化货位信息
    initWarehousesettingoptions(filter, index, row) {
      //查询后台客户信息
      var search = Object.assign({}, filter);
      search.t = "warehouseSiteSetting";
      search.sql = "selectSiteSettingList"; 
      var this_ = this;
      this.utils.request.queryUserList(search, function(res) {
        this_.warehoussettingoptions = res.data;
        if (res.data == null) {
          this_.$message({ message: "该库区无可用货位", type: "error" });
        }
        row.set_number = "";
        row.setting_id = "";
      });
    },

    warehousesettingMethod: function(query, index, row) {
      let filter = {};
      filter.number = query;
      filter.warehouse_id = row.warehouse_id;
      filter.warehouse_area_id = row.warehouse_area_id;
      this.initWarehousesettingoptions(filter, index, row);
    },

    dealWithStock: function(value, index, row) {
      let total = this.countAllocatedNum();

      if (Number(this.dataForm.qualified_num) - total < 0) {
        row.stock = 0;
        this.$set(this.siteSettingData, index, row);

        total = this.countAllocatedNum();

        this.dataForm.allocated_num =
          Number(this.dataForm.qualified_num) - total;
        this.dataForm = Object.assign({}, this.dataForm);

        this.$message({ message: "库存分配数量错误", type: "error" });
      } else {
        this.dataForm.allocated_num =
          Number(this.dataForm.qualified_num) - total;
        this.dataForm = Object.assign({}, this.dataForm);
      }
    },

    dealWithqualifiedNum: function(value) {
      if (
        Number(this.dataForm.qualified_num) > Number(this.dataForm.arrival_num)
      ) {
        this.$message({ message: "合格数量配置错误", type: "error" });
        this.dataForm.qualified_num = 0;
      } else {
        this.dataForm.allocated_num = this.dataForm.qualified_num;
      }
    },

    //计算待分配库存
    countAllocatedNum() {
      //获取所有分配库存
      const values = this.siteSettingData.map(item => {
        return Number(item.stock);
      });
      const total = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        }
      }, 0);

      return total;
    },

    choseTray: function(selVal, row) {
      row.tray_name = selVal.name;
      row.tray_number = selVal.number;
      row.tray_id = selVal.id;
    },
    choseHouse: function(selVal, index, row) {
      if (this.utils.isNull(selVal)) {
        //库区,货位清空
        row.warehouse_area_id = "";
        row.set_number = "";
        row.setting_id = "";

        return;
      } 
      let filter = {};
      filter.warehouse_id = selVal;
      this.initWarehouseareaoptions(filter, index, row);
    },
    choseArea: function(selVal, index, row) {
      let filter = {};

      filter.warehouse_id = row.warehouse_id;
      filter.warehouse_area_id = selVal;

      if (this.utils.isNull(selVal)) {
        //货位清空
        row.warehouse_area_id = "";
        row.set_number = "";
        row.setting_id = "";

        return;
      }

      this.initWarehousesettingoptions(filter, index, row);
    },
    chosesetting: function(selVal, index, row) {
      //选择货位
      this.$set(this.siteSettingData, index, row);
    },
    // 获取分页数据
    findPage: function(data) {
      this.$refs.CyTable.findPage(this.filters);
    },
    // 显示新增界面
    handleAdd: function() {
      this.dialogVisible = true;
      this.operation = true;
    },
    // 打印
    print: function() {
      this.printPage = true;
      this.operation = true;
    },

    // 显示编辑界面
    handleEdit: function(params) {
      if (this.selections.length != 1) {
        this.$message({ message: "请选择一条记录", type: "error" });
        return;
      }

      var this_ = this;

      this.siteSettingData = [];

      this_.dataForm = Object.assign({}, this_.selections[0]);

      //根据id查询入库单信息
      var search = {};
      search.t = "worderinstore";

      search.buy_checked_id = this_.dataForm.id;
      this.utils.request.queryUserList(search, res => {
        if (this.utils.isNull(this_.dataForm.bill_photo)) {
          this_.bill_photo_list = [];
        } else {
          this_.bill_photo_list = this_.dataForm.bill_photo
            .split(",")
            .filter(function(e) {
              if (this_.utils.isNull(e)) {
              } else {
                return e;
              }
            });
        }

        if (this_.utils.isNull(this_.dataForm.arrival_num)) {
          this_.dataForm.arrival_num = this_.dataForm.buy_sku_num;
        }

        this_.dataForm.bill_photo = "";

        if (this_.utils.isNull(this_.dataForm.qualified_num)) {
          this_.dataForm.allocated_num = 0;
        } else {
          this_.dataForm.allocated_num = this_.dataForm.qualified_num;
        }

        if (res.data != null) {
          this_.siteSettingData = res.data;
        }

        let total = this_.countAllocatedNum();

        this_.dataForm.allocated_num =
          Number(this_.dataForm.qualified_num) - total;
        this_.dataForm = Object.assign({}, this_.dataForm);

        this_.warehoussettingoptions = [];

        $.each(this_.siteSettingData, (key, value) => {
          var set = {};
          set.id = value.setting_id;
          set.number = value.set_number;
          this_.warehoussettingoptions.push(set);
        });

        this_.dialogVisible = true;
        this_.operation = false;
      });
    },
    // 编辑
    submitForm: function() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          //到货
          let arrival_num = Number(this.dataForm.arrival_num);

          //合格数量
          let qualified_num = Number(this.dataForm.qualified_num);

          //不合格数量
          let unqualified_num = Number(this.dataForm.unqualified_num);
          if (!(arrival_num == qualified_num + unqualified_num)) {
            this.$message({
              message: "到货数量，合格数量，不合格数量设置错误",
              type: "error"
            });
            return;
          }

          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            var this_ = this;
            let query = {};
            query = Object.assign({}, this.dataForm);
            query.siteSettingData = JSON.stringify(this.siteSettingData);

            var billphoto = query.bill_photo.split(",");

            billphoto = billphoto.concat(this.bill_photo_list);

            query.bill_photo = billphoto
              .filter(function(e) {
                if (this_.utils.isNull(e)) {
                } else {
                  return e;
                }
              })
              .join(",");

            this.utils.request.saveStoreSku(query, function(res) {
              if (res.code == "0000") {
                this_.dialogVisible = false;
                this_.findPage();
              } else {
                this_.$message({
                  message: res.msg,
                  type: "error"
                });
              }
            });
          });
        }
      });
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
        { prop: "order_no", label: "入库订单号", minWidth: 100 },
        { prop: "bill", label: "单据号", minWidth: 120 },
        { prop: "sku_number", label: "产品代码", minWidth: 100 },
        { prop: "sku_name", label: "产品名称", minWidth: 120 },
        { prop: "sku_level", label: "产品规格", minWidth: 120 },
        {
          prop: "status",
          label: "状态",
          minWidth: 120,
          formatter: this.formateStatus
        },
        { prop: "roduction_date", label: "生产日期", minWidth: 120 },
        { prop: "expiration_date", label: "过期日期", minWidth: 120 },
        { prop: "checked_time", label: "校验时间", minWidth: 120 },
        { prop: "sku_type_number", label: "类别编号", minWidth: 120 },
        { prop: "sku_type_text", label: "类别名称", minWidth: 120 },
        // {prop:"unit_volume", label:"单件产品体积(m3)", minWidth:120},
        // {prop:"unit_weight", label:"单件产品重量(kg)", minWidth:120},
        { prop: "buy_sku_num", label: "订货数量", minWidth: 120 },
        { prop: "arrival_num", label: "到货数量", minWidth: 120 },
        { prop: "qualified_num", label: "合格数量", minWidth: 120 },
        { prop: "unqualified_num", label: "不合格数量", minWidth: 120 },
        {
          prop: "isexpired",
          label: "是否过期",
          minWidth: 120,
          formatter: this.formateIsexpired
        },
        { prop: "driver_number", label: "到货车辆车牌号", minWidth: 120 },
        { prop: "drivername", label: "到货承运司机姓名", minWidth: 120 },

        { prop: "arrival_date", label: "到货日期", minWidth: 120 },
        { prop: "creator_name", label: "检验员", minWidth: 120 },
        {
          prop: "inspecter_result",
          label: "检验结论",
          minWidth: 120,
          formatter: this.formateInspecterResult
        },
        { prop: "remark", label: "备注", minWidth: 120 }
      ];

      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    // 选择切换
    selectionChange: function(params) {
      this.selections = params.selections;
    },

    resetSelection() {
      if (this.$refs["filters"] != undefined) {
        this.$refs["filters"].resetFields();
      }
      this.$refs.CyTable.resetForm();
      this.findPage();
    },
    handleIntoStoreBuySku: function(index, row) {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          var this_ = this;

          var params = Object.assign({}, row);

          if (this.utils.isNull(params.tray_id)) {
            this.$message.error("托盘信息不能为空");
            return;
          }
          if (this.utils.isNull(params.setting_id)) {
            this.$message.error("库位信息不能为空");
            return;
          }

          if (this.utils.isNull(params.stock) || Number(params.stock) == 0) {
            this.$message.error("分配数量不能为空");
            return;
          }

          this.utils.request.intoStoreBuySku(params, function(res) {
            if (res.code == "0000") {
              this_.$message.success("上架成功");

              let house_name = this_.warehouseoptions.find(
                element => element.id == row.warehouse_id
              ).name;
              let area_name = this_.warehouseareaoptions.find(
                element => element.id == row.warehouse_area_id
              ).name;
              let set_number = this_.warehoussettingoptions.find(
                element => element.id == row.setting_id
              ).number;

              row.status = 2;
              row.house_name = house_name;
              row.area_name = area_name;
              row.set_number = set_number;

              this_.$set(this_.siteSettingData, index, row);
            } else {
              this_.$message.error(res.msg);
            }
          });
        }
      });
    },
    // // 批量删除订单产品和司机的关联关系
    handleDeleteOrderBuySku: function(index, row) {
      if (this.utils.isNull(row.id)) {
        var temp = [];
        $.each(this.siteSettingData, function(key, val) {
          if (key == index) {
          } else {
            temp.push(val);
          }
        });
        this.siteSettingData = temp;
      } else {
        var this_ = this;
        var deleteParam = {};
        deleteParam.t = "worderinstore";
        deleteParam.ids = row.id;

        this.utils.request.deleteUserInfo(deleteParam, function(res) {
          if (res.code == "0000") {
            var temp = [];
            $.each(this_.siteSettingData, function(key, val) {
              if (key == index) {
              } else {
                temp.push(val);
              }
            });
            this_.siteSettingData = temp;
          } else {
            this_.$message.error("请重新删除");
          }
        });
      }
    },

    trayAdd() {
      var data = {};

      data.buy_sku_id = this.dataForm.buy_sku_id;
      data.buy_checked_id = this.dataForm.id;
      data.sku_id = this.dataForm.sku_id;
      data.provider_id = this.dataForm.customer_id;
      data.order_buy_sku_number = this.dataForm.order_buy_sku_number;
      data.status = 0;
      data.stock = 0;

      this.siteSettingData.push(data);
    },

    //图片相关
    //图片上传时回调
    handleAvatarSuccess(res, file) {
      if (res.data.imgUrl == "") {
      } else {
        this.dataForm.bill_photo += res.data.imgUrl + ",";
        this.dialogImageUrl = URL.createObjectURL(file.raw);
      }
    },
    //图片移除
    handleRemove(file, fileList, index) {
      if (this.utils.isNull(index)) {
        //默认图片移除
        this.fileList = fileList;
        if (fileList.length == 0) {
          this.dataForm.bill_photo = "";
        } else {
          let imgs = fileList.map(item => item.response.data.imgUrl).toString();
          this.dataForm.bill_photo = this.imgs;
        }
      } else {
        this.bill_photo_list.splice(index, 1);
      }
    },
    //图片预览
    handlePictureCardPreview(file, bill_photo) {
      if (this.utils.isNull(bill_photo)) {
        this.dialogImageUrl = file.url;
      } else {
        this.dialogImageUrl = bill_photo;
      }
      this.showPictureDialogVisible = true;
    },
    //图片上传判断
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 20MB!");
      }
      return isLt2M;
    },

    clearFiles() {
      this.$refs["upload"].clearFiles();
    },

    closeDialog() {
      this.clearFiles();
      this.$refs["dataForm"].resetFields();
    },

    formateStatus(row, column, cellValue, index) {
      //状态  0 待分配 1 已分配
      if (cellValue == 0) {
        return "待分配";
      } else if (cellValue == 1) {
        return "已分配";
      }
      return "";
    },

    formateIsexpired(row, column, cellValue, index) {
      //是否过期 0 未过期 1 已过期
      if (cellValue == 0) {
        return "未过期";
      } else if (cellValue == 1) {
        return "已过期";
      }
      return "";
    },

    //状态查询
    qualityStatus(val) {
      this.filters.status = val;
      this.findPage();
    },

    formateInspecterResult(row, column, cellValue, index) {
      //检验结论 0 全部合格、1 部分合格  、2 部分不合格
      if (cellValue == 0) {
        return "全部合格";
      } else if (cellValue == 1) {
        return "部分合格";
      } else if (cellValue == 2) {
        return "部分不合格";
      }
      return "";
    },

    //批量入库
    batchIntoStoreBuySku() {
      if (this.selections.length == 0) {
        this.$message.error("请勾选需要入库的数据");
        return;
      }
      let ids = this.selections.map(item => item.id).toString();

      this.utils.request.batchIntoStoreBuySku(
        { buy_checked_ids: ids },
        item => {
          if (item.code == "0000") {
            this.$message.success("批量入库成功");
          } else {
            this.$message.error(item.msg);
          }
        }
      );
    }
  },
  mounted() {
    this.initColumns();
    this.initWarehouseoptions();
    this.initWarehouseareaoptions({});
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px !important;
}

/deep/ .table .el-input__inner {
  width: 100% !important;
}
</style>