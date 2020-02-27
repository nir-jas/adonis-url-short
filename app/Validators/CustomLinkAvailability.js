'use strict'

class CustomLinkAvailability {
  get rules () {
    return {
		'url_key': 'required|max:20|unique:urls|lowercase|routeAvailability'
    }
  }

  get messages() {
	  return {
		  'url_key.max': 'length should be less than 20 characters',
		  'url_key.routeAvailability':'Not available',
		  'url_key.unique':'Not available',
		  'url_key.lowercase':'Must be Lowercase'
	  }
  }

  async fails(errorMessages) {
	  return this.ctx.response.jsend({
		  errors:errorMessages
	  }, 'Bad Request' , 400)
  }
}

module.exports = CustomLinkAvailability
