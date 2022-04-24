const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

function submitData(event) {
  event.preventDefault();
  const form = document.getElementById("my-form");
  const formData = new FormData(form);

  if (formData.get('name') == "" || formData.get('email') == "" || formData.get('message') == "") {
    alert("Please fill all the fields");
  } else {
    window.location = '/home'
    alert("Your message has been sent successfully");
  }
}

