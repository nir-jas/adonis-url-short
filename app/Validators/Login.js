"use strict";

class Login {
	get rules () {
		return {
			email: "required|email",
			password: 'required'
		}
	}

	get messages() {
		return {
			'email.required':'Email is required',
			'email.email':'A valid email is required',
			'password.required':'Password is required'
		}
	}
  
	async fails(errorMessages) {
		this.ctx.session.flashOnly(['email'])
		this.ctx.session.withErrors(errorMessages).flashAll()
		this.ctx.response.redirect('back')
		return
	}
}

module.exports = Login;
