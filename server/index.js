import Pretender from 'pretender'
import reviews from "./routes/reviews";

export default new Pretender(function () {
  reviews(this);

  this.handledRequest = function (verb, path, request) {
    
    const { requestBody, responseText } = request
    let loggedRequest, loggedResponse

    try {
      loggedRequest = JSON.parse(requestBody)
    } catch (e) {
      loggedRequest = requestBody
    }

    try {
      loggedResponse = JSON.parse(responseText)
    } catch (e) {
      loggedResponse = responseText
    }

    
  }

  this.unhandledRequest = function (verb, path, request) {
    if (path.indexOf('/api/') !== 0) {
      request.passthrough() // <-- A native, sent xhr is returned
    }
  }
})
