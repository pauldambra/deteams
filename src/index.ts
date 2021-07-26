import { fromEvent } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import { link, listItem, span, text } from './html'
import { send } from './messages'
import {ChainResult, createChain} from "./chain-of-responsibility";

const onError = (e: Error) => {
  document.getElementsByClassName('message')[0].innerHTML = e.message
}

const onNext = (s: ChainResult) => {
  if (s.hiddenURL) {
    const ol = document.getElementsByClassName('links')[0].children[0]
    const li = listItem(link(s.hiddenURL))
    ol.prepend(li)
  } else if (s.downloadURL) {
    const ol = document.getElementsByClassName('links')[0].children[0]
    const li = listItem(
      span(
        [
          text('this is probably a download link for '),
          link(s.downloadURL)
        ]
      )
    )
    ol.prepend(li)
  } else if (s.error) {
    send(s.error)
  } else {
    send('unexpected error, please log a bug')
  }
}


const deteamsifyChain = createChain()

document.addEventListener('DOMContentLoaded', () => {
  fromEvent(document.getElementsByClassName('undeteamsified'), 'input')
      .pipe(
          debounceTime(200),
          map(x => (<HTMLInputElement>x.target).value),
          map(x => deteamsifyChain.handle(x))
      )
      .subscribe(onNext, onError)
})
