import { fromEvent } from 'rxjs'
import { filter, debounceTime, map } from 'rxjs/operators'
import { isTeamsLink, isValidHttpUrl, mightContainASecretHiddenLink } from './url'
import { deteamsify } from './deteamsifier'
import { Subject } from 'rxjs'
import { link, listItem } from './html'

const onError = e => {
  document.getElementsByClassName('message')[0].innerHTML = e.message
}

const onNext = s => {
  const ul = document.getElementsByClassName('links')[0].children[0]
  const li = listItem(link(s))
  ul.appendChild(li)
}



/**
 * ok on input even check if it's a link
 * then check that it's a teams link
 * then see if it has a link inside it
 * put a message in the UI if it is
 * if the message is some feedback it goes in "slot 0" at the top of the output
 * if the message is a deteams'd link then it goes at the top of slot 1, keeping previous items below it
 */

const wiring = () => {
  fromEvent(document.getElementsByClassName('undeteamsified'), 'input')
    .pipe(
      debounceTime(200),
      map(x => x.target.value),
      filter(isValidHttpUrl),
      map(u => new URL(u)),
      filter(isTeamsLink),
      filter(mightContainASecretHiddenLink),
      map(deteamsify)
    )
    .subscribe(onNext, onError)

}

document.addEventListener('DOMContentLoaded', () => {
  wiring()
})
