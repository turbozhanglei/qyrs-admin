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
				<el-input v-model="filters.driver_name" placeholder="司机姓名"></el-input>
				</el-form-item>
				<el-form-item>
				<el-input v-model="filters.phone" placeholder="联系方式"></el-input>
				</el-form-item>
				<el-form-item>
				<el-input v-model="filters.car_type" placeholder="车辆类型（载货车）"></el-input>
				</el-form-item>
				<el-form-item>
				<el-input v-model="filters.car_num" placeholder="车辆车牌号"></el-input>
				</el-form-item>
				<el-form-item>
				<el-input v-model="filters.remark" placeholder="备注"></el-input>
				</el-form-item>
			</el-row>
			
			<el-row style="text-align: left;">
				<el-form-item>
					<kt-button icon="fa fa-search" :label="$t('action.search')"  type="primary" @click="$refs.CyTable.findPageBeforeRestPages(filters)"/>
				</el-form-item>
 	            <el-form-item>
					<kt-button icon="fa fa-plus" label="添加"   type="primary" @click="adddriverChid(null)"/>
				</el-form-item>
			</el-row>			
		</el-form>
	</div>
	 
	<!--表格内容栏-->
	<kt-table :height="350" permsEdit="sys:user:edit" permsDelete="sys:user:delete" :showOperation="false"
		:data="pageResult" :columns="filterColumns" 
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" @selectionChange="selectionChange">
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="45%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right" style="text-align:center" >
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-row :gutter="20">
				<el-col :span="24">
					<div class="grid-content bg-purple" style="margin-top: -70px;text-align:center" >WMS系统司机档案信息页面</div>
					</el-col>
			</el-row>
			<el-row>
				<el-form-item label="司机姓名" prop="code">
					<el-input v-model="dataForm.driver_name"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="phone">
					<el-input v-model="dataForm.phone"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="车辆类型（载货车）" prop="car_type">
					<el-input v-model="dataForm.car_type"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="车辆车牌号" prop="car_num">
					<el-input v-model="dataForm.car_num"  auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="dataForm.remark"  auto-complete="off"></el-input>
				</el-form-item>
			</el-row>
			
		</el-form>
		<div slot="footer" class="dialog-footer" style="text-align:center">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>

	<el-dialog title="审核页面" :visible.sync="checkpage"  width="30%"  >
		<el-form>
			<el-row>
				<el-form-item>
					<el-col span="8"><span>审核操作:</span></el-col>
					<el-col span="16">
						<el-select v-model="filters.customer_nature"  placeholder="请选择">  
							<el-option label="审核通过" value="审核通过"></el-option>
							<el-option label="审核驳回" value="审核驳回"></el-option>
						</el-select>
					</el-col>
				</el-form-item>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer" style="text-align:right">
			<el-button @click="checkpage = false">取 消</el-button>
		    <el-button type="primary" @click="checkpage = false">确 定</el-button>
		</div>
  </el-dialog>

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
	data() {
		return {
			size: 'small',
			filters: {
				name: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
            checked:[],
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			checkpage: false,
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

		
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				name: '',
				password: '123456',
				deptId: 1,
				deptName: '',
				email: 'test@qq.com',
				mobile: '13889700023',
				status: 1,
				userRoles: [],
				operator_num:"1/3",
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
		 
			this.$api.user.findPage(this.pageRequest).then((res) => {
				this.pageResult = {content:testdata.content,
                                   pageNum: 1,
                                   pageSize: 10,
								   totalPages: 1,
								   totalSize: 3
				}
				this.findUserRoles()
			}).then(data!=null?data.callback:'')
		},
		// 加载用户角色信息
		findUserRoles: function () {
			this.$api.role.findAll().then((res) => {
				// 加载角色集合
				this.roles = res.data	
			})
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		adddriverChid:function(){
			console.log(this.checked);
		    this.$emit('adddriverChid',{"selections":"selections"})
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			// this.dataForm = {
			// 	id: 0,
			// 	name: '',
			// 	password: '',
			// 	deptId: 1,
			// 	deptName: '',
			// 	email: 'test@qq.com',
			// 	mobile: '13889700023',
			// 	status: 1,
			// 	userRoles: []
			// }
		},
		check:function(){
			if(this.checked.length>0){
               this.checkpage=true
			} else{
				this.$message({ message: '审核时，最少选择一条数据', type: 'error' })
			}
		},
	
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
			let userRoles = []
			this.dataForm.userRoles = userRoles
			this.dataForm.operator_num="1/3";
			console.log(this.dataForm)
		},
		selectionChange: function (params) {
			this.checked=params.selections
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						let userRoles = []
						for(let i=0,len=params.userRoles.length; i<len; i++) {
							let userRole = {
								userId: params.id,
								roleId: params.userRoles[i]
							}
							userRoles.push(userRole)
						}
						params.userRoles = userRoles
						this.$api.user.save(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPage(null)
						})
					})
				}
			})
		},
		// 获取部门列表
		findDeptTree: function () {
			this.$api.dept.findDeptTree().then((res) => {
				this.deptData = res.data
				console.log(this.deptData )
			})
		},
		// 菜单树选中
      	deptTreeCurrentChangeHandle (data, node) {
        	this.dataForm.deptId = data.id
        	this.dataForm.deptName = data.name
		},
		// 时间格式化
      	dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		// 处理表格列过滤显示
      	displayFilterColumnsDialog: function () {
			this.$refs.tableColumnFilterDialog.setDialogVisible(true)
      	},
		// 处理表格列过滤显示
      	handleFilterColumns: function (data) {
			this.filterColumns = data.filterColumns
			this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      	},
		// 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:50},
				{prop:"driver_name", label:"司机姓名", minWidth:120},
				{prop:"phone", label:"联系方式", minWidth:120},
				{prop:"car_type", label:"车辆类型（载货车）", minWidth:120},
				{prop:"car_num", label:"车辆车牌号 ", minWidth:120},
				{prop:"remark", label:"备注", minWidth:120},

				// {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	}
	},
	mounted() {
		//this.findDeptTree()
		this.initColumns()
	}
}
	var testdata={
				content:[{id: "1",
						driver_name:"朱时茂",
						phone:"13013054567",
						car_type:"两厢车",
						car_num:"沪A88888",
						remark:"暂无",
						},
						{id: "2",
						driver_name:"朱时茂",
						phone:"13013054567",
						car_type:"两厢车",
						car_num:"沪A88888",
						remark:"暂无",
						},
						{id: "3",
						driver_name:"朱时茂",
						phone:"13013054567",
						car_type:"两厢车",
						car_num:"沪A88888",
						remark:"暂无",
						},]

			       }
</script>

<style scoped>
/deep/ .el-input__inner {
    width: 100%;
}
</style>