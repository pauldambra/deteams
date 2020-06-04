
//from https://stackoverflow.com/a/43467144/222163
export const isValidHttpUrl = string => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

//assumes input is definitely a valid url
export const isTeamsLink = url => {
  return url.host === "teams.microsoft.com"
}

export const mightContainASecretHiddenLink = url => {
  if (url.search && url.search.includes('https%3A%2F%2F')) {
    return true
  } else {
    throw new Error('this teams link does not contain a hidden link. to deteamsify - just stop using teams')
  }
}
