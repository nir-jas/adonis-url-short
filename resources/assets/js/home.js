$(function () {
	var twOptions = {
        callback: function (value) {
			$('#link-availability-status').html("")

			if (value.length>0) {
				$('#link-availability-status').html('<span><i class="fa fa-spinner"></i> Loading..</span>');
				$.ajax({
					url: "/api/custom_link/check_availability",
					type: 'POST',
					data: {
						'url_key': $('#custom_url_key').val()
					},
					dataType: "json"
				})
            	.done(function(data) {
						$("#link-availability-status")
							.removeClass("text-danger")
							.addClass("text-success");
						$("#link-availability-status").html(data.data.success);
				}).fail(function (jqXHR, textStatus) {
					if (jqXHR.responseJSON.data && jqXHR.responseJSON.data.errors) {
						$("#link-availability-status")
							.removeClass("text-success")
							.addClass("text-danger");
						$("#link-availability-status").html(jqXHR.responseJSON.data.errors[0].message);
					} else {
						$("#link-availability-status").html("Hmm. We're having trouble connecting to the server.");
					}
				});
			}

        },
        wait: 500,
        captureLength: 1,
        highlight: true,
        allowSubmit: false
    };

    // Add TypeWatch to check when users type
    $('#custom_url_key').typeWatch(twOptions);
})
