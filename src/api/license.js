import axios from '@/libs/api.request'

export const getLicense = () => {
  return axios.request({
    url: 'license/',
    method: 'get'
  })
}

export const getServerInfos = (osName) => {
  return axios.request({
    url: 'license/getServerInfos?osName=' + osName,
    method: 'get'
  })
}
