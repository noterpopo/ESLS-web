import axios from '@/libs/api.request'

export const getSystemArgs = () => {
  return axios.request({
    url: 'common/systemArgs',
    method: 'get'
  })
}

export const setSystemArgs = (mode, args) => {
  return axios.request({
    url: 'common/systemArgs',
    method: 'put',
    params: {
      mode: mode,
      args: args
    }
  })
}
