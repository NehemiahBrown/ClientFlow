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

let savedAppointments = JSON.parse(localStorage.getItem("appointments"));

const apptCardContainer = document.getElementById("appointmentCardsCont");
const addApptBtn = document.getElementById("addApptBtn");
const closeApptBtn = document.querySelector(".closeApptBtn");

const myForm = document.getElementById("formContainer");
const apptForm = document.getElementById("addApptForm");

const submitApptBtn = document.getElementById("submitApptBtn");

addApptBtn.addEventListener("click", () => {
  myForm.classList.add("showForm");
});

closeApptBtn.addEventListener("click", () => {
  myForm.classList.remove("showForm");
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

// rendering created appointments from form
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

apptForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newAppointment = addAppointment(e.target);
  appointments.push(newAppointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  apptCardContainer.append(createCard(newAppointment));
});
