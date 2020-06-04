
import { send } from './messages'

//from https://stackoverflow.com/a/43467144/222163
export const isValidHttpUrl = string => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  if (url.protocol === "http:" || url.protocol === "https:") {
    return true
  } else {
    send(`${string} is not an HTTP URL`)
    return false
  }
}

//assumes input is definitely a valid url
export const isTeamsLink = url => {
  if (url.host === "teams.microsoft.com") {
    return true
  } else {
    send(`${url.toString()} is not a teams URL`)
    return false
  }
}

export const mightContainASecretHiddenLink = url => {
  if (url.search && url.search.includes('https%3A%2F%2F')) {
    return true
  } else {
    send('this teams link does not contain a hidden link. to deteamsify - just stop using teams')
    return false
  }
}
