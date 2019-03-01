import axios from '@/libs/api.request'

export const getAllTag = ({ page, count, queryId, queryString }) => {
  return axios.request({
    url: 'tags/',
    method: 'get',
    params: {
      query: queryId,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}

export const flushTag = (data, mode) => {
  return axios.request({
    url: 'tag/flush',
    method: 'put',
    params: {
      requestBean: data,
      mode: mode
    }
  })
}

export const deleteTag = (id) => {
  return axios.request({
    url: 'tag/' + id,
    method: 'delete'
  })
}
