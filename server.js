"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const {
  handleSeatSelect,
  getConfirmationPage,
  newReservation,
  getReservations,
  getSeatMap,
  getFlights,
} = require("./public/handlers");

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/seat-select", handleSeatSelect)
  .get("/flights/:id", getSeatMap)
  .get("/flightList", getFlights)
  .post("/reservations", newReservation)
  .get("/reservations/:id", getReservations)

  .use((req, res) => res.send("Not Found"))
  .listen(8000, () => console.log(`Listening on port 8000`));
