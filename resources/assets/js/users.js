Vue.use(Vuetable);
let app = new Vue({
	el: "#app",
	data: {
		showLoader: false,
		searchText: "",
		tablePagination: {},
		totalRecords: 0,
		searchText: "",
		css: {
			table: {
				tableWrapper: "border",
				ascendingIcon: "fas fa-sort-up text-secondary pull-right",
				descendingIcon: "fas fa-sort-down text-secondary pull-right",
				sortableIcon: "fas fa-sort-up pull-right",
				tableClass: "table table-striped mb-0",
				renderIcon(classes, options) {
					return `<i class="${classes.join(" ")}"></i>`;
				}
			},
			pagination: {
				wrapperClass: "vuetable-pagination",
				activeClass: "btn-primary text-white",
				disabledClass: "disabled",
				pageClass: "btn btn-border btn-sm",
				linkClass: "btn btn-border text-blue-grey",
				infoClass: "left floated left aligned six wide column",
				icons: {
					first: "fas fa-backward",
					prev: "fas fa-caret-left",
					next: "fas fa-caret-right",
					last: "fas fa-forward"
				}
			}
		},
		fields: [
			{
				name: "name",
				sortField: "name",
				title: "Name"
			},
			{
				name: "email",
				sortField: "email",
				title: "Email"
			},
			{
				name: "role",
				title: "Roles"
			},
			{
				name: "created_at",
				sortField: "created_at",
				title: "Member Since"
			},
			{
				name: "updated_at",
				sortField: "updated_at",
				title: "Last Updated"
			},
			{
				name: "action-slot",
				title: "Actions",
				titleClass: "center aligned",
				dataClass: "center aligned",
				width: "5%"
			}
		],
		sortOrder: [
			{
				direction: "desc"
			}
		],
		currentUser: {},
		changePasswordObject: {
			current_password: "",
			new_password: "",
			confirm_password: ""
		},
		successMessage: "",
		errorMessage: ""
	},
	mounted() {},
	methods: {
		searchUser() {
			this.$refs.vuetable.refresh();
		},

		transformData(data) {
			this.totalRecords = data.data.total;
			data.data.data = _.filter(data.data.data, item => {
				item.name = item.name ? item.name : "";
				item.email = item.email ? item.email : "";
				item.created_at = this.getMemberSince(item.created_at);
				item.role = item.roles && item.roles.length > 0 ? this.getRoles(item.roles) : "";
				item.member_since = this.getMemberSince(item.created_at);
				item.updated_at = this.getUpdatedAt(item.updated_at);
				return item;
			});
			let formNumber = 1;
			let toNumber = data.data.perPage * data.data.page;
			if (data.data.data.length < data.data.perPage) {
				toNumber -= data.data.perPage - data.data.data.length;
			}

			if (data.data.page > 1) {
				formNumber = (data.data.page - 1) * data.data.perPage + 1;
			}
			data.data.pagination = {
				total: data.data.total,
				per_page: data.data.perPage,
				current_page: data.data.page,
				last_page: data.data.lastPage,
				next_page_url: "",
				prev_page_url: "",
				from: formNumber,
				to: toNumber
			};
			return data;
		},
		makeQueryParams(sortOrder, currentPage, perPage) {
			return {
				sort: sortOrder[0].sortField,
				order: sortOrder[0].direction,
				page: currentPage,
				limit: perPage,
				search: this.searchText
			};
		},
		onPaginationData(paginationData) {
			this.$refs.pagination.setPaginationData(paginationData);
			this.$refs.paginationInfo.setPaginationData(paginationData);
		},

		getUsers() {
			axios
				.get("/api/v1/users", { params: { page: 1 } })
				.then(response => {
					console.log(response);
				})
				.catch(error => {
					console.log(error);
				});
		},
		onChangePage(page) {
			this.$refs.vuetable.changePage(page);
		},
		getRoles(roles) {
			console.log(_.pluck(roles, "name"))
			return _.pluck(roles, "name").toString();
		},
		searchUser() {
			this.$refs.vuetable.refresh();
		},
		getMemberSince(date) {
			return moment(date, "YYYY-MM-DD hh:mm:ss").fromNow();
		},
		getUpdatedAt(date) {
			return moment(date, "YYYY-MM-DD hh:mm:ss").fromNow();
		},
		changePassword(data) {
			this.currentUser = data;
			this.changePasswordObject = {
				current_password: "",
				new_password: "",
				confirm_password: ""
			};
			this.errorMessage = "";
			$("#changePasswordModal").modal("show");
		},
		submitChangePassword() {
			this.changePasswordObject.user_id = this.currentUser.id;
			axios
				.post("/api/v1/user/change_password", this.changePasswordObject)
				.then(response => {
					this.errorMessage = "";
					iziToast.success({
						message: `Password changed for ${this.currentUser.name} successfully.`,
						position: "bottomCenter"
					});
					$("#changePasswordModal").modal("hide");
				})
				.catch(error => {
					this.errorMessage = "";
					if (error.response.data.message == "current_password required")
						this.errorMessage = "Current password is required";

					if (error.response.data.message == "invalid current_password")
						this.errorMessage = "Current password is not valid";

					if (error.response.data.message == "invalid current_password")
						this.errorMessage = "Current password is not valid";

					if (error.response.data.message == "new_password required") this.errorMessage = "New password is required";

					if (error.response.data.message == "confirm_password required")
						this.errorMessage = "Confirm password is required";

					if (error.response.data.message == "password not matched") this.errorMessage = "Password not matched";

					this.changePasswordObject = {
						current_password: "",
						new_password: "",
						confirm_password: ""
					};
				});
		}
	}
});
