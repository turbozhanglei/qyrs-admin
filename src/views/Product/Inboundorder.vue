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
      <el-form :inline="true" :model="filters" :size="size" class="form" ref="filters">
        <el-form-item>
          <el-input v-model="filters.order_no" placeholder="入库订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.client_name" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.manager_name" placeholder="对接联系人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.manager_mobile" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.bill" placeholder="单据号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.product_name" placeholder="产品名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.product_level" placeholder="产品规格"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_store" placeholder="最终收货仓库名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_store_address" placeholder="最终收货仓库具体地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_people" placeholder="最终收货方对接人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.recipient_people_mobile" placeholder="最终收货方联系方式（手机）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.supplier_company" placeholder="服务方名称"></el-input>
        </el-form-item>
        <!-- <el-form-item>
					<el-input v-model="filters.expiration_date" placeholder="过期日期"></el-input>
        </el-form-item>-->
        <!-- <el-form-item>
					<el-input v-model="filters.storage_num" placeholder="入库数量"></el-input>
        </el-form-item>-->

        <el-form-item>
          <el-input v-model="filters.supplier_people" placeholder="服务方联系人"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.supplier_people_mobile" placeholder="服务方联系方式（手机）"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.carrier_company" placeholder="送货物流公司"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.start_time_min"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="下单开始时间"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item style="text-align: left; ">
          <el-date-picker
            v-model="filters.start_time_max"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="下单结束时间"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="filters.demand_date_min"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="要求到货开始时间"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <!-- <el-form-item> -->
        <!-- <el-input v-model="filters.demand_date" placeholder="要求到货时间"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.arrival_date" placeholder="预计到货时间"></el-input>

        </el-form-item>-->

        <el-form-item>
          <el-date-picker
            v-model="filters.demand_date_max"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="要求到货结束时间"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.arrival_date_min"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="预计到货开始时间"
            style="width:86%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filters.arrival_date_max"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="预计到货结束时间 "
            style="width:86%"
          ></el-date-picker>
        </el-form-item>

        <el-row style="text-align: left;">
          <el-form-item>
            <el-select
              v-model="filters.status"
              style="width: 192px;"
              placeholder="审核状态"
              @change="qualityStatus"
            >
              <el-option label="待审核" value="0"></el-option>
              <el-option label="审核通过" value="1"></el-option>
              <el-option label="审核拒绝" value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <kt-button
              icon="fa fa-search"
              :label="$t('action.search')"
              type="primary"
              @click="$refs.CyTable.findPageBeforeRestPages(filters)"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="fa fa-plus"
              :label="$t('action.add')"
              type="primary"
              @click="handleAddOrder"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              icon="el-icon-refresh"
              :label="$t('action.reset')"
              type="primary"
              @click="resetForm('filters')"
            />
          </el-form-item>
          <el-form-item>
            <kt-button
              label="审核"
              type="primary"
              icon="el-icon-s-check"
              perms="product:orderin:checked"
              @click="examine"
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
              <el-button
                icon="fa fa-refresh"
                @click="$refs.CyTable.findPageBeforeRestPages(filters)"
              ></el-button>
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
      permsDelete="false"
      :height="500"
      :showBatchDelete="true"
      :columns="filterColumns"
      @findPage="findPage"
      @handleEdit="handleEdit"
      @selectionChange="selectionChange"
      ref="CyTable"
      v-loading="pageLoading"
      element-loading-text="审核中，请稍等"
    ></cy-table>
    <!--新增编辑界面-->
    <el-dialog
      :title="operation?'新增订单录入':'编辑订单录入'"
      width="92%"
      :visible.sync="dialogVisible"
      class="form"
      @close="closeDialog"
    >
      <el-form
        :model="dataForm"
        label-width="180px"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
        label-position="right"
        inline
      >
        <el-row>
          <el-form-item label="客户名称" prop="customer_id">
            <el-select
              v-model="dataForm.customer_id"
              clearable
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              @change="choseCustomer"
              :disabled="init_customer"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.client_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="对接联系人" prop="manager_name">
            <el-input v-model="dataForm.manager_name" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item label="联系电话" prop="manager_mobile">
            <el-input v-model="dataForm.manager_mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="要求到货时间" prop="end_time">
            <el-date-picker
              v-model="dataForm.end_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              style="width:86%"
              @change="changeEndTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="预计到货时间" prop="expect_time">
            <el-date-picker
              v-model="dataForm.expect_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              style="width:86%"
              @change="changeExpectTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="单据号" prop="bill">
            <el-input v-model="dataForm.bill" auto-complete="off"></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="最终收货仓库名称" prop="recipient_store">
          <!-- <el-input v-model="dataForm.recipient_store" auto-complete="off"></el-input> -->
          <template>
            <el-autocomplete
              :fetch-suggestions="queryRecipientInfo"
              placeholder="请输入内容"
              @select="handleSelectRecipientInfo"
              v-model="dataForm.recipient_store"
              style="width:200px"
            ></el-autocomplete>
          </template>
        </el-form-item>
        <el-form-item label="最终收货仓库具体地址" prop="recipient_store_address">
          <el-input v-model="dataForm.recipient_store_address" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="最终收货方对接人" prop="recipient_people">
          <el-input v-model="dataForm.recipient_people" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="最终收货方联系方式（手机）" prop="recipient_people_mobile">
          <el-input v-model="dataForm.recipient_people_mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务方名称">
          <!-- <el-input v-model="dataForm.supplier_company" auto-complete="off"></el-input> -->
          <template>
            <el-autocomplete
              :fetch-suggestions="querySupplierInfo"
              placeholder="请输入内容"
              @select="handleSelectSupplierInfo"
              v-model="dataForm.supplier_company"
              style="width:200px"
            ></el-autocomplete>
          </template>
        </el-form-item>
        <el-form-item label="服务方联系人" prop="supplier_people">
          <el-input v-model="dataForm.supplier_people" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="服务方联系方式（手机）" prop="supplier_people_mobile">
          <el-input v-model="dataForm.supplier_people_mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="送货物流公司" prop="carrier_company">
          <el-input v-model="dataForm.carrier_company" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="单据附件">
          <el-upload
            class="upload-demo"
            :action="zipUpload"
            :on-change="ziphandleImgUploadChange"
            :on-remove="ziphandleRemove"
            multiple
            :limit="1"
            accept="application/zip"
            :on-preview="ziphandleExceed"
            :file-list="zipfileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传zip文件,小于100M,且只能有一个</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="单据证照" prop="bill_photo">
          <img-upload
            :filelist="imgUploadList"
            @handleImgUploadRemove="handleImgUploadRemove"
            @handleImgUploadChange="handleImgUploadChange"
            @handlePictureCardPreview="handlePictureCardPreview"
            :showWarnInfo="true"
            uploadButton="bill_photo"
            ref="ImgUpload"
          ></img-upload>
        </el-form-item>
        <el-row>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="dataForm.remark"
              type="textarea"
              style="width:600px"
              :rows="5"
              auto-complete="off"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <div class="toolbar" style="float:right;padding-right:15px;">
        <div slot="footer" class="dialog-footer" style="text-align:center">
          <kt-button
            icon="fa fa-plus"
            :label="$t('action.add')"
            type="primary"
            @click="productAdd"
          />
        </div>
      </div>
      <div style="clear:both">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="产品编码" prop="sku_number"></el-table-column>
          <el-table-column label="产品名称" prop="name"></el-table-column>
          <el-table-column label="产品规格" prop="level"></el-table-column>
          <el-table-column label="生产日期" prop="roduction_date"></el-table-column>
          <el-table-column label="保质期" prop="shelflife"></el-table-column>
          <el-table-column label="存储温度" prop="storage_temp"></el-table-column>
          <el-table-column label="下单数量" prop="num"></el-table-column>
          <el-table-column label="中转仓库" prop="transfer_store"></el-table-column>
          <el-table-column label="司机">
            <template slot-scope="scope">
              <div v-for="item in scope.row.driverData" :key="item.driver_number">
                <el-popover trigger="hover" placement="top">
                  <p>联系方式: {{ item.mobile }}</p>
                  <p>车辆类型: {{ item.driver_type }}</p>
                  <p>车牌号: {{ item.driver_number }}</p>
                  <div slot="reference" class="name-wrapper" style="margin:10px;float:left">
                    <el-tag size="medium">{{ item.drivername }}</el-tag>
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEditProduct(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDeleteOrderBuySkuDriver(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          :loading="editLoading"
          @click.native="submitForm"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>

    <!--产品编辑界面-->
    <el-dialog
      :title="productoperation?'新增产品':'编辑产品'"
      width="80%"
      :visible.sync="productmodal"
      class="product"
      :close-on-click-modal="false"
      :before-close="handleproductClose"
    >
      <el-form
        :model="productForm"
        label-width="180px"
        :rules="productFormRules"
        ref="productForm"
        :size="size"
        label-position="right"
        class="product"
        inline
      >
        <el-form-item label="产品编码" width="220" prop="sku_id">
          <el-select
            v-model="productForm.sku_id"
            clearable
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="searchProductMethod"
            @change="choseProduct"
            required
          >
            <el-option
              v-for="item in productOptions"
              :key="item.id"
              :label="item.number"
              :value="item.id"
            >
              <span style="float: left">{{ item.number }}</span>
              <span
                style="float: right; color: #8492a6; font-size: 13px"
              >{{ item.name+':'+ item.level }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="productForm.name" auto-complete="off" required></el-input>
        </el-form-item>
        <el-form-item label="产品规格" prop="level">
          <el-input v-model="productForm.level" auto-complete="off" required></el-input>
        </el-form-item>
        <el-form-item label="存储温度" prop="storage_temp">
          <el-input
            v-model="productForm.storage_temp"
            auto-complete="off"
            required
            @change="changeStorageTemp"
          ></el-input>
        </el-form-item>
        <el-form-item label="入库数量" prop="num">
          <el-input v-model="productForm.num" type="number" auto-complete="off" required></el-input>
        </el-form-item>
        <el-form-item label="生产日期" prop="roduction_date">
          <el-date-picker
            v-model="productForm.roduction_date"
            type="datetime"
            required
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
            style="width:86%"
            @change="changeRoductionDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="保质期(天数)" prop="shelflife">
          <el-input
            v-model="productForm.shelflife"
            type="number"
            auto-complete="off"
            required
            placeholder="请输入天数"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否中转" prop="isTransfer">
          <el-switch
            v-model="productForm.isTransfer"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeTransfer"
          ></el-switch>
        </el-form-item>
        <el-row>
          <el-form-item label="中转仓库" prop="transfer_store" v-show="productForm.isTransfer">
            <el-select
              v-model="productForm.transfer_store"
              placeholder="请选择"
              @change="changeTransferStore"
              filterable
              clearable
            >
              <el-option
                v-for="item in wtransferInfo_options"
                :key="item.transfer_store"
                :label="item.transfer_store"
                :value="item.transfer_store"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="中转收货仓库具体地址"
            prop="transfer_store_address"
            v-show="productForm.isTransfer"
          >
            <el-input v-model="productForm.transfer_store_address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="中转收货方对接人" prop="transfer_people" v-show="productForm.isTransfer">
            <el-input v-model="productForm.transfer_people" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="中转收货方联系方式（手机）"
            prop="transfer_people_mobile"
            v-show="productForm.isTransfer"
          >
            <el-input v-model="productForm.transfer_people_mobile" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="预计送达中转仓时间"
            prop="transfer_expect_time"
            v-show="productForm.isTransfer"
          >
            <el-date-picker
              v-model="productForm.transfer_expect_time"
              type="datetime"
              required
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择时间"
              style="width:86%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="要求到达中转仓的时间" prop="transfer_end_time" v-show="productForm.isTransfer">
            <el-date-picker
              v-model="productForm.transfer_end_time"
              type="datetime"
              required
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择时间"
            ></el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>

      <div>
        <el-divider content-position="center">司机信息</el-divider>
        <div style="text-align:left">
          <el-button :size="size" type="success" @click="addDriver">新增</el-button>
        </div>
        <el-table :data="productForm.driverData" style="width: 100%" class="driver">
          <el-table-column prop="driver_number" label="车牌号">
            <template slot-scope="scope">
              <el-autocomplete
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入内容"
                @select="handleSelect"
                v-model="scope.row.driver_number"
                style="width:200px"
              ></el-autocomplete>
            </template>
          </el-table-column>
          <el-table-column prop="drivername" label="司机姓名">
            <template slot-scope="scope">
              <el-input v-model="scope.row.drivername"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="联系方式">
            <template slot-scope="scope">
              <el-input v-model="scope.row.mobile" auto-complete="off"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="driver_type" label="车辆类型">
            <template slot-scope="scope">
              <el-input v-model="scope.row.driver_type" auto-complete="off"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="removeDriver(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button :size="size" @click.native="handleproductClose">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitProdutForm"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
    <!-- 审核界面 -->
    <el-dialog title="订单审核" :visible.sync="checkpage" width="30%">
      <el-form :model="qualityForm" ref="qualityForm" label-width="80px">
        <el-form-item label="审核操作">
          <el-select v-model="qualityForm.status" placeholder="请选择">
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核拒绝" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="checkpage = false">取 消</el-button>
        <el-button type="primary" @click="doOrderCheck ">确 定</el-button>
      </div>
    </el-dialog>

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
import ImgUpload from "@/views/Core/ImgUpload";

export default {
  components: {
    PopupTreeInput,
    CyTable,
    KtButton,
    TableColumnFilterDialog,
    ImgUpload
  },
  data() {
    return {
      zipfileList: [],
      zipUpload: this.utils.getUpLoadHost(),
      showPictureDialogVisible: false,
      dialogImageUrl: "",
      imgUploadList: [],
      size: "small",
      filters: {
        name: "",
        t: "order_buy",
        sql: "queryOrderList",
        sqlCount: "queryOrderListCount",
        status: "0"
      },
      options: [],
      productOptions: [],
      columns: [],
      filterColumns: [],
      tableData: [],
      operation: false, // true:新增, false:编辑
      productoperation: false,
      dialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      pageLoading: false,
      productmodal: false,
      restaurants: [],
      checkpage: false, //审核页面
      selections: [],
      statusOptions: [],
      qualityForm: {
        status: ""
      },
      dataFormRules: {
        client_name: [
          { required: true, message: "请输入货位名称", trigger: "blur" }
        ],
        manager_name: [
          { required: true, message: "请输入对接联系人", trigger: "blur" }
        ],
        manager_mobile: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        end_time: [
          { required: true, message: "请输入到货时间", trigger: "blur" }
        ],
        expect_time: [
          { required: true, message: "请输入预计到货时间", trigger: "blur" }
        ],
        recipient_store: [
          { required: true, message: "请输入收货仓库名称", trigger: "blur" }
        ],
        recipient_store_address: [
          { required: true, message: "请输入收货仓库具体地址", trigger: "blur" }
        ],
        recipient_people: [
          { required: true, message: "请输入收货方对接人", trigger: "blur" }
        ],
        recipient_people_mobile: [
          { required: true, message: "请输入收货方联系方式", trigger: "blur" }
        ],

        bill: [{ required: true, message: "请输入单据号", trigger: "blur" }],

        supplier_company: [
          { required: true, message: "请输入供应商信息", trigger: "blur" }
        ]
      },

      productFormRules: {
        name: [{ required: true, message: "请输入产品", trigger: "blur" }],
        id: [{ required: true, message: "请输入产品编码", trigger: "blur" }],
        level: [{ required: true, message: "请输入产品规格", trigger: "blur" }],
        num: [{ required: true, message: "请输入入库数量", trigger: "blur" }],
        roduction_date: [
          { required: true, message: "请输入生产日期", trigger: "blur" }
        ],
        shelflife: [
          { required: true, message: "请输入保质期天数", trigger: "blur" }
        ],
        sku_id: [
          { required: true, message: "请输入产品编码", trigger: "blur" }
        ],
        expiration_date: [
          { required: true, message: "请输入过期日期", trigger: "blur" }
        ]
      },
      dataForm: {
        customer_id: "",
        manager_name: "",
        manager_mobile: "",
        end_time: "",
        expect_time: "",
        recipient_store: "",
        recipient_store_address: "",
        recipient_people: "",
        supplier_company: "",
        supplier_people: "",
        supplier_people_mobile: "",
        carrier_company: "",
        remark: "",
        id: "",
        recipient_people_mobile: "",
        bill: "",
        bill_photo: "",
        supplier_id: "",
        recipient_id: ""
      },
      productForm: {
        driverData: [],
        number: "",
        name: "",
        level: "",
        num: "",
        roduction_date: "",
        expiration_date: "",
        sku_id: "",
        id: "",
        shelflife: "",
        storage_temp: "",
        transfer_end_time: "",
        transfer_expect_time: "",
        transfer_people_mobile: "",
        transfer_people: "",
        transfer_store_address: "",
        transfer_store: "",
        isTransfer: false
      },
      driverForm: {},
      deptData: [],
      deptTreeProps: {
        label: "name",
        children: "children"
      },
      roles: [],
      editIndex: "",
      init_customer: false,
      wtransferInfo_options: []
    };
  },
  methods: {
    changeEndTime() {
      var end_time = this.dataForm.end_time;
      var expect_time = this.dataForm.expect_time;
      if (!this.utils.isNull(end_time) && !this.utils.isNull(expect_time)) {
        var time =
          new Date(end_time).getTime() - new Date(expect_time).getTime();
        time = Math.abs(time);
        if (time > 20 * 60 * 60 * 1000) {
          this.$message({
            message: "要求到货时间与预计到货时间不能超过20小时",
            type: "error"
          });
          this.dataForm.end_time = "";
          return;
        }
      }
    },
    changeExpectTime() {
      var end_time = this.dataForm.end_time;
      var expect_time = this.dataForm.expect_time;
      if (!this.utils.isNull(end_time) && !this.utils.isNull(expect_time)) {
        var time =
          new Date(end_time).getTime() - new Date(expect_time).getTime();
        time = Math.abs(time);
        if (time > 20 * 60 * 60 * 1000) {
          this.$message({
            message: "要求到货时间与预计到货时间不能超过20小时",
            type: "error"
          });
          this.dataForm.expect_time = "";
          return;
        }
      }
    },
    changeRoductionDate() {
      var end_time = this.dataForm.end_time;
      var expect_time = this.dataForm.expect_time;

      var roduction_date = this.productForm.roduction_date;
      if (!this.utils.isNull(roduction_date)) {
        var time =
          new Date(end_time).getTime() - new Date(roduction_date).getTime();
        if (time < 0) {
          this.$message({
            message: "要求到货时间不能小于生产日期",
            type: "error"
          });
          this.productForm.roduction_date = "";
          return;
        }

        time =
          new Date(expect_time).getTime() - new Date(roduction_date).getTime();
        if (time < 0) {
          this.$message({
            message: "预计到货时间不能小于生产日期",
            type: "error"
          });
          this.productForm.roduction_date = "";
          return;
        }
      }
    },
    changeTransferStore(value) {
      if (this.utils.isNull(value)) {
        this.productForm.transfer_store = "";
        this.productForm.transfer_store_address = "";
        this.productForm.transfer_people = "";
        this.productForm.transfer_people_mobile = "";
        this.productForm.transfer_end_time = "";
        this.productForm.transfer_expect_time = "";
      } else {
        $.each(this.wtransferInfo_options, (key, wtransferInfo) => {
          if (value === wtransferInfo.transfer_store) {
            this.productForm.transfer_store = wtransferInfo.transfer_store;
            this.productForm.transfer_store_address =
              wtransferInfo.transfer_store_address;
            this.productForm.transfer_people = wtransferInfo.transfer_people;
            this.productForm.transfer_people_mobile =
              wtransferInfo.transfer_people_mobile;
            this.productForm.transfer_end_time =
              wtransferInfo.transfer_end_time;
            this.productForm.transfer_expect_time =
              wtransferInfo.transfer_expect_time;
            return;
          }
        });
      }
    },
    changeTransfer() {
      if (this.productForm.isTransfer) {
        //查询中转仓库信息
        if (this.utils.isNull(this.productForm.sku_id)) {
          this.$message({ message: "产品信息不能为空", type: "error" });
          this.productForm.isTransfer = false;
          return;
        }

        this.utils.request.queryUserList(
          { t: "wtransferInfo", storage_temp: this.productForm.storage_temp },
          res => {
            if (res.data != null) {
              this.wtransferInfo_options = res.data;
            } else {
              this.wtransferInfo_options = [];
            }
          }
        );
      } else {
        this.productForm.transfer_store = "";
        this.productForm.transfer_store_address = "";
        this.productForm.transfer_people = "";
        this.productForm.transfer_people_mobile = "";
        this.productForm.transfer_end_time = "";
        this.productForm.transfer_expect_time = "";
      }

      this.productForm = Object.assign({}, this.productForm);
    },
    changeStorageTemp() {},
    ziphandleRemove(file, fileList) {
      this.zipfileList = [];
    },
    ziphandleImgUploadChange(file, fileList) {
      if (file.response != undefined && file.response != null) {
        let uid = file.uid;

        $.each(fileList, function(key, value) {
          if (uid == value.uid) {
            value.url = file.response.data.imgUrl;
          }
        });
        this.zipfileList = fileList;
      }
    },
    ziphandleExceed(files, fileList) {
      var a = document.createElement("a");

      a.href = files.url;
      a.download = "";
      a.target = "_blank";
      a.click();
    },
    handlePictureCardPreview(data) {
      var url = data.url;
      this.dialogImageUrl = url;
      this.showPictureDialogVisible = true;
    },

    handleImgUploadRemove(data) {
      var index = data.index;
      this.imgUploadList.splice(index, 1);
    },
    handleImgUploadChange(data) {
      this.imgUploadList = data.filelist;
    },
    // 获取分页数据
    findPage: function(data) {
      let customer_id = localStorage.getItem("customer_id");
      if (!this.utils.isNull(customer_id)) {
        this.filters.customer_id = customer_id;
        this.init_customer = true;
      }
      this.$refs.CyTable.findPage(this.filters);
    },
    remoteMethod: function(query) {
      if (query !== "") {
        //查询后台客户信息
        var search = {};
        search.t = "wcustomer";
        search.client_name = query;
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

        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        if (regPos.test(query)) {
          search.number = query;
        } else {
          search.name = query;
        }

        var this_ = this;
        this.utils.request.queryUserList(search, function(res) {
          this_.productOptions = res.data;
        });
      } else {
        this.options = [];
      }
    },

    choseCustomer: function(selVal) {
      var temp = this.options;
      var this_ = this;

      if (selVal == "" || selVal == null) {
        this_.dataForm.manager_name = "";
        this_.dataForm.manager_mobile = "";
      } else {
        $.each(temp, function(key, val) {
          if (val.id == selVal) {
            this_.dataForm.manager_name = val.manager_name;
            this_.dataForm.manager_mobile = val.manager_mobile;
            return;
          }
        });
      }
    },

    choseProduct: function(selVal) {
      var temp = this.productOptions;
      var this_ = this;

      this.productForm.isTransfer = false;
      this.productForm.transfer_store = "";
      this.productForm.transfer_store_address = "";
      this.productForm.transfer_people = "";
      this.productForm.transfer_people_mobile = "";
      this.productForm.transfer_end_time = "";
      this.productForm.transfer_expect_time = "";

      if (selVal == "" || selVal == null) {
        this_.productForm.name = "";
        this_.productForm.level = "";
        this_.productForm.sku_id = "";
        this_.productForm.sku_number = "";
        this_.productForm.storage_temp = "";
      } else {
        $.each(temp, function(key, val) {
          if (val.id == selVal) {
            this_.productForm.name = val.name;
            this_.productForm.level = val.level;
            this_.productForm.sku_id = val.id;
            this_.productForm.sku_number = val.number;
            this_.productForm.storage_temp = val.storage_temp;
            return;
          }
        });
      }
    },

    submitProdutForm: function() {
      this.$refs.productForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.productmodal = false;

            if (this.productoperation) {
              //新增
              this.tableData.push(JSON.parse(JSON.stringify(this.productForm)));
            } else {
              //修改
              this.tableData[this.editIndex] = JSON.parse(
                JSON.stringify(this.productForm)
              );
              this.tableData = JSON.parse(JSON.stringify(this.tableData));
            }

            this.resetProductForm();
          });
        }
      });
    },

    // 编辑
    submitForm: function() {
      if (this.tableData == null || this.tableData.length == 0) {
        this.$message({ message: "产品信息不能为空", type: "error" });
        return;
      }

      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            var this_ = this;

            var parma = Object.assign({}, this.dataForm);

            parma.tableData = JSON.stringify(this.tableData);
            parma.bill_photo = this.imgUploadList
              .map(item => item.url)
              .toString();
            parma.bill_zip = this.zipfileList.map(item => item.url).toString();

            this.utils.request.saveBuyOrder(parma, function(res) {
              this_.editLoading = false;
              if (res.code == "0000") {
                this_.$message({ message: "操作成功", type: "success" });

                this_.$refs["dataForm"].resetFields();
                this_.dialogVisible = false;
                this_.dataForm.t = "order_buy";
                this_.findPage();
              } else {
                this_.$message({
                  message: "操作失败, " + res.msg,
                  type: "error"
                });
              }
            });
          });
        }
      });
    },

    removeDriver(index, row) {
      var temp = [];
      $.each(this.productForm.driverData, function(key, val) {
        if (key == index) {
        } else {
          temp.push(val);
        }
      });

      this.productForm.driverData = temp;
    },

    addDriver() {
      this.productForm.driverData.push({});
    },

    qualityStatus(val) {
      this.filters.status = val;
      this.findPage();
    },
    querySearchAsync(queryString, cb) {
      if (queryString !== "" && queryString != undefined) {
        //查询后台客户信息
        var search = {};
        search.t = "order_buy";
        search.sql = "queryDriverList";
        search.driver_number = queryString;
        var this_ = this;

        var numList = [];
        $.each(this.productForm.driverData, function(key, val) {
          numList.push(val.driver_number);
        });

        this.utils.request.queryUserList(search, function(res) {
          var restaurants = [];

          if (res.data != null) {
            restaurants = res.data;
          }

          var result = [];
          $.each(restaurants, function(key, val) {
            var index = $.inArray(val.driver_number, numList);

            if (index >= 0) {
            } else {
              result.push(val);
            }
          });
          cb(result);
        });
      } else {
        cb([]);
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

    handleEditProduct: function(index, data) {
      this.resetProductForm();
      this.productmodal = true;
      this.productoperation = false;
      this.editIndex = index;
      data.isTransfer = data.is_transfer == 0 ? true : false;
      this.productForm = JSON.parse(JSON.stringify(data));
      this.productOptions = [{ id: data.sku_id, number: data.sku_number }];
    },
    handleproductClose: function(data) {
      this.resetProductForm();
      this.productmodal = false;
    },

    // // 批量删除订单产品和司机的关联关系
    handleDeleteOrderBuySkuDriver: function(index, row) {
      if (this.utils.isNull(row.id)) {
        var this_ = this;
        this.utils.request.deleteOrderBuySkuDriver({ id: row.id }, function(
          data
        ) {
          if (data.code == "0000") {
            var temp = [];
            $.each(this_.tableData, function(key, val) {
              if (key == index) {
              } else {
                temp.push(val);
              }
            });
            this_.tableData = temp;
            this_.$message({ message: "操作成功", type: "success" });
          } else {
            this_.$message({ message: "操作失败, " + data.msg, type: "error" });
          }
        });
      } else {
        $.each(this_.tableData, function(key, val) {
          if (key == index) {
          } else {
            temp.push(val);
          }
        });
        this_.tableData = temp;
      }
    },

    // 新增商品信息
    productAdd: function() {
      var end_time = this.dataForm.end_time;
      var expect_time = this.dataForm.expect_time;
      if (this.utils.isNull(end_time)) {
        //要求到货时间
        this.$message({ message: "请选择要求到货时间", type: "error" });
        return;
      }

      if (this.utils.isNull(expect_time)) {
        //要求到货时间
        this.$message({ message: "请选择预计到货时间", type: "error" });
        return;
      }

      this.resetProductForm();
      this.productmodal = true;
      this.productoperation = true;
    },
    // 显示新增界面
    handleAddOrder: function() {
      if (this.$refs["dataForm"] != undefined) {
        this.$refs["dataForm"].resetFields();
      }
      this.imgUploadList = [];
      this.zipfileList = [];
      this.tableData = [];
      this.dialogVisible = true;
      this.operation = true;

      var this_ = this;
      let customer_id = localStorage.getItem("customer_id");
      if (
        !this.utils.isNull(customer_id) &&
        this.utils.isNull(this.dataForm.id)
      ) {
        //查询客户信息
        //查询后台客户信息
        var search = {};
        search.t = "wcustomer";
        search.customer_id = customer_id;
        this_.dataForm.customer_id = Number(customer_id);
        this.utils.request.queryUserList(search, function(res) {
          this_.options = res.data;
          this_.dataForm.manager_name = res.data[0].manager_name;
          this_.dataForm.manager_mobile = res.data[0].manager_mobile;
        });
      }
    },

    // 显示编辑界面
    handleEdit: function(params) {
      this.dialogVisible = true;
      this.operation = false;
      var this_ = this;
      this.$nextTick(() => {
        this_.dataForm = Object.assign({}, params.row);
        this_.options = [
          { id: this_.dataForm.customer_id, client_name: params.row.customerno }
        ];

        if (this_.utils.isNull(this_.dataForm.bill_photo)) {
          this_.imgUploadList = [];
        } else {
          this_.imgUploadList = [];
          $.each(this.dataForm.bill_photo.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              this_.imgUploadList.push(param);
            }
          });
        }

        if (this_.utils.isNull(this_.dataForm.bill_zip)) {
          this_.zipfileList = [];
        } else {
          this_.zipfileList = [];
          $.each(this.dataForm.bill_zip.split(","), function(key, val) {
            let param = {};
            if (this_.utils.isNull(val)) {
            } else {
              param.url = val;
              var array = val.split("/");
              param.name = array[array.length - 1];
              this_.zipfileList.push(param);
            }
          });
        }

        var search = {};
        search.id = this.dataForm.id;
        //查询明细信息
        this.utils.request.queryOrderBuySku(search, function(res) {
          if (res.code == "0000") {
            this_.tableData = res.data;
          } else {
            this_.$message({ message: "获取产品信息异常", type: "error" });
          }
        });
      });
    },

    //重置按钮
    resetForm(formName) {
      this.filters = {
        t: "order_buy",
        sql: "queryOrderList",
        sqlCount: "queryOrderListCount"
      };
      this.$refs.CyTable.resetForm();
      this.findPage("filters");
    },

    //取消重置按钮
    resetForm1(formName) {
      this.dataForm = {
        customer_id: "",
        manager_name: "",
        manager_mobile: "",
        end_time: "",
        expect_time: "",
        recipient_store: "",
        recipient_store_address: "",
        recipient_people: "",
        supplier_company: "",
        supplier_people: "",
        supplier_people_mobile: "",
        carrier_company: "",
        remark: "",
        id: "",
        recipient_people_mobile: "",
        bill: "",
        bill_photo: ""
      };
    },

    closeDialog() {
      this.bill_photo_list = [];
      this.$refs["dataForm"].resetFields();
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
        // {prop:"id", label:"ID", minWidth:50},
        { prop: "order_no", label: "入库订单号", minWidth: 120 },
        { prop: "bill", label: "单据号", minWidth: 120 },
        { prop: "customerno", label: "客户名称", minWidth: 120 },
        { prop: "manager_name", label: "对接联系人", minWidth: 120 },
        {
          prop: "start_time",
          label: "下单时间",
          minWidth: 120,
          formatter: this.formatterOrderTime
        },
        { prop: "manager_mobile", label: "联系电话", minWidth: 120 },
        { prop: "product_name", label: "产品名称", minWidth: 120 },
        { prop: "product_level", label: "产品规格", minWidth: 120 },
        { prop: "remark", label: "备注", minWidth: 120 },
        { prop: "recipient_store", label: "最终收货仓库名称", minWidth: 120 },
        {
          prop: "recipient_store_address",
          label: "最终收货仓库具体地址",
          minWidth: 120
        },
        { prop: "recipient_people", label: "最终收货方对接人", minWidth: 120 },
        {
          prop: "recipient_people_mobile",
          label: "最终收货方联系方式",
          minWidth: 120
        },
        { prop: "end_time", label: "最终库要求到货时间", minWidth: 120 },
        { prop: "expect_time", label: "最终库预计到货时间", minWidth: 120 },

        {
          prop: "transfer_store",
          label: "中转收货仓库名称",
          minWidth: 120,
          showOverflowTooltip: true
        },
        {
          prop: "transfer_store_address",
          label: "中转收货仓库具体地址",
          minWidth: 120,
          showOverflowTooltip: true
        },
        { prop: "transfer_people", label: "中转收货方对接人", minWidth: 120 },
        {
          prop: "transfer_people_mobile",
          label: "中转收货方联系方式",
          minWidth: 120
        },
        {
          prop: "transfer_end_time",
          label: "中转库要求到货时间",
          minWidth: 120
        },
        {
          prop: "transfer_expect_time",
          label: "中转库预计到货时间",
          minWidth: 120
        },

        { prop: "supplier_company", label: "服务方名称", minWidth: 120 },
        { prop: "supplier_people", label: "服务方联系人", minWidth: 120 },
        {
          prop: "supplier_people_mobile",
          label: "供应商联系方式",
          minWidth: 120
        },
        { prop: "carrier_company", label: "送货物流公司", minWidth: 120 },
        {
          prop: "status",
          label: "状态",
          minWidth: 120,
          formatter: this.formatterOrderStatus
        }
      ];

      var temp = [];
      $.each(this.columns, function(key, val) {
        temp.push(val);
      });
      this.filterColumns = temp;
    },

    //列表下载
    downloadExcel() {
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let filename = "订单录入";
          this.$refs.CyTable.exportData(
            this.filters,
            this.filterColumns,
            filename
          );
        })
        .catch(() => {});
    },

    resetProductForm() {
      if (this.$refs["productForm"] != undefined) {
        this.$refs["productForm"].resetFields();
      }
      this.productForm = {
        driverData: [],
        number: "",
        name: "",
        level: "",
        num: "",
        roduction_date: "",
        expiration_date: "",
        transfer_store: "",
        transfer_store_address: "",
        transfer_people: "",
        transfer_people_mobile: "",
        transfer_end_time: "",
        transfer_expect_time: "",
        storage_temp: ""
      };
    },

    examine: function() {
      if (this.selections.length == 0) {
        this.$message({ message: "请至少选择一条", type: "error" });
        return;
      }
      this.checkpage = true;
    },
    formatterOrderStatus(cellValue) {
      if (cellValue.status == 0) {
        return "待审核";
      } else if (cellValue.status == 1) {
        return "审核通过";
      } else {
        return "审核拒绝";
      }
    },
    formatterOrderTime(row, column, cellValue, index) {
      if (this.utils.isNull(cellValue)) {
        return cellValue;
      }
      var date = new Date(cellValue);

      if (date.getTime() + 1800 * 1000 >= new Date().getTime()) {
        row.disabled = false;
      } else {
        row.disabled = true;
      }
      return cellValue;
    },
    selectionChange: function(data) {
      this.selections = data.selections;
    },
    doOrderCheck: function() {
      if (this.selections.length == 0) {
        this.$message({ message: "请至少选择一个订单", type: "error" });
        return;
      }

      var data = {};

      let ids = this.selections.map(item => item.id).toString();

      data.status = this.qualityForm.status;
      data.ids = ids;

      var this_ = this;

      this.pageLoading = true;

      this_.checkpage = false;
      this.utils.request.doOrderCheck(data, function(res) {
        if (res.code == "0000") {
          this_.$message({ message: "操作成功", type: "success" });
          this_.pageLoading = false;
          this_.findPage();
        } else {
          this_.pageLoading = false;
          this_.$message({ message: res.msg, type: "error" });
        }
      });
    },
    //收货方信息初始化
    queryRecipientInfo(queryString, cb) {
      if (queryString !== "" && queryString != undefined) {
        //查询后台客户信息
        var search = {};
        search.t = "recipient";
        search.recipient_store = queryString;
        var this_ = this;
        //  var numList = [];
        //   $.each(this_.dataForm.supplier_company, function(key, val) {
        //     numList.push(val.supplier_company);
        //   });

        this.utils.request.queryUserList(search, function(res) {
          var restaurants = [];

          if (res.data != null) {
            restaurants = res.data;
          }

          var result = [];
          $.each(restaurants, function(key, val) {
            result.push(val);
          });
          cb(result);
        });
      } else {
        cb([]);
      }
    },

    handleSelectRecipientInfo(item) {
      if (item != null && item != "") {
        var this_ = this;
        if (item != null && item != "") {
          this_.dataForm.recipient_store = item.recipient_store;
          this_.dataForm.recipient_store_address = item.recipient_store_address;
          this_.dataForm.recipient_people = item.recipient_people;
          this_.dataForm.recipient_people_mobile = item.recipient_people_mobile;
          this_.dataForm.recipient_id = item.id;
        } else {
        }
      }
    },

    //供应商信息初始化
    querySupplierInfo(queryString, cb) {
      if (queryString !== "" && queryString != undefined) {
        //查询后台客户信息

        var search = {};
        search.t = "supplier";
        search.supplier_company = queryString;
        var this_ = this;
        //  var numList = [];
        //   $.each(this_.dataForm.supplier_company, function(key, val) {
        //     numList.push(val.supplier_company);
        //   });

        this.utils.request.queryUserList(search, function(res) {
          var restaurants = [];

          if (res.data != null) {
            restaurants = res.data;
          }

          var result = [];
          $.each(restaurants, function(key, val) {
            result.push(val);
          });
          cb(result);
        });
      } else {
        cb([]);
      }
    },

    handleSelectSupplierInfo(item) {
      var this_ = this;
      if (item != null && item != "") {
        this_.dataForm.supplier_company = item.supplier_company;
        this_.dataForm.supplier_people = item.supplier_people;
        this_.dataForm.carrier_company = item.carrier_company;
        this_.dataForm.supplier_people_mobile = item.supplier_people_mobile;
        this_.dataForm.supplier_id = item.id;
      } else {
      }
    }
  },
  mounted() {
    this.statusOptions = [
      {
        key: 0,
        display_name: "待审核"
      },
      {
        key: 1,
        display_name: "审核通过"
      },
      {
        key: 2,
        display_name: "审核拒绝"
      }
    ];
    this.initColumns();
  }
};
</script>

<style scoped>
/deep/ .form .el-input__inner {
  width: 200px;
}

/deep/ .product .el-input__inner {
  width: 200px !important;
}

/deep/ .driver .el-input__inner {
  width: 180px !important;
}

/deep/ .el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 20px;
}
</style>