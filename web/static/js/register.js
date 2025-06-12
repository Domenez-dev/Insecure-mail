document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const planSelect = document.getElementById("plan");
  const steps = document.querySelectorAll(".form-step");
  const progressSteps = document.querySelectorAll(".step");
  const emailDisplay = document.querySelector(".user-email");
  const resendOtpLink = document.getElementById("resendOtp");
  const btnPrevToPlan = document.getElementById("btnPrevToPlan");
  const phoneInputField = document.querySelector("#phone");
  const phoneInput = window.intlTelInput(phoneInputField, {
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  let currentStep = 1;

  // Navigation handlers
  for (const button of document.querySelectorAll(".btn-next")) {
    button.addEventListener("click", () => {
      const nextStep = Number.parseInt(button.getAttribute("data-next"));
      navigateToStep(nextStep);
    });
  }

  for (const button of document.querySelectorAll(".btn-prev")) {
    button.addEventListener("click", () => {
      let prevStep = Number.parseInt(button.getAttribute("data-prev"));
      if (button.id === "btnPrevToPlan" && planSelect.value === "free") {
        prevStep = 1;
      }
      navigateToStep(prevStep);
    });
  }

  planSelect.addEventListener("change", () => {
    btnPrevToPlan.setAttribute(
      "data-prev",
      planSelect.value === "free" ? "1" : "3",
    );
  });

  const otpInputs = document.querySelectorAll(".otp-digit");
  for (let index = 0; index < otpInputs.length; index++) {
    const input = otpInputs[index];

    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value.length === 0 && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  }

  resendOtpLink.addEventListener("click", (e) => {
    e.preventDefault();
    alert("A new verification code has been sent to your email.");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Registration complete! Thank you for signing up.");
  });

  const navigateToStep = (step) => {
    if (!validateStep(currentStep)) return;

    const selectedPlan = planSelect.value;
    if (selectedPlan === "free" && step > 1 && step < 4) {
      step = 4;
    }

    currentStep = step;
    updateProgressSteps(step);

    for (const stepElement of steps) {
      const stepNumber = Number.parseInt(stepElement.getAttribute("data-step"));
      stepElement.classList.toggle("active", stepNumber === step);
    }

    if (step === 4) {
      const email = document.getElementById("email").value;
      emailDisplay.textContent = email;
    }
  };

  const validateStep = (step) => {
    if (step === 1) {
      const requiredFields = ["fullName", "email", "plan", "password"];
      for (const field of requiredFields) {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
          alert(
            `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          );
          input.focus();
          return false;
        }
      }

      const email = document.getElementById("email").value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address");
        return false;
      }
    }

    if (step === 2 && planSelect.value !== "free") {
      const requiredFields = ["cardNumber", "expiryDate", "cvv", "cardName"];
      for (const field of requiredFields) {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
          alert(
            `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          );
          input.focus();
          return false;
        }
      }
    }

    if (step === 3 && planSelect.value !== "free") {
      const requiredFields = [
        "billingAddress",
        "billingCity",
        "billingCountry",
      ];
      for (const field of requiredFields) {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
          alert(
            `Please fill in the ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
          );
          input.focus();
          return false;
        }
      }
    }

    return true;
  };

  const updateProgressSteps = (activeStep) => {
    for (const step of progressSteps) {
      const stepNumber = Number.parseInt(step.getAttribute("data-step"));
      step.classList.toggle("active", stepNumber <= activeStep);
    }
  };

  // Format card number
  const cardInput = document.getElementById("ccn");
  cardInput.addEventListener("input", (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 16);
    e.target.value = value.replace(/(.{4})/g, "$1 ").trim();
  });

  // Format expiry date
  const expiryInput = document.getElementById("expiryDate");
  expiryInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (value.length >= 3) {
      value = value.replace(/^(\d{2})(\d{1,2})$/, "$1/$2");
    }
    e.target.value = value;
  });

  const getQueryParams = () => {
    const params = {};
    const search = window.location.search.substring(1);
    for (const pair of search.split("&")) {
      const [key, value] = pair.split("=");
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    }
    return params;
  };

  const query = getQueryParams();
  if (query.name) document.getElementById("fullName").value = query.name;
  if (query.email) document.getElementById("email").value = query.email;
  if (query.plan) {
    planSelect.value = query.plan;
    if (query.plan === "free") {
      for (const opt of planSelect.querySelectorAll("option")) {
        if (opt.value !== "free") opt.disabled = true;
      }
    }
  }
});
