const appointments = [
  // {
  //   id: 1,
  //   name: "Nehemiah Brown",
  //   phone: "(618) 892-2929",
  //   dateTime: "2026-02-28T10:00:00",
  //   status: "scheduled",
  // },
];
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

  apptCard.append(name, phone, dateTime, statusOptions);

  statusColor(statusOptions);
  statusOptions.addEventListener("change", () => {
    statusColor(statusOptions);
  });
  return apptCard;
};

// apptCardContainer.append(createCard(appointments));
appointments.forEach((appt) => {
  apptCardContainer.append(createCard(appt));
});

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
  appointments.push(addAppointment(e.target));
  apptCardContainer.append(createCard());
});
