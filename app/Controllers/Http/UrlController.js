'use strict'
const { validate } = use('Validator')

class UrlController {
  async create({ request, view, response, auth }){

  }

  async customLinkAvailabilityCheck({ request, view, response, auth }){
	  const rules = {
		  'url_key': 'required|max:20|unique:urls|lowercase|routeAvailability'
	  }

	  const validation = await validate(request.all(), rules)

	  if (validation.fails()) {
		return response.json({
			errors:validation.messages()
		})
	  }

	  return response.json({'success':'Available'})
  }
}

module.exports = UrlController
