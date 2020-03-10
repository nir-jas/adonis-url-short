$(document).ready(function () {
	var t = $('#usersTable').DataTable({
		"paging": true,
		"pageLength": 10,
		"processing": true,
		"serverSide": true,
		'ajax': {
			'type': 'GET',
			'url': '/api/v1/users'
		},
		'columns':
			[
			{ 'data': 'name', "defaultContent": "", 'name': 'Name' },
			{ 'data': 'email', "defaultContent": "", 'email': 'Email' },
			],
		"columnDefs": [
			{
				"searchable": false,
				"orderable": false,
				"targets": 0
			}
		]

	});

   /* t.on('draw', function () {
		//setting the next and prev buttons with active or disabled state
		//setting the index column with values.
		t.column(0, { search: 'applied', order: 'applied' }).nodes().each(
			function (cell, i) {
				cell.innerHTML = i + 1;
			}
		);
	});
	*/
	//paging
   /* $('#next').on('click', function () {
		t.page('next').draw('page');
	});
	$('#previous').on('click', function () {
		t.page('previous').draw('page');
	});
*/
//$('#ZipcodesTable').DataTable();
 });
