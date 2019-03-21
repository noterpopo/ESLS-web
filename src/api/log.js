import axios from '@/libs/api.request'

export const getAllLog = ({ page, count, queryId, queryString }) => {
  return axios.request({
    url: 'logs/',
    method: 'get',
    params: {
      query: queryId,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}
