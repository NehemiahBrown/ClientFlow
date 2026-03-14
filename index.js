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

const apptDeleteBtn = document.querySelector(".deleteApptBtn");

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

function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length !== 10) return phone;

  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6);

  return `(${area}) ${prefix}-${line}`;
}

// Render Functions
const createCard = function createCard(appointment) {
  const apptCard = document.createElement("div");
  apptCard.classList.add("appointmentCard");
  const date = new Date(appointment.dateTime);
  const formattedDated = date.toLocaleString("en-US");
  const deleteBtn = document.createElement("button");

  apptCard.dataset.id = appointment.id;
  const name = document.createElement("p");
  const phone = document.createElement("p");
  const dateTime = document.createElement("p");
  const statusOptions = document.createElement("select");

  name.classList.add("apptName");
  phone.classList.add("apptPhone");
  dateTime.classList.add("apptDateTime");
  statusOptions.classList.add("statusOptionsAppt");
  deleteBtn.classList.add("deleteApptBtn");

  name.innerText = appointment.name;
  phone.innerText = formatPhone(appointment.phone);
  dateTime.innerText = formattedDated;
  statuses.forEach((status) =>
    statusOptions.add(new Option(status.text, status.value)),
  );
  statusOptions.value = appointment.status;
  deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
`;

  apptCard.append(name, dateTime, phone, statusOptions, deleteBtn);

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

  const cleanedPhone = phone.replace(/[()\-\s]/g, "");

  const phoneValid = cleanedPhone.length === 10;
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

apptCardContainer.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".deleteApptBtn");

  if (!deleteBtn) return;

  const card = deleteBtn.closest(".appointmentCard");
  appointments = appointments.filter((appt) => appt.id !== card.dataset.id);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  renderAppointments();
});

// Initialization
if (savedAppointments) {
  appointments = savedAppointments;
  renderAppointments();
}
