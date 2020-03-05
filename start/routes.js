'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('home.index').as('home')
Route.on('/login').render('auth.login').as('login').middleware(['guest'])
Route.on('/register').render('auth.register').as('register').middleware(['guest'])
Route.post('/create','UrlController.create').as('createShortLink').middleware(['linkChecker'])
Route.get('/+:url_key', 'UrlController.view').as('short_url.stats')
Route.post('/register','AuthController.register').as('registerUser').validator(['Register'])
Route.post('/login','AuthController.login').as('loginUser').validator(['Login'])

// Common Authenticated Routes
Route.group(() => {
	Route.get('/logout','AuthController.logout').as('logout')
	Route.get('/dashboard', 'DashboardController.index')
	Route.on('/profile').render('users.partials.profile').as('profile')
	Route.on('/changepassword').render('users.partials.change_password').as('changePassword')

	Route.on('/users').render('users.index').as('users')

	Route.post('/changepassword','UserController.changePassword').as('changeUserPassword').validator(['ChangePassword'])

}).middleware(['auth'])

// Authenticated Routes for Admin
Route.group(() => {

})

Route.group(() => {
	Route.post('/custom_link/check_availability','UrlController.customLinkAvailabilityCheck').validator(['CustomLinkAvailability'])

	Route.get('/all/users','UserController.getUsers')
	Route.post('/user/change_password', 'UserController.changePassword')
}).prefix('api').namespace('Api/V1')

Route.get('/:url_key','UrlController.redirect')
