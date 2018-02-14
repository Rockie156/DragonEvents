function submitForm() {
  var dictionary = {
    "name": $('#name').val(),
    "description":$('#description').val(),
    "start_date":$('#start_date').val(),
    "end_date":$('#end_date').val(),
    "location":$('#location').val(),
    "event_type":$('#event_type').val(),
            };
			$.ajax({
				url: "./submit",
				type: "POST",
				dataType: "text",
                   data: dictionary

			});
}