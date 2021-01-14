<template>
  <div>
    <!--    面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
<!--      进度条-->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
<!--      tab栏-->
      <el-form :model="addGoodForm" status-icon :rules="addGoodFormRules" ref="addGoodFormRef" label-width="100px" label-position="top">
      <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave="beforeLeaveTab" @tab-click="tabclicked">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addGoodForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addGoodForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addGoodForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
                expandTrigger="hover"
                v-model="addGoodForm.goods_cat"
                :options="cateList"
                :props="addGoodProp"
                @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item v-for="item in manyTable" :label="item.attr_name" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item v-for="item in onlyTable" :label="item.attr_name" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
<!--          action:图片上传的后台接口-->
          <el-upload
              action="http://150.158.154.50:8888/api/private/v1/upload/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handlepaymentSuccess"
              :headers="headerObj"
              list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addGoodForm.goods_introduce"></quill-editor>
          <el-button type="primary" class="addBtn" @click="addGood">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
<!--    图片预览-->
    <el-dialog title="图片预览" :visible.sync="PicPreviewdialogVisible" width="35%">
      <img :src="previewPath" alt="" class="PreviewImg">
    </el-dialog>
  </div>
</template>

<script>
import {getCategories} from "network/Categories"
import {getGoodsParam} from "network/goodsParam"
import {addGood} from "network/goodsList"
import _ from "lodash"
export default {
  name: "AddGoods",
  data(){
    return {
      activeIndex:"0",
      tabPosition:"left",
      addGoodForm:{
        goods_name:"",
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        goods_cat:[],
        pics:[],
        //商品详情
        goods_introduce:"",
        attrs:[]
      },
      addGoodFormRules:{
        goods_name:[
          {required:true,message:"请输入商品名称",trigger:"blur"}
        ],
        goods_price: [
          {required:true,message:"请输入商品价格",trigger:"blur"}
        ],
        goods_weight:[
          {required:true,message:"请输入商品重量",trigger:"blur"}
        ],
        goods_number:[
          {required:true,message:"请输入商品数量",trigger:"blur"}
        ],
        goods_cat:[
          {required:true,message:"请输入商品分类",trigger:"blur"}
        ]
      },
      cateList:[],
      addGoodProp:{
        label:"cat_name",
        value:"cat_id",
        children:"children"
      },
      manyTable:[],
      onlyTable:[],
      //图片上传组件的header的请求头对象
      headerObj:{
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath:"",
      PicPreviewdialogVisible:false
    }
  },
  computed:{
    cateId(){
      if(this.addGoodForm.goods_cat.length === 3){
        return this.addGoodForm.goods_cat[2]
      }
      return null
    }
  },
  created(){
    this.getCate()
  },
  methods:{
    async getCate(){
      const res = await getCategories()
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.cateList = res.data
    },
    handleChange(){
      if(this.addGoodForm.goods_cat.length !== 3){
        this.addGoodForm.goods_cat = []
      }
    },
    beforeLeaveTab(newTab,oldTab){
      if(oldTab === '0' && this.addGoodForm.goods_cat.length !== 3){
        this.$message.error("请选择商品分类")
        return false
      }
    },
    async tabclicked(){
      if(this.activeIndex === '1'){
        const res = await getGoodsParam(this.cateId,"many")
        if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
        }
      res.data.forEach(item=>{
        item.attr_vals = item.attr_vals.length ===0 ? [] : item.attr_vals.split(",")
      })
      this.manyTable = res.data
        console.log(this.manyTable);
      }else if(this.activeIndex === '2'){
        const res = await getGoodsParam(this.cateId,"only")
        if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
        }
        this.onlyTable = res.data
        console.log(this.onlyTable);
      }
    },
    //处理图片预览
    handlePreview(file){
      this.previewPath = "http://150.158.154.50:8888/tmp_uploads/"+file.response.data.url.split("/")[file.response.data.url.split("/").length - 1]
      this.PicPreviewdialogVisible = true
    },
    //处理移除图
    handleRemove(file){
      //获取要删除图片的的临时途径
      const filepath = file.response.data.tmp_path
      //从pics数组中找到这个相应的索引
      const i = this.addGoodForm.pics.findIndex(item=>{
        item.pic === filepath
      })

      this.addGoodForm.pics.splice(i,1)
    },
    handlepaymentSuccess(response){
      const picInfo = {
        pic:response.data.temp_path
      }
      //将图片信息添加到数组中
      this.addGoodForm.pics.push(picInfo)
    },
    addGood(){
      this.$refs.addGoodFormRef.validate(async valid =>{
        if(!valid){
          return this.$message.error("请填写必要的表单信息")
        }
        const form =  _.cloneDeep(this.addGoodForm)

        form.goods_cat = form.goods_cat.join(",")

        this.manyTable.forEach(item=>{
          const newInfo = {attr_id:item.attr_id, attr_value:item.attr_vals.join(",")}
          console.log("----");
          this.addGoodForm.attrs.push(newInfo)
        })
        console.log(this.onlyTable);
        this.onlyTable.forEach(item=>{
          const newInfo = {attr_id:item.attr_id, attr_value:item.attr_vals,}
          this.addGoodForm.attrs.push(newInfo)
        })

        form.attrs= this.addGoodForm.attrs

        //发起API请求

        const res = await addGood(form)
        console.log(res);
        if(res.meta.status !== 201){
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        //路由调整
        this.$router.push("/goods")
      })
    }

  }

}
</script>

<style scoped>
.el-cascader{
  width:100%
}
.el-checkbox{
  margin:0 5px 0 0 !important;
}
.PreviewImg{
  width:100%;
}
.addBtn{
  margin-top:15px;
}
</style>