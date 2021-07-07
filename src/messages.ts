import { Subject } from 'rxjs'

const messages = new Subject<string>()
messages.subscribe(
    (s: string) => {
    if (typeof (document) !== 'undefined') {
      if (document.getElementsByClassName('message')[0]) {
          document.getElementsByClassName('message')[0].textContent = s
      }
    }
  }
)

export const send = (s: string) => messages.next(s)
