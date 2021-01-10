import {request} from "network/request";

export function getGoodsParam(id,sel){
	return request({
		url:"/categories/"+id+"/attributes",
		params:{
			sel:sel
		},
		method:"get"
	})
}

export function addParam(id,paramInfo){
	return request({
		url:"/categories/"+id+"/attributes",
		data:paramInfo,
		method:"post"
	})
}

export function queryIdParam(cate_id,attr_id,attr_sel){
	return request({
		url:"/categories/"+cate_id+"/attributes/"+attr_id,
		params:{
			attr_sel:attr_sel
		},
		method:"get"
	})
}

export function EditParam(cate_id,attr_id,attr_name,attr_sel){
	return request({
		url:"/categories/"+cate_id+"/attributes/"+attr_id,
		data:{
			attr_name:attr_name,
			attr_sel:attr_sel
		},
		method:"put"
	})
}

export function DeleteParam(cate_id,attr_id){
	console.log(cate_id);
	console.log(attr_id);
	return request({
		url:"/categories/"+cate_id+"/attributes/"+attr_id,
		method:"delete"
	})
}

export function adddParamProp(id,attr_id,attr_name,attr_sel,attr_vals){
	return request({
		url:"/categories/"+id+"/attributes/"+attr_id,
		data:{
			attr_name:attr_name,
			attr_sel:attr_sel,
			attr_vals:attr_vals
		},
		method:"put"
	})
}