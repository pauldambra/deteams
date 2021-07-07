import { Subject } from 'rxjs'

const messages = new Subject<string>()
messages.subscribe(
    (s: string) => {
    if (typeof (document) !== 'undefined') {
      document.getElementsByClassName('message')[0].textContent = s
    }
  }
)

export const send = (s: string) => messages.next(s)
