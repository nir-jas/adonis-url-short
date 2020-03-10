'use strict'
const User=use('App/Models/User')
const Hash = use('Hash')
const Logger = use('Logger')

class UserController {
	async changePassword({ request, view, response, auth,session }){
		let params=request.all();
		try {
			let verifyPassword=await Hash.verify(params.currentPassword,auth.user.password);
			if(!verifyPassword){
				session.flash({
					error: "Sorry, Current password not matched."
				});
				response.redirect("back");
				return;
			}

			if(params.currentPassword==params.password){
				session.flash({
					error: "New password can not be same as current password!"
				});
				response.redirect("back");
				return;
			}

			await User.query().where('id',auth.user.id).update({'password':await Hash.make(params.password)})
			await auth.logout();

			session.flash({ 
				success: 'Password has been changed successfully. Login using your new password.',
			});
			response.route('login');
			return

		} catch (error) {
			
		}
	}
}

module.exports = UserController
