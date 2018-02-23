$().ready(function() {
    $('#eventForm').validate({
	rules: {
	    name: "required",
	    start_date: "required",
	    start_time: "required",
	    end_date: "required",
	    end_time: "required",
	    description: "required",
	    location: "required"
	},
	messages: {
	    name: "You must give your event a name!"
	},
	submitHandler: function(form) {
	    $.ajax({
		url: "./submit_event",
		type: "POST",
		dataType: "text",
                data: $(form).serialize()
	    }).done(function() {
		alert('Successfully submitted event!');
		$("#eventForm").trigger('reset');
	    });
	}
    });
});

$.validator.addMethod(
    "end_after_start",
    function(value, element, requiredValue) {
	var start_elt = new Date($('#start_date').val());
	var start = new Date($('#start_date').val()).getTime();
	var end = new Date($('#end_date').val()).getTime();
	return start > end;
    },
    "End date must be after start date!"
);
