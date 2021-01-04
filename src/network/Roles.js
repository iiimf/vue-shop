import {request} from "network/request";

export function getRolesList(){
	return request({
		url:"/roles",
		method:"get"
	})
}

export function deleteRolesRightsById(roleId,RightId){
	return request({
		url:"/roles/"+roleId+"/rights/"+RightId,
		method:"delete"
	})
}

//分配权限
export function DistributeRights(roleid,rightsId){
	return request({
		url:"/roles/"+roleid+"/rights",
		data:{
			rids:rightsId
		},
		method:"post"
	})
}