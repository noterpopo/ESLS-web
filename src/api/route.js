import axios from '@/libs/api.request'

export const getAllRoute = ({ page, count, queryId, queryString }) => {
  return axios.request({
    url: 'routers',
    method: 'get',
    params: {
      query: queryId,
      queryString: queryString,
      page: page,
      count: count
    }
  })
}
