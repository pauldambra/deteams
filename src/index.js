import { fromEvent } from 'rxjs'
import { debounceTime, filter, map } from 'rxjs/operators'
import { isTeamsLink, isValidHttpUrl, mightContainASecretHiddenLink } from './url'
import { deteamsify } from './deteamsifier'
import { link, listItem } from './html'
import { send } from './messages'

const onError = e => {
  document.getElementsByClassName('message')[0].innerHTML = e.message
}

const onNext = s => {
  const output = document.getElementsByClassName('output')[0]
  const ol = document.getElementsByClassName('links')[0].children[0]
  const li = listItem(link(s), output.width)
  ol.prepend(li)
}

const hasContent = s => {
  send('')
  return !!(s && s.length > 0);
}

document.addEventListener('DOMContentLoaded', () => {
  fromEvent(document.getElementsByClassName('undeteamsified'), 'input')
    .pipe(
      debounceTime(200),
      map(x => x.target.value),
      filter(hasContent),
      filter(isValidHttpUrl),
      map(u => new URL(u)),
      filter(isTeamsLink),
      filter(mightContainASecretHiddenLink),
      map(deteamsify)
    )
    .subscribe(onNext, onError)
})
