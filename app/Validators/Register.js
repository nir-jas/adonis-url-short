"use strict";

class Register {
	get rules () {
		return {
			name: 'required',
			email: "required|email|unique:users",
			password: 'required|min:8',
			confirmpassword: 'required|min:8'
		}
	}

	get messages() {
		return {
			'name.required': 'Name is required',
			'email.required':'Email is required',
			'email.unique':'Email is already used',
			'password.required':'Password is required',
			'password.min':'Password must have atleast 8 characters',
			'confirmpassword.required':'Confirm password is required'
		}
	}
  
	async fails(errorMessages) {
		return this.ctx.response.jsend({
			errors:errorMessages
		}, 'Bad Request' , 400)
	}
}

module.exports = Register;
