$().ready(function() {
	$('#eventForm').validate({
		rules: {
			name: "required",
			start_date: "required",
			end_date: "required",
			description: "required",
			location: "required"
		},
		messages: {
			name: "You must give your event a name!"
		},
		submitHandler: function(form) {
			$.ajax({
				url: "./submit",
				type: "POST",
				dataType: "text",
                data: $(form).serialize()
			});
		}
	});
});