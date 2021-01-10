<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCategoryDialog">添加分类</el-button>
        </el-col>
      </el-row>
<!--      表格区域-->
      <tree-table :data="cateList" :columns="columns" v-loading="loading"
                  :selection-type="false" :expand-type="false" show-index index-text="" border class="tree-table">
<!--        是否有效-->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
          <i class="el-icon-error" style="color:lightgreen;" v-else></i>
        </template>
<!--        排序-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else="scope.row.cat_level === 2">三级</el-tag>
        </template>
<!--        操作-->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
<!--      分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
<!--    添加分类对话框-->
    <el-dialog title="添加分类" :visible.sync="addCategorydialogVisible" width="50%" @close="addCateClosed">
<!--      添加分类的表单-->
      <el-form ref="addCategoryFormRef" :model="addCategoryForm" :rules="addCategoryRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
<!--          options:数据源-->
          <el-cascader
              expandTrigger='hover'
              v-model="selectedKeys"
              :options="parentCategories"
              :props="cascaderProps"
              @change="parentCategoryChanged" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCategorydialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {getCategories,getParenetCategories,addCategory} from "network/Categories"
export default {
  name: "Categories",
  created(){
    this.getCateList()
  },
  data(){
    return {
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      cateList:[],
      total:0,
      //tree-table指定列的定义
      columns:[
        {
          label:"分类名称",
          prop:'cat_name'
        },
        {
          label:"是否有效",
          type:"template",
          template:"isOk"
        },
        {
          label:"排序",
          type:"template",
          template: "order"
        },
        {
          label:"操作",
          type:"template",
          template:"opt"
        }
      ],
      addCategorydialogVisible:false,
      addCategoryForm:{
        cat_name:"",
        //父级分类ID
        cat_pid:0,
        //分类的等级，默认要添加的是一级分类
        cat_level:0
      },
      //校验规则
      addCategoryRules:{
        cat_name:[
          {required:true,message:"请输入分类名称",trigger:'blur'},
        ]
      },
      //父级分类(type=2)
      parentCategories:[],
      cascaderProps:{
        value:"cat_id",
        label:"cat_name",
        children:"children"
      },
      //选中的父级分类的id数组
      selectedKeys:[],
      loading:true
    }
  },
  methods:{
    async getCateList(){
      const res = await getCategories(this.queryInfo)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data.result
      this.total = res.data.total
      this.loading = false
    },
    handleSizeChange(newpagesize){
      this.queryInfo.pagesize = newpagesize
      this.getCateList()
    },
    handleCurrentChange(newpage){
      this.queryInfo.pagenum = newpage
      this.getCateList()
    },
    async showAddCategoryDialog(){
      const res = await getParenetCategories()
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.parentCategories = res.data

      this.addCategorydialogVisible = true
    },
    parentCategoryChanged(){
      if(this.selectedKeys.length > 0){
        //说明选择了分类，父节点id为数组最后一个值
        this.parentCategories.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]

        //为当前分类等赋值
        this.addCategoryForm.cat_level = this.selectedKeys.length
        return
      }{
        this.parentCategories.cat_pid = 0

        //为当前分类等赋值
        this.addCategoryForm.cat_level = 0
      }
    },
    addCate(){
      this.$refs.addCategoryFormRef.validate(async valid =>{
        if(!valid){
          return
        }
        const res = await addCategory(this.addCategoryForm)
        console.log(res);
        if(res.meta.status !== 201){
          return this.$message.error(res.meta.msg)
        }

        this.$message.success(res.meta.msg)
        this.getCateList()
        this.addCategorydialogVisible = false
      })
    },
    //监听对话框的关闭
    addCateClosed(){
      this.$refs.addCategoryFormRef.resetFields()
      //清空级联选择框
      this.selectedKeys = []
      this.addCategoryForm.cat_level = 0
      this.addCategoryForm.cat_pid = 0
    }

  }
}
</script>

<style scoped>
.tree-table{
  margin-top:15px;
}

.el-cascader{
  width:100%
}

</style>