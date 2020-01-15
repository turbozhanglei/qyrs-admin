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
								   totalSize: 3
			}
		 
			 
		},
 
	   
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
	 
		// 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [ 
                {prop:"order_number", label:"单号", minWidth:120},
                {prop:"customer_name", label:"客户名称", minWidth:120},
                {prop:"product_name", label:"产品名称", minWidth:120},
                {prop:"warehousing_date", label:"入库时间", minWidth:120},
				{prop:"aside_location", label:"存放货位", minWidth:120}, 
				{prop:"production_date", label:"生产日期（产品批次）", minWidth:200},
				{prop:"out_date", label:"过期日期", minWidth:120},
				{prop:"distance_day", label:"距保质期到期天数", minWidth:200}, 
                {prop:"stock_number", label:"到货数量（件数）", minWidth:100},
                {prop:"stock_number1", label:"合格数量（件数）", minWidth:100},
                {prop:"stock_number2", label:"不合格数量（件数）", minWidth:100}, 
                {prop:"customer_name1", label:"检验员", minWidth:60},
                {prop:"customer_name2", label:"检验结论", minWidth:60},
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
						product_name: "伊利咖啡之选纯牛奶",
						product_specs:"250g/袋",
						product_code:"01",
						production_date:"2019/10/03 16:18:51",
						out_date:"2020/08/03 16:18:51",
						distance_day:"180",
						type_number:"0501",
						type_name:"液体乳",
						warehousing_date:"2019/11/03 16:18:51",
						aside_location:"W1AA01L1S1",
						one_volume:"0.0025",
						one_quality:"0.25",
						stock_number:"9999",
						is_expired:"否",
						order_number:"20191013162148DXTF_YL",
						bill_photo:"照片",
						customer_name:"伊利食品有限公司",
						remark:"请轻拿轻放，货物易损",
						},
						{id: "2",
						product_name: "新康西红柿块",
						product_specs:"6罐/箱",
						product_code:"02",
						production_date:"2019/10/03 16:18:51",
						out_date:"2020/10/03 16:18:51",
						distance_day:"200",
						type_number:"0902",
						type_name:"果蔬罐头",
						warehousing_date:"2019/11/03 16:18:51",
						aside_location:"W1AA01L1S8",
						one_volume:"0.01",
						one_quality:"2",
						stock_number:"9999",
						is_expired:"否",
						order_number:"20191013162148DXTF_XK",
						bill_photo:"照片",
						customer_name:"新康食品有限公司",
						remark:"暂无",
						},
						{id: "3",
						product_name: "三只松鼠每日坚果",
						product_specs:"750g/30袋",
						product_code:"03",
						production_date:"2019/09/08 16:18:51",
						out_date:"2020/09/08 16:18:51",
						distance_day:"150",
						type_number:"0401",
						type_name:"膨化食品",
						warehousing_date:"2019/11/03 16:18:51",
						aside_location:"W1AA01L2S1",
						one_volume:"0.002",
						one_quality:"0.25",
						stock_number:"9999",
						is_expired:"否",
						order_number:"20191013162148DXTF_SZSH",
						bill_photo:"照片",
						customer_name:"三只松鼠食品有限公司",
						remark:"暂无",
						},
						]

			       }
</script>

<style scoped>

</style>