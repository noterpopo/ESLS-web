import axios from '@/libs/api.request'

export const getAllCycleJob = ({ page, count, query, queryString }) => {
  return axios.request({
    url: '/cyclejobs',
    method: 'get',
    params: {
      query: query,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}

export const updateCycleJob = (data) => {
  return axios.request({
    url: '/cyclejob',
    method: 'post',
    data: data
  })
}

export const deleteCyclejobs = (id) => {
  return axios.request({
    url: 'cyclejob/' + id,
    method: 'delete'
  })
}

export const scanShoptag = (data) => {
  return axios.request({
    url: 'shop/cyclejob',
    method: 'put',
    data: data,
    params: {
      mode: 1
    }
  })
}

export const flushShoptag = (data) => {
  return axios.request({
    url: 'shop/cyclejob',
    method: 'put',
    data: data,
    params: {
      mode: 0
    }
  })
}
