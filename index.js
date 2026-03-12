let appointments = [];

const statuses = [
  {
    text: "Scheduled",
    value: "scheduled",
  },
  {
    text: "Completed",
    value: "completed",
  },
  {
    text: "Canceled",
    value: "canceled",
  },
];

// Variables for DOM elements
const apptCardContainer = document.getElementById("appointmentCardsCont");
const addApptBtn = document.getElementById("addApptBtn");
const closeApptBtn = document.querySelector(".closeApptBtn");

const apptFormCont = document.getElementById("formContainer");
const apptForm = document.getElementById("addApptForm");

// local storage
let savedAppointments = JSON.parse(localStorage.getItem("appointments"));

// utility functions
const statusColor = function statusColor(options) {
  const color =
    options.value == "scheduled"
      ? (options.style.background = "#5f9ea0")
      : options.value == "completed"
        ? (options.style.background = "#5faf8e")
        : options.value == "canceled"
          ? (options.style.background = "#c76a6a")
          : (options.style.background = "#000");

  return color;
};

// Render Functions
const createCard = function createCard(appointment) {
  const apptCard = document.createElement("div");
  apptCard.classList.add("appointmentCard");
  const date = new Date(appointment.dateTime);
  const formattedDated = date.toLocaleString("en-US");

  const name = document.createElement("p");
  const phone = document.createElement("p");
  const dateTime = document.createElement("p");
  const statusOptions = document.createElement("select");

  name.classList.add("apptName");
  phone.classList.add("apptPhone");
  dateTime.classList.add("apptDateTime");
  statusOptions.classList.add("statusOptionsAppt");

  name.innerText = appointment.name;
  phone.innerText = appointment.phone;
  dateTime.innerText = formattedDated;
  statuses.forEach((status) =>
    statusOptions.add(new Option(status.text, status.value)),
  );
  statusOptions.value = appointment.status;

  apptCard.append(name, phone, dateTime, statusOptions);

  statusColor(statusOptions);
  statusOptions.addEventListener("change", () => {
    statusColor(statusOptions);
  });
  return apptCard;
};

const renderAppointments = function () {
  apptCardContainer.innerHTML = "";
  appointments.forEach((appt) => {
    apptCardContainer.append(createCard(appt));
  });
};

// Form Logic
const createAppointment = function (form) {
  const appointment = new FormData(form);

  return {
    id: crypto.randomUUID(),
    name: appointment.get("name")?.trim(),
    phone: appointment.get("phone")?.trim() ?? "",
    dateTime: appointment.get("dateTime"),
    status: "scheduled",
  };
};

const validateForm = function (form) {
  let isValid = true;
  const nameError = form.querySelector(".fullNameCont");
  const phoneError = form.querySelector(".phoneCont");

  const name = form.elements["name"].value.trim();
  const phone = form.elements["phone"].value.trim();

  const phonePattern = /^\d{10}$/;

  const phoneValid = phonePattern.test(phone);
  console.log(nameError);
  console.log(phoneError);

  if (name === "") {
    nameError.querySelector(".nameErrorMsg").classList.add("showError");
    isValid = false;
  } else {
    nameError.querySelector(".nameErrorMsg").classList.remove("showError");
  }

  if (!phoneValid) {
    phoneError.querySelector(".phoneErrorMsg").classList.add("showError");
    isValid = false;
  } else {
    phoneError.querySelector(".phoneErrorMsg").classList.remove("showError");
  }

  return isValid;
};

// Event Listeners
addApptBtn.addEventListener("click", () => {
  apptFormCont.classList.add("showForm");
});

closeApptBtn.addEventListener("click", () => {
  apptFormCont.classList.remove("showForm");
});

apptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm(e.target)) {
    console.log("validation failed");
    return;
  } else {
    const newAppointment = createAppointment(e.target);
    appointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));
    renderAppointments();
    e.target.reset();
    apptFormCont.classList.remove("showForm");
  }
});

// Initialization
if (savedAppointments) {
  appointments = savedAppointments;
  renderAppointments();
}
