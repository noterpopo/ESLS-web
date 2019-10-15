import HttpRequest from '@/libs/axios'
import config from '@/config'

function getBaseUrl () {
  config.baseUrl.dev = window.location.host.split(':')[0] + ':8086'
  config.baseUrl.pro = window.location.host.split(':')[0] + ':8086'
}
getBaseUrl()
console.log(config.baseUrl.dev)

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const axios = new HttpRequest(baseUrl)
export default axios
