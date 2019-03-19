import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  return axios.request({
    url: 'user/login',
    data: {
      username: userName,
      password: password
    },
    method: 'post'
  })
}

export const switchUserUsable = (id) => {
  return axios.request({
    url: '/user/status/' + id,
    method: 'put'
  })
}

export const getUserInfo = (id) => {
  return axios.request({
    url: '/users/' + id,
    method: 'get'
  })
}

export const deleteUser = (id) => {
  return axios.request({
    url: '/user/' + id,
    method: 'delete'
  })
}

export const getRoleInfo = (id) => {
  return axios.request({
    url: '/user/role/' + id,
    method: 'get'
  })
}

export const getAllUser = ({ page, count, query, queryString }) => {
  return axios.request({
    url: '/users',
    method: 'get',
    params: {
      query: query,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}

export const addUserRole = (uid, roleData) => {
  return axios.request({
    url: 'user/addRole',
    method: 'post',
    data: {
      collectionIds: [roleData],
      ids: [uid]
    }
  })
}
export const delUserRole = (uid, roleIds) => {
  return axios.request({
    url: 'user/delete/' + uid,
    method: 'post',
    data: roleIds
  })
}
