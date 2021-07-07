import { fromEvent } from 'rxjs'
import { debounceTime, filter, map } from 'rxjs/operators'
import { isTeamsLink, isValidHttpUrl, mightContainASecretHiddenLink } from './url'
import {deteamsify, DeteamsingResult} from './deteamsifier'
import { link, listItem, span, text } from './html'
import { send } from './messages'

const onError = (e: Error) => {
  document.getElementsByClassName('message')[0].innerHTML = e.message
}

const onNext = (s: DeteamsingResult | undefined) => {
  if (!s) {
    return
  }

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
  }
}

const hasContent = (s: string): boolean => {
  send('')
  return !!(s && s.length > 0)
}

document.addEventListener('DOMContentLoaded', () => {
  fromEvent(document.getElementsByClassName('undeteamsified'), 'input')
    .pipe(
      debounceTime(200),
      map(x => (<HTMLInputElement>x.target).value),
      filter(hasContent),
      filter(isValidHttpUrl),
      map(u => new URL(u)),
      filter(isTeamsLink),
      filter(mightContainASecretHiddenLink),
      map(deteamsify)
    )
    .subscribe(onNext, onError)
})
