
const app = new Vue({
	el: '#dashboard',
	data: {
		pagination:{
			total:0,
			limit:10,
			page:1,
			last_page:1
		},
		urls:[],
		isLoading: false
	},
	mounted() {
		this.getUrls()
	},
	methods: {
		getFromNowString(date) {
			return moment(date,"YYYY-MM-DD hh:mm:ss").fromNow()
		},
		getUrls(page=1) {
			this.isLoading = true;
			axios.get('/api/v1/urls',{
				params:{
					page:page
				}
			})
			.then((response)=>{
				this.isLoading = false;
				this.urls = response.data.data.data;
				this.pagination = {
					total:response.data.data.total,
					limit: response.data.data.perPage,
					page: response.data.data.page,
					last_page: response.data.data.lastPage
				}
			})
			.catch((error)=>{
				this.isLoading = false;
				console.log(error)
			})
		},
		deleteUrl(url_id) {
			axios.delete(`/api/v1/urls/${url_id}`)
			.then((response)=>{
				toastr.success('Link was deleted successfully');
				this.getUrls(this.pagination.page)
			})
			.catch((error)=>{
				toastr.error('Something Went Wrong')
			})
		}
	}
})
