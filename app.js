const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookingDB';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true, match: /^[0-9]{10}$/ },
  flight: { type: String, required: true },
  departureDate: { type: Date, required: true },
  passengers: { type: Number, required: true, min: 1, max: 10 }
});

const Booking = mongoose.model('Booking', bookingSchema);

app.post('/api/bookings', (req, res) => {
  const booking = new Booking(req.body);
  booking.save()
    .then(savedBooking => res.status(200).send(savedBooking))
    .catch(err => res.status(500).send({ error: err.message }));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
