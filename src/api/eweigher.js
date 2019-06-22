import axios from '@/libs/api.request'

export const balance = (mode, data) => {
  return axios.request({
    url: 'api/balance',
    method: 'post',
    data: data,
    params: {
      mode: mode
    }
  })
}
