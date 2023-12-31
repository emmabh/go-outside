const fetch = require("node-fetch");
const qs = require("querystring");

/**
 * Get a query string parameter from a request, with the ability to have
 * a fallback value
 */
const getParam = (event, key, defaultValue) => {
  if (!event.queryStringParameters || !event.queryStringParameters[key]) {
    return defaultValue;
  }

  return event.queryStringParameters[key];
};

/**
 * Get the ip address from the lambda event
 */
const retrieveUserSourceIp = event => {
  if (
    !event.requestContext ||
    !event.requestContext.identity ||
    !event.requestContext.identity.sourceIp
  ) {
    return "";
  }

  return event.requestContext.identity.sourceIp;
};

const verifyRecaptcha = (response, remoteip) => {
  return fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: qs.stringify({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response,
      remoteip
    }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(resp => {
      return resp.json();
    })
    .then(data => {
      if (!data.success) {
        console.log("recaptcha info", data);
        return false;
      }

      return true;
    });
};

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

module.exports = {
  getParam,
  retrieveUserSourceIp,
  verifyRecaptcha,
  shuffleArray
};
