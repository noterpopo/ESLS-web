import axios from '@/libs/api.request'
export const getRoleList = (id) => {
  return axios.request({
    url: '/role/' + id,
    method: 'get',
    params: {
      id: id
    }
  })
}

export const getAllRole = () => {
  return axios.request({
    url: 'roles',
    method: 'get'
  })
}
