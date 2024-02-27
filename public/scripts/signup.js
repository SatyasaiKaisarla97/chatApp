document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;

  axios
    .post("/signUp", {
      username,
      email,
      password,
      phone,
    })
    .then(function (response) {
      console.log(response);
      alert("Signup successful");
      document.getElementById("username").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      document.getElementById("phone").value = "";
    })
    .catch(function (error) {
      console.error(error);
      if (error.response.status === 409) {
        if (error.response.data === "Email already in use") {
          alert("Email already exists. Please use a different email.");
        } else if (error.response.data === "Phone number already in use") {
          alert(
            "Phone number already exists. Please use a different phone number."
          );
        }
      } else {
        alert("Signup failed");
      }
    });
});
