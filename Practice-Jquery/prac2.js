$(document).ready(function() {
    $('#contactForm').submit(function(e) {
        let name = $('#name').val().trim();
        let email = $('#email').val().trim();
        let message = $('#message').val().trim();

        if (name === "" || email === "" || message === "") {
            e.preventDefault(); // Prevent form submission
            alert('Please fill in all fields.');
        }
    });
});
