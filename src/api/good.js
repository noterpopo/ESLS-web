import axios from '@/libs/api.request'

export const getAllGood = ({ page, count, queryId, queryString }) => {
  return axios.request({
    url: 'goods/',
    method: 'get',
    params: {
      query: queryId,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}

export const getGood = (id) => {
  return axios.request({
    url: 'goods/' + id,
    method: 'get'
  })
}

export const updateGood = (data) => {
  return axios.request({
    url: 'good/',
    method: 'post',
    data: data
  })
}

export const submitUpdate = () => {
  return axios.request({
    url: '/good/update',
    method: 'put'
  })
}
export const deleteGood = (id) => {
  return axios.request({
    url: '/good/' + id,
    method: 'delete'
  })
}
