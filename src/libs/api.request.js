import HttpRequest from '@/libs/axios'
import config from '@/config'

console.log(window.location.host)
function getBaseUrl () {
  config.baseUrl.dev = 'http://' + window.location.host.split(':')[0] + ':8086'
  config.baseUrl.pro = 'http://' + window.location.host.split(':')[0] + ':8086'
}
getBaseUrl()

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
console.log(config.baseUrl.pro)
const axios = new HttpRequest(baseUrl)
export default axios
