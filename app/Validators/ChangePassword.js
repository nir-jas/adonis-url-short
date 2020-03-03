"use strict";

class ChangePassword {
	get rules () {
		return {
			currentPassword: 'required',
			password: 'required|min:8|confirmed',
			password_confirmation: 'required|min:8'
		}
	}

	get messages() {
		return {
			'currentPassword.required': 'Current password is required',
			'password.required':'New password is required',
			'password.min':'New password must have atleast 8 characters',
			'password.confirmed':'New password must match with confirm password',
			'password_confirmation.required':'Confirm password is required'
		}
	}
  
	async fails(errorMessages) {
		this.ctx.session.withErrors(errorMessages).flashAll()
		this.ctx.response.redirect('back')
		return
	}
}

module.exports = ChangePassword;
