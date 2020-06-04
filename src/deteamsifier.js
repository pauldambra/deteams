
import { send } from './messages'

// this massively assumes that u is a url and a teams url at that
export const deteamsify = u => {
  // the assumption is that this is a teams link with an encoded link in searchparams
  const searchParams = u.searchParams
  const objectURL = searchParams.get("objectUrl")

  if (objectURL) {
    send('')
    return objectURL
  } else {
    send("no URL found in this teams URL, soz. 🤷‍♀️")
  }
}
