'use strict'

class UrlController {
  async customLinkAvailabilityCheck({ response }){
	  response.jsend({'success':'Available'},'Successfully Requested')
	  return
  }
}

module.exports = UrlController
