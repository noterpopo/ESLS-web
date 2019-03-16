/* eslint-disable no-unmodified-loop-condition */
import { testRouter } from '@/api/route'
var isWork = false

self.onmessage = function (ev) {
  isWork = ev.data
}
while (isWork) {
  testRouter(null, '', '', '', 9).then(res => {
    self.postMessage(res.data.data)
  })
}
