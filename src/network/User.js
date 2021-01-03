import {request} from "network/request";
import {arrayEquals} from "element-ui/src/utils/util";
export function getUserList(queryInfo){
	return request({
		url:"/users",
		params:queryInfo,
		method:"get"
	})
}

export function ChangeUserState(userId,state){
	return request({
		url:"/users/"+userId+"/state/"+state,
		method:"put"
	})
}

export function addUser(userInfo){
	return request({
		url:"/users",
		data:userInfo,
		method:"post"
	})
}

export function getUserById(id){
	return request({
		url:"/users/"+id,
		method:"get"
	})
}

export function ChangeUserInfo(id,email,mobile){
	return request({
		url:"/users/"+id,
		data:{
			email:email,
			mobile:mobile
		},
		method:"put"
	})
}

export function DeleteUserById(id){
	return request({
		url:"/users/"+id,
		method:"delete"
	})
}
