import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Movie',
    },
    showDateTime: {
      type: Date,
      required: true,
    },
    showPrice: {
      type: Number,
      required: true,
    },
    occupiedSeats: {
      type: Object,
      default: {},
    },
  },
  { minimise: false }
);

const Show = mongoose.model('Show', showSchema);
export { Show };
