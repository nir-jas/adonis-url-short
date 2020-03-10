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

// Common Authenticated View Routes
Route.group(() => {
	Route.get('/logout','AuthController.logout').as('logout')
	Route.get('/dashboard', 'DashboardController.index')
	Route.on('/profile').render('users.partials.profile').as('profile')
	Route.on('/changepassword').render('users.partials.change_password').as('changePassword')
	Route.post('/changepassword','UserController.changePassword').as('changeUserPassword').validator(['ChangePassword'])
}).middleware(['auth'])

// Authenticated View Routes for Admin
Route.group(() => {
	Route.on('/users').render('users.index').as('users')
}).middleware(['auth','is:administrator'])

//Common APIs
Route.group(() => {
	Route.post('/custom_link/check_availability','UrlController.customLinkAvailabilityCheck').validator(['CustomLinkAvailability'])
}).prefix('api/v1').namespace('Api/V1')

// Common Authenticated APIs
Route.group(() => {
	Route.get('/urls', 'UrlController.getUrls').middleware(['auth:session'])
	Route.delete('/urls/:id', 'UrlController.deleteUrl').middleware(['auth:session'])
}).prefix('api/v1').namespace('Api/V1')

// Authenticated APIs for Admin
Route.group(() => {
	Route.get('/users','UserController.getUsers')
})
.prefix('api/v1')
.namespace('Api/V1')
.middleware(['auth','is:administrator'])

Route.get('/:url_key','UrlController.redirect')
