function validateRegisterForm() {
    let valid = true;
  
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
  
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
  
    // Clear previous error messages
    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
  
    // Validate username
    if (username.value.trim() === '') {
      usernameError.textContent = 'Username is required.';
      valid = false;
    }
  
    // Validate email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email.value)) {
      emailError.textContent = 'Invalid email format.';
      valid = false;
    }
  
    // Validate password
    if (password.value.length < 8) {
      passwordError.textContent = 'Password must be at least 8 characters long.';
      valid = false;
    }
  
    return valid;
  }
  
  function validateLoginForm() {
    let valid = true;
  
    const username = document.getElementById('username');
    const password = document.getElementById('password');
  
    const loginUsernameError = document.getElementById('loginUsernameError');
    const loginPasswordError = document.getElementById('loginPasswordError');
  
    // Clear previous error messages
    loginUsernameError.textContent = '';
    loginPasswordError.textContent = '';
  
    // Validate username
    if (username.value.trim() === '' || username.value.includes('@')) {
        usernameError.textContent = 'Username cannot contain "@" and cannot be empty.';
        valid = false;
      }
  
    // Validate password
    if (password.value.trim() === '') {
      loginPasswordError.textContent = 'Password is required.';
      valid = false;
    }
  
    return valid;
  }
  