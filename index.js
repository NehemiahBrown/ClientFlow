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
// local storage
let savedAppointments = JSON.parse(localStorage.getItem("appointments"));

// Variables for DOM elements
const apptCardContainer = document.getElementById("appointmentCardsCont");
const addApptBtn = document.getElementById("addApptBtn");
const closeApptBtn = document.querySelector(".closeApptBtn");

const apptFormCont = document.getElementById("formContainer");
const apptForm = document.getElementById("addApptForm");

const submitApptBtn = document.getElementById("submitApptBtn");

// showing and hiding form
addApptBtn.addEventListener("click", () => {
  apptFormCont.classList.add("showForm");
});

closeApptBtn.addEventListener("click", () => {
  apptFormCont.classList.remove("showForm");
});

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

//creating appointment cards
const createCard = function createCard(appointment) {
  const apptCard = document.createElement("div");
  apptCard.classList.add("appointmentCard");

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
  dateTime.innerText = appointment.dateTime;
  statuses.forEach((status) =>
    statusOptions.add(new Option(status.text, status.value)),
  );
  statusOptions.value = appointment.status;

  const date = new Date(appointment.dateTime);
  const formattedDated = date.toLocaleString("en-US");

  apptCard.append(name, phone, formattedDated, statusOptions);

  statusColor(statusOptions);
  statusOptions.addEventListener("change", () => {
    statusColor(statusOptions);
  });
  return apptCard;
};

// rendering appointments from local storage
const renderAppointments = function () {
  for (let i = 0; i < appointments.length; i++) {
    createCard([appointments[i]]);
  }
};

if (savedAppointments) {
  appointments = savedAppointments;
  renderAppointments();
}

appointments.forEach((appt) => {
  apptCardContainer.append(createCard(appt));
});

// adding new appointment to the array and local storage
const addAppointment = function (form) {
  const appointment = new FormData(form);

  return {
    id: crypto.randomUUID(),
    name: appointment.get("name")?.trim(),
    phone: appointment.get("phone")?.trim() ?? "",
    dateTime: appointment.get("dateTime"),
    status: "scheduled",
  };
};

// form validation
const validateForm = function (form) {
  let isValid = true;
  const nameError = form.querySelector(".fullNameCont");
  const phoneError = form.querySelector(".phoneCont");
  const dateTimeError = form.querySelector(".dateTimeCont");

  const name = form.elements["name"].value.trim();
  const phone = form.elements["phone"].value.trim();
  const dateTime = form.elements["dateTime"].value;

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

apptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm(e.target)) {
    console.log("validation failed");
    return;
  } else {
    const newAppointment = addAppointment(e.target);
    e.target.reset();
    appointments.push(newAppointment);
    apptFormCont.style.display = "none";
    localStorage.setItem("appointments", JSON.stringify(appointments));
    apptCardContainer.append(createCard(newAppointment));
  }
});
