$().ready(function() {
    $('#userForm').validate({
	rules: {
            email: {
                isDrexel: true,
				remote: {
					url: "./is_unique_email",
					type: "POST",
					dataType: "text",
					data: { email: function() {
								return $("#email").val();
						}
					}
				},
				required: true
            },
            password: "required"
	},

        submitHandler: function(form) {
	    $.ajax({
		url: "./submit_user",
		type: "POST",
		dataType: "text",
                data: $(form).serialize()
	    }).done(function() {
		alert('Please check email!');
		$("#userForm").trigger('reset');
	    });
	}
    });
});

$.validator.addMethod(
    "isDrexel",
    function (value, element, requiredValue) {
        return value.indexOf("@drexel.edu")!= -1;

    },
    "Please enter a Drexel University issued email"
);