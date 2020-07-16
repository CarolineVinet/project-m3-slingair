const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const flightSubmit = document.getElementById("flight-submit");

let selection = "";

const renderSeats = (data) => {
  seatsDiv.innerHTML = "";
  document.querySelector(".form-container").style.display = "block";

  const alpha = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r < 11; r++) {
    const row = document.createElement("ol");
    row.classList.add("row");
    row.classList.add("fuselage");
    seatsDiv.appendChild(row);
    for (let s = 1; s < 7; s++) {
      const seatNumber = `${r}${alpha[s - 1]}`; //assign occupied vs available value to each
      const seat = document.createElement("li");

      // Two types of seats to render
      const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
      const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;

      const matchingSeat = data.seatDisplay.find((dataItem) => {
        return dataItem.id === seatNumber;
      });

      if (matchingSeat.isAvailable === true) {
        seat.innerHTML = seatAvailable;
      } else {
        seat.innerHTML = seatOccupied;
      }
      row.appendChild(seat);
    }
  }

  let seatMap = document.forms["seats"].elements["seat"];
  seatMap.forEach((seat) => {
    seat.onclick = () => {
      selection = seat.value;
      seatMap.forEach((x) => {
        if (x.value !== seat.value) {
          document.getElementById(x.value).classList.remove("selected");
        }
      });
      document.getElementById(seat.value).classList.add("selected");
      document.getElementById("seat-number").innerText = `(${selection})`;
      confirmButton.disabled = false;
    };
  });
};

const toggleFormContent = (event) => {
  const flightNumber = flightInput.value;
  console.log("toggleFormContent: ", flightNumber);
  const regexp = new RegExp("SA[0-9]{3}");
  const correctFormat = regexp.test(flightNumber);
  console.log(correctFormat);
  if (correctFormat) {
    fetch(`/flights/${flightNumber}`)
      .then((res) => res.json())
      .then((data) => {
        renderSeats(data);
      });
  } else {
    alert("invalid flight number"); //change that!
  }
};

const handleConfirmSeat = (event) => {
  event.preventDefault();
  fetch("/reservations", {
    method: "POST",
    body: JSON.stringify({
      givenName: document.getElementById("givenName").value,
      surname: document.getElementById("surname").value,
      email: document.getElementById("email").value,
      flightNumber: flightInput.value,
      seatNumber: document.getElementsByClassName("selected")[0].innerText,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      window.location.href = "/confirmed?id=" + data;
    });
};

flightInput.addEventListener("change", toggleFormContent);

fetch("/flightList")
  .then((res) => {
    return res.json();
  })
  .then((dropdownList) => {
    dropdownList.forEach((flightId) => {
      const option = document.createElement("option");
      option.innerText = flightId;
      option.value = flightId;
      flightInput.appendChild(option);
    });
  });
