import {get, post} from "@/utils/request"
import {getStorage, setStorage} from '@/utils/storage'

const userStoreKey = "user"

/**
 * 创建班级
 * @param data
 * @returns {*}
 */
export function createClass(data) {
    return post("class/createClass", data)
}

/**
 * 查看班级信息信息
 * @param classId
 * @returns {*}
 */
export function getClassById(classId) {
    return get("class/getClassById?id", classId)
}
export function getClassById2(classId) {
    return get("class/getClassById2", classId)
}

/**
 * 加入班级
 * @param classCode
 * @returns {*}
 */
export function joinClass(classCode) {
    return post("classUser/joinClass", classCode)

}

/**
 * 查看班级成员
 * @returns {*}
 */
export function showClassUsers(classId) {
    return get("classUser/showClassUsers?classId="+classId)
}

/**
 * 查看当前用户所在班级
 * @param userInfo
 * @returns {*}
 */
export function listClassByUserId(classId) {
    return get("classUser/listClassByUserId")
}

