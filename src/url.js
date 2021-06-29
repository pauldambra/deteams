
import { send } from './messages'

//from https://stackoverflow.com/a/43467144/222163
export const isValidHttpUrl = string => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    send("That's not an HTTP URL")
    return false;
  }

  if (url.protocol === "http:" || url.protocol === "https:") {
    return true
  } else {
    send("That's not an HTTP URL")
    return false
  }
}

//assumes input is definitely a valid url
export const isTeamsLink = url => {
  if (url.host === "teams.microsoft.com") {
    return true
  } else {
    send("That's not a teams URL")
    return false
  }
}

export const mightContainASecretHiddenLink = url => {
  const hasLinkInSearchParam = url => url && url.search && url.search.includes('https%3A%2F%2F');

  const hasViewerUrlInHash = url => url && url.hash && url.hash.includes('https:~2F~2F');

  if (hasLinkInSearchParam(url) || hasViewerUrlInHash(url)) {
    return true
  }
  else if(url.pathname.includes('channel') || url.pathname.includes('thread.skype')) {
    send('That teams link does not contain a hidden link. It looks like a link to a teams team team channel, you might have to use teams 🤬')
    return false
  } else {
    send('That teams link does not contain a hidden link. to deteamsify - just stop using teams')
    return false
  }
}
