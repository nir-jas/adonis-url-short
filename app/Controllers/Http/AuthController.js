'use strict'
const Logger = use('Logger')
const User = use('App/Models/User')

class AuthController {
	async register({ request, view, response, auth,session}) {
		let params=request.all();
        try {
			let user = await User.findBy('email', params.email);
			if (user) {
				session.flash({
					'error':'Sorry, A user with given email already exists.'
				})
				response.redirect('back')
				return
			}

			if(params.password!=params.confirmpassword){
				session.flash({
					'error':'Sorry, Password not matched.'
				})
				response.redirect('back')
				return
			}

			user = await User.create({
				"name":params.name,
				"email":params.email,
				"password":params.password
			})
			await auth.remember(true).attempt(params.email, params.password)

			response.redirect('/')
			return

        } catch (error) {
			Logger.error('Signup Error:\n',error);

			session.flash({
				'error':'Something went wrong'
			})
			response.redirect('back')
			return
        }
	}

	async login({ request, view, response, auth,session}) {
		let params=request.all();
        try {
			await auth.remember(params.remember?true:false).attempt(params.email, params.password)

			response.route('home');
			return
        } catch (error) {
			Logger.error('User login error ',error)
			let message = "Sorry, our service is currently under maintenance.";
			if (error.code == 'E_PASSWORD_MISMATCH' || error.code == 'E_USER_NOT_FOUND') {
				message = "Email or Password Invalid"
			}

			session.flashOnly(['email'])
			session.flash({"error":message})
			response.redirect('back')
			return
        }
	}

	async logout({ request, view, response, auth }){
		await auth.logout();
		response.route('home');
		return
	}


}

module.exports = AuthController
