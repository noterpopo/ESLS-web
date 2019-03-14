import axios from '@/libs/api.request'

export const getAllPermissions = () => {
  return axios.request({
    url: '/permissions',
    method: 'get'
  })
}
