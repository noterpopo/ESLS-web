import { testRouter } from '@/api/route'
let isWork = false

this.onmessage = function (ev) {
  isWork = ev.data
}
// eslint-disable-next-line no-unmodified-loop-condition
while (isWork) {
  testRouter(null, '', '', '', 9).then(res => {
    this.postMessage(res.data.data)
  })
}
