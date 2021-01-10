<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
<!--      警告区域-->
      <el-alert type="warning" title="注意!只允许为第三级分类设置相关参数" :closable="false" show-icon></el-alert>
<!--      选择商品分类区域-->
      <el-row class="goods_cat">
        <el-col>
          <span>选择商品分类: </span>
<!--          商品分类的级联选择框-->
          <el-cascader
              expandTrigger="hover"
              v-model="selectedKeys"
              :options="catelist"
              :props="cateProps"
              @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>
<!--      tab标签区域-->
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
<!--        动态参数面板-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnClicked" @click="showDialog">添加参数</el-button>
          <el-table :data="manyTableData" border stripe v-loading="loading">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>

<!--                输入文本框-->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
<!--                添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
<!--        静态属性面板-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnClicked" @click="showDialog">添加属性</el-button>
          <el-table :data="OnlyTableData" border stripe v-loading="loading">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="handleClose(index,scope.row)">{{item}}</el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

<!--    添加参数对话框-->
    <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addParamdialogVisible" width="50%" @close="addParamDialogClosed">
      <el-form ref="addParamFormRef" :model="addParamForm" :rules="addParamFormRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addParamdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParam">确 定</el-button>
  </span>
    </el-dialog>
<!--    修改对话框-->
    <el-dialog
        :title="'修改'+titleText" :visible.sync="EditdialogVisible" width="50%" @close="EditDialogClosed">
      <el-form ref="EditParamsFormRef" :model="EditParamsForm" :rules="EditParamsFormRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="EditParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="EditdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="EditParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {getCategories,getParenetCategories,addCategory} from "network/Categories"
import {getGoodsParam,addParam,queryIdParam,EditParam,DeleteParam,adddParamProp} from "network/goodsParam"
export default {
  name: "Params",
  created(){
    this.getGoodsCategories()
  },
  data(){
    return {
      //商品分类列表
      catelist:[],
      selectedKeys:[],
      cateProps:{
        value:"cat_id",
        label:"cat_name",
        children:"children"
      },
      //被激活的tab名称
      activeName:"many",
      manyTableData:[],
      OnlyTableData:[],
      addParamdialogVisible:false,
      //添加参数的表单
      addParamForm:{
        attr_name:""
      },
      //添加参数验证规则
      addParamFormRules:{
        attr_name:[
          {required:true,message:"请输入参数名称",trigger:"blur"}
        ]
      },
      EditdialogVisible:false,
      EditParamsForm:{
        attr_name:""
      },
      EditParamsFormRules:{
        attr_name:[
          {required:true,message:"请输入参数名称",trigger:"blur"}
        ]
      },
      loading:false
    }
  },
  computed:{
    //tab页签是否可点击
    isBtnClicked(){
      return this.selectedKeys.length === 0
    },
    //当前选中的三级分类的ID
    cateId(){
      if(this.selectedKeys.length === 3){
        return this.selectedKeys[2]
      }
      return null
    },
    titleText(){
      if(this.activeName === "many"){
        return "动态参数"
      }else{
        return "静态参数"
      }
    }
  },
  methods:{
    async getGoodsCategories(){
      const res = await getCategories()
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.catelist = res.data

    },
    async getParamData(){
      if(this.selectedKeys.length !== 3){
        this.selectedKeys = []
        this.manyTableData = []
        this.OnlyTableData = []
        return
      }
      this.loading = true
      const res = await getGoodsParam(this.cateId,this.activeName)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }

      res.data.forEach(item=>{
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : []
        //为每一行添加inputVisible和inputValue
        item.inputVisible = false
        item.inputValue = ""
      })

      if(this.activeName === "many"){
        this.manyTableData = res.data
      }else{
        this.OnlyTableData = res.data
      }
      this.loading = false
    },
    handleChange(){
      this.getParamData()
    },
    //tab页签点击事件的处理
    handleTabClick(){
      this.getParamData()
    },
    showDialog(){
      this.addParamdialogVisible = true
    },
    addParamDialogClosed(){
      this.$refs.addParamFormRef.resetFields()
    },
    addParam() {
      this.$refs.addParamFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const paramInfo = {
          attr_name: this.addParamForm.attr_name,
          attr_sel: this.activeName,
        }
        const res = await addParam(this.cateId, paramInfo)
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.addParamdialogVisible = false
        this.getParamData()
      })
    },
    async showEditDialog(attr_id){
      const res = await queryIdParam(this.cateId,attr_id,this.activeName)
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.EditParamsForm = res.data
      this.EditdialogVisible = true
    },
    EditDialogClosed(){
      this.$refs.EditParamsFormRef.resetFields()
    },
    EditParams(){
      this.$refs.EditParamsFormRef.validate(async valid=>{
        if(!valid){
          return
        }
        const res = await EditParam(this.cateId,this.EditParamsForm.attr_id,this.EditParamsForm.attr_name,this.activeName)
        if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getParamData()
        this.EditdialogVisible = false

      })
    },
    async removeParam(attrid){
      const res = await this.$confirm("此操作将永久删除该参数，是否继续？","提示",{
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).catch(err=>err)

      if(res !== "confirm"){
        return this.$message.error("取消删除")
      }
      const result =await DeleteParam(this.cateId,attrid)
      if(result.meta.status !== 200){
        return this.$message.error(result.meta.msg)
      }
      this.$message.success(result.meta.msg)
      this.getParamData()
    },
    //向后台发送参数变化的接口
    async handleParam(row){
      const res = await adddParamProp(this.cateId,row.attr_id,row.attr_name,this.activeName,row.attr_vals.join(","))
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.status)
      }
      this.$message.success(res.meta.msg)
    },
    //New tag标签变化
    async handleInputConfirm(row){
      //清空内容
      if(row.inputValue.trim().length === 0){
        row.inputValue = ""
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.handleParam(row)
      row.inputValue = ""
      row.inputVisible = false


    },
    showInput(row){
      row.inputVisible = true
      //让input输入框自动获取焦点
      //$netTick当页面中的元素重新渲染后，才会运行回调函数
      this.$nextTick(_=>{
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(index,row){
      console.log(index);
      row.attr_vals.splice(index,1)
      this.handleParam(row)

    }
  }
}
</script>

<style scoped>
.goods_cat{
  margin:15px 0;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width:120px;
}
</style>