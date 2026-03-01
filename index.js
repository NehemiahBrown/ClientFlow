const appointments = [
  {
    id: 1,
    name: "Nehemiah Brown",
    phone: "(618) 892-2929",
    dateTime: "2026-02-28T10:00:00",
    status: "scheduled",
  },
  {
    id: 2,
    name: "Javier Sanchez",
    phone: "(773) 892-1233",
    dateTime: "2026-03-07T13:30:00",
    status: "canceled",
  },
  {
    id: 3,
    name: "Arielle Dupoint",
    phone: "(312) 243-9032",
    dateTime: "2026-03-12T18:30:00",
    status: "scheduled",
  },
  {
    id: 4,
    name: "Ryan Parra",
    phone: "(618) 892-2929",
    dateTime: "2026-02-15T15:00:00",
    status: "scheduled",
  },
  {
    id: 5,
    name: "Pierre Alonso",
    phone: "(618) 892-2929",
    dateTime: "2026-02-10T12:00:00",
    status: "completed",
  },
];

const apptCardContainer = document.getElementById("appointmentCardsCont");

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
