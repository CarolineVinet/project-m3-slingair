const { flights } = require("../test-data/flightSeating");
const { response } = require("express");
const { reservations } = require("../test-data/reservations");
const { v4: uuidv4 } = require("uuid");

const handleSeatSelect = (req, res) => {
  res.status(200).json({ text: "hello" });
};

const getSeatMap = (req, res) => {
  const flightNumber = req.params.id;
  const seatDisplay = flights[flightNumber];
  res.status(200).json({ seatDisplay });
};

const newReservation = (req, res) => {
  const resWithId = { ...req.body, id: uuidv4() };
  reservations.push(resWithId);
  res.status(200).json(resWithId.id);
};

const getReservations = (req, res) => {
  let id = req.params.id;
  let reservation = reservations.find((reservation) => {
    return reservation.id === id;
  });
  res.status(200).send(reservation);
};

const getResByEmail = (req, res) => {
  let email = req.params.email;
  let reservation = reservations.find((reservation) => {
    return reservation.email === email;
  });

  res.status(200).send(reservation);
};

const getFlights = (req, res) => {
  res.status(200).json(Object.keys(flights));
};

module.exports = {
  handleSeatSelect,
  newReservation,
  getReservations,
  getSeatMap,
  getResByEmail,
  getFlights,
};
