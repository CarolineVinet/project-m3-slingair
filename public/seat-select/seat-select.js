const flightInput = document.getElementById("flight");
const seatsDiv = document.getElementById("seats-section");
const confirmButton = document.getElementById("confirm-button");
const flightSubmit = document.getElementById("flight-submit");

let selection = "";

const renderSeats = (data) => {
  //console.log(data);
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
  }
  // TODO: contact the server to get the seating availability
  //      - only contact the server if the flight number is this format 'SA###'.
  //      - Do I need to create an error message if the number is not valid?
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
      seatNumber: document.getElementsByClassName("selected").innerText,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.JSON())
    .then((data) => {
      console.log(data);
    });
};

flightSubmit.addEventListener("click", toggleFormContent);
