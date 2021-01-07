import {request} from  "network/request"

//获得商品分类
export function getCategories(queryInfo){
	return request({
		url:"/categories",
		params:queryInfo,
		method:"get"
	})
}

export function getParenetCategories(){
	return request({
		url:"/categories",
		params:{
			type:2
		},
		method:"get"
	})
}

//添加分类
export function addCategory(addForm){
	return request({
		url:"/categories",
		data:addForm,
		method:"post"
	})
}