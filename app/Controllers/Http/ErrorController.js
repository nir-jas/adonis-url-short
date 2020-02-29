'use strict'

class ErrorController {
	async show({ request, view, response, auth, params, session }){
		session.flash({ code: params.status })
		return view.render('errors.index')
	}
}

module.exports = ErrorController
