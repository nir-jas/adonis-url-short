'use strict'

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Role = use('Adonis/Acl/Role')
const Permission = use('Adonis/Acl/Permission')
const User = use('App/Models/User')

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class DatabaseSeeder {
  async run () {
	const roleAdmin = new Role()
	roleAdmin.name = 'Administrator'
	roleAdmin.slug = 'administrator'
	roleAdmin.description = 'manage administration privileges'
	await roleAdmin.save()

	const roleUser = new Role()
	roleUser.name = 'User'
	roleUser.slug = 'user'
	roleUser.description = 'manage user privileges'
	await roleUser.save()

	const createUsersPermission = new Permission()
	createUsersPermission.slug = 'create_users'
	createUsersPermission.name = 'Create Users'
	createUsersPermission.description = 'create users permission'
	await createUsersPermission.save()

	const updateUsersPermission = new Permission()
	updateUsersPermission.slug = 'update_users'
	updateUsersPermission.name = 'Update Users'
	updateUsersPermission.description = 'update users permission'
	await updateUsersPermission.save()

	const deleteUsersPermission = new Permission()
	deleteUsersPermission.slug = 'delete_users'
	deleteUsersPermission.name = 'Delete Users'
	deleteUsersPermission.description = 'delete users permission'
	await deleteUsersPermission.save()

	const readUsersPermission = new Permission()
	readUsersPermission.slug = 'read_users'
	readUsersPermission.name = 'Read Users'
	readUsersPermission.description = 'read users permission'
	await readUsersPermission.save()

	await roleAdmin.permissions().attach([
		createUsersPermission.id,
		updateUsersPermission.id,
		deleteUsersPermission.id,
		readUsersPermission.id
	])

	const newAdmin = new User()
	newAdmin.name = "Admin"
	newAdmin.email = "admin@test.com"
	newAdmin.password = "admin@123"
	await newAdmin.save()
	await newAdmin.roles().attach([roleAdmin.id])

	const newUser = new User()
	newUser.name = "User"
	newUser.email = "user@test.com"
	newUser.password = "user@123"
	await newUser.save()
	await newUser.roles().attach([roleUser.id])

  }
}

module.exports = DatabaseSeeder
