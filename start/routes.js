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

Route.get('/error/:status', 'ErrorController.show').as('error')

Route.group(() => {
	Route.get('/logout','AuthController.logout').as('logout')
}).middleware(['auth'])

Route.group(() => {
	Route.post('/custom_link/check_availability','UrlController.customLinkAvailabilityCheck').validator(['CustomLinkAvailability'])
}).prefix('api').namespace('Api/V1')

Route.get('/:url_key','UrlController.redirect')
