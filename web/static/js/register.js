document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const planSelect = document.getElementById("plan");
  const steps = document.querySelectorAll(".form-step");
  const progressSteps = document.querySelectorAll(".step");
  const emailDisplay = document.querySelector(".user-email");
  const resendOtpLink = document.getElementById("resendOtp");
  const btnPrevToPlan = document.getElementById("btnPrevToPlan");
  const phoneInputField = document.querySelector("#phone");

  // Add novalidate to prevent browser validation
  form.setAttribute("novalidate", true);

  const phoneInput = window.intlTelInput(phoneInputField, {
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  let currentStep = 1;

  // Payment fields that need to be disabled for free plan
  const paymentFields = [
    "cardNumber",
    "expiryDate",
    "cvv",
    "cardName",
    "billingAddress",
    "billingCity",
    "billingState",
    "billingZip",
    "billingCountry",
  ];

  // Toggle payment fields disabled state based on plan
  const togglePaymentFields = () => {
    const isFreePlan = planSelect.value === "free";
    paymentFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.disabled = isFreePlan;
        if (isFreePlan) {
          field.removeAttribute("required");
          field.value = ""; // Clear values for free plan
        } else {
          field.setAttribute("required", "true");
        }
      }
    });
  };

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
    togglePaymentFields();
  });

  // OTP input handling
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

  resendOtpLink.addEventListener("click", async (e) => {
    e.preventDefault();
    await sendOtp();
    alert("A new verification code has been sent to your email.");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateAllSteps()) {
      return;
    }

    const payload = {
      email: document.getElementById("email").value,
      name: document.getElementById("fullName").value,
      password: document.getElementById("password").value,
      plan: document.getElementById("plan").value,
      otp: [...document.querySelectorAll(".otp-digit")]
        .map((i) => i.value)
        .join(""),
    };

    // Add payment info only for paid plans
    if (payload.plan !== "free") {
      payload.payment = {
        cardNumber: document.getElementById("cardNumber").value,
        expiryDate: document.getElementById("expiryDate").value,
        cvv: document.getElementById("cvv").value,
        cardName: document.getElementById("cardName").value,
        billingAddress: document.getElementById("billingAddress").value,
        billingCity: document.getElementById("billingCity").value,
        billingState: document.getElementById("billingState").value,
        billingZip: document.getElementById("billingZip").value,
        billingCountry: document.getElementById("billingCountry").value,
      };
    }

    try {
      const res = await fetch("/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.message) {
        alert("🎉 Registration complete!");
        window.location.href = "/confirmation";
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  });

  const navigateToStep = (step) => {
    if (!validateCurrentStep()) return;

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
      const name = document.getElementById("fullName").value;
      emailDisplay.textContent = email;
      sendOtp(email, name);
      console.log("OTP sent successfully");
    }
  };

  const validateCurrentStep = () => {
    const selectedPlan = planSelect.value;

    if (currentStep === 1) {
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

    if (currentStep === 2 && selectedPlan !== "free") {
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

    if (currentStep === 3 && selectedPlan !== "free") {
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

  const validateAllSteps = () => {
    // Validate all steps that were shown
    if (!validateCurrentStep()) return false;

    const selectedPlan = planSelect.value;

    // For paid plans, validate steps 2 and 3 even if we skipped them in navigation
    if (selectedPlan !== "free") {
      const originalStep = currentStep;

      currentStep = 2;
      if (!validateCurrentStep()) return false;

      currentStep = 3;
      if (!validateCurrentStep()) return false;

      currentStep = originalStep;
    }

    return true;
  };

  const sendOtp = async () => {
    const email = document.getElementById("email").value;
    const name = document.getElementById("fullName").value;

    try {
      const res = await fetch("/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();
      if (!data.message) {
        alert("Failed to send OTP: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("OTP sending failed.");
    }
  };

  const updateProgressSteps = (activeStep) => {
    for (const step of progressSteps) {
      const stepNumber = Number.parseInt(step.getAttribute("data-step"));
      step.classList.toggle("active", stepNumber <= activeStep);
    }
  };

  // Format card number
  const cardInput = document.getElementById("cardNumber");
  if (cardInput) {
    cardInput.addEventListener("input", (e) => {
      const value = e.target.value.replace(/\D/g, "").substring(0, 16);
      e.target.value = value.replace(/(.{4})/g, "$1 ").trim();
    });
  }

  // Format expiry date
  const expiryInput = document.getElementById("expiryDate");
  if (expiryInput) {
    expiryInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "").substring(0, 4);
      if (value.length >= 3) {
        value = value.replace(/^(\d{2})(\d{1,2})$/, "$1/$2");
      }
      e.target.value = value;
    });
  }

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

  // Initialize payment fields state
  togglePaymentFields();
});
