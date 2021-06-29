import { Subject } from 'rxjs'

const messages = new Subject()
messages.subscribe(
  s => {
    if (typeof(document) !== 'undefined') {
      document.getElementsByClassName('message')[0].textContent = s;
    }
  }
)

export const send = s => messages.next(s)
