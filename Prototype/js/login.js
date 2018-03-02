$().ready(function() {
    $('#loginForm').validate({
	rules: {
            email: {
                isDrexel: true,
				required: true
            },
            password: "required"
        },
        submitHandler: function(form) {
            $.ajax({
                url: "./login",
                type: "POST",
                dataType: "text",
                data: $(form).serialize()
            }).done(function(msg) {
                alert(msg);
                $("#loginForm").trigger('reset');
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
