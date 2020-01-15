<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="float:left;padding-top:10px;padding-right:15px;">
		<el-form :inline="true" :size="size">
			<el-form-item>
					<kt-button icon="fa fa-file-excel-o" :label="$t('action.excel')" perms="sys:user:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
 
	</div>

	<!--表格内容栏-->
	<kt-table :height="350" :showOperation="false"
		:data="pageResult" :columns="filterColumns"
		@findPage="findPage" >
	</kt-table>

    
	 
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
export default {
	components:{
		PopupTreeInput,
		KtTable,
		KtButton,
		TableColumnFilterDialog
    },
    props: {
        data: Object, // 表格分页数据
    },
	data() {
		return {
			size: 'small',
			filters: {
				name: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 1 },
			pageResult: {},

			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入货位名称', trigger: 'blur' }
				],
				number: [
					{ required: true, message: '请输入类别编号', trigger: 'blur' }
				],
				type: [
					{ required: true, message: '请输入食品、食品添加剂类别', trigger: 'blur' }
				]
				
				
			},
			deptData: [],
			deptTreeProps: {
				label: 'name',
				children: 'children'
			},
			roles: []
		}
	},
	methods: {
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {
				code: {code:'code', value:this.filters.code}
            }

             let temp = testdata.content;
             let customer_name =  this.data.customer_name;
             let product_name =  this.data.product_name;
            
			$.each(temp,function(key, val){
               val.customer_name = customer_name;
               val.product_name = product_name;
               val.stock_number1 = 122;
               val.stock_number2 = 222;
               val.customer_name1 = "张三";
               val.customer_name2 = "全部合格"
			}) 
            
            this.pageResult = {content:temp,
                                   pageNum: 1,
                                   pageSize: 10,
								   totalPages: 1,
								   totalSize: 4
			}
		 
			 
		},
 
	   
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
	 
		// 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [ 
				{prop:"out_order_client", label:"订单号", minWidth:120},
				{prop:"out_order_client1", label:"客户出库单号", minWidth:120},
				{prop:"client_name", label:"客户名称", minWidth:120},
				{prop:"product_name", label:"产品名称", minWidth:120}, 
				{prop:"production_Date", label:"生产日期(产品批次)", minWidth:120},
				{prop:"expiration_date", label:"过期日期", minWidth:120},
				{prop:"storage_time", label:"入库时间", minWidth:120},
				{prop:"storage_location", label:"存放货位", minWidth:120},
				{prop:"out_Date", label:"出库时间", minWidth:120},
				{prop:"out_weight", label:"出库产品总重量", minWidth:120},
				{prop:"out_num", label:"出库数量", minWidth:120},
				{prop:"single_license", label:"单据证照", minWidth:120},
				{prop:"receive_warehouse_name", label:"收货仓库名称", minWidth:120},
				{prop:"receive_receive_address", label:"收货仓库具体地址", minWidth:120},
				{prop:"receive_name", label:"收货方对接人", minWidth:120},
				{prop:"phone", label:"联系方式（手机）", minWidth:120},
				{prop:"client_maker", label:"客户方制单人", minWidth:120},
				{prop:"operator", label:"我司操作员", minWidth:120}, 
				{prop:"create_Date", label:"制单时间", minWidth:120},
				{prop:"remark", label:"备注", minWidth:120},
			]
            this.filterColumns = JSON.parse(JSON.stringify(this.columns)); 
      	}

	},
	mounted() { 
		this.initColumns()

	}
}
	var testdata={
				content:[{id: "1",
						product_name: "W123456",
						product_specifications:"件",
						production_Date:"2019-10-15",
						expiration_date: "2019-10-15",
						storage_time:"c123456",
						storage_location:"存放货位",
						out_Date:"2019-10-11",
						out_weight:"5000",
						out_num:"500",
						out_order_client:"02345652",
						single_license:"暂无",
						receive_warehouse_name:"收货仓库名称",
						receive_receive_address:"上海市宝山区**楼11#c3905",
						receive_name:"李四",
						phone:"13013068856",
						client_name:"王五",
						client_maker:"张三",
						operator:"刘飒",
						out_order_mycompany:"0123456",
						create_Date:"2019-10-10",
						remark:"暂无1",
						},
						{id: "2",
						product_name: "W123456",
						product_specifications:"件",
						production_Date:"2019-10-15",
						expiration_date: "2019-10-15",
						storage_time:"c123456",
						storage_location:"存放货位",
						out_Date:"2019-10-11",
						out_weight:"5000",
						out_num:"500",
						out_order_client:"02345652",
						single_license:"暂无",
						receive_warehouse_name:"收货仓库名称",
						receive_receive_address:"上海市宝山区**楼11#c3905",
						receive_name:"李四",
						phone:"13013068856",
						client_name:"王五",
						client_maker:"张三",
						operator:"刘飒",
						out_order_mycompany:"0123456",
						create_Date:"2019-10-10",
						remark:"暂无1",
						},
						{id: "3",
						product_name: "W123456",
						product_specifications:"件",
						production_Date:"2019-10-15",
						expiration_date: "2019-10-15",
						storage_time:"c123456",
						storage_location:"存放货位",
						out_Date:"2019-10-11",
						out_weight:"5000",
						out_num:"500",
						out_order_client:"02345652",
						single_license:"暂无",
						receive_warehouse_name:"收货仓库名称",
						receive_receive_address:"上海市宝山区**楼11#c3905",
						receive_name:"李四",
						phone:"13013068856",
						client_name:"王五",
						client_maker:"张三",
						operator:"刘飒",
						out_order_mycompany:"0123456",
						create_Date:"2019-10-10",
						remark:"暂无1",
						},
						{id: "4",
						product_name: "W123456",
						product_specifications:"件",
						production_Date:"2019-10-15",
						expiration_date: "2019-10-15",
						storage_time:"c123456",
						storage_location:"存放货位",
						out_Date:"2019-10-11",
						out_weight:"5000",
						out_num:"500",
						out_order_client:"02345652",
						single_license:"暂无",
						receive_warehouse_name:"收货仓库名称",
						receive_receive_address:"上海市宝山区**楼11#c3905",
						receive_name:"李四",
						phone:"13013068856",
						client_name:"王五",
						client_maker:"张三",
						operator:"刘飒",
						out_order_mycompany:"0123456",
						create_Date:"2019-10-10",
						remark:"暂无1",
						}]

			       }
</script>

<style scoped>

</style>