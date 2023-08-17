import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    year: { type: String, required: [true, "Missing year field on car"] },
    make: { type: String, required: [true, "Missing make field on car"] },
    model: { type: String, required: [true, "Missing model field on car"] },
    class_type: {
      type: String,
      required: [true, "Missing class field on car"],
    },
    fuel_type: {
      type: String,
      required: [true, "Missing fuel type field on car"],
    },
    price: { type: Number, required: [true, "Missing price field on car"] },
    paint: { type: String, required: [true, "Missing paint field on car"] },
    image: { type: String, required: [true, "Missing image field on car"] },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
