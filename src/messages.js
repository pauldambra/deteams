import { Subject } from 'rxjs'

const messages = new Subject()
messages.subscribe(
  s => document.getElementsByClassName('message')[0].textContent = s
)
export const send = s => {
  messages.next(s)
}
