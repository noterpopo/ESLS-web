import axios from '@/libs/api.request'

export const getLicense = () => {
  return axios.request({
    url: 'license/',
    method: 'get'
  })
}
