import mongoose from "mongoose";

const hireSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
    hire_dates: {
      start_date: { type: String, required: [true, "Missing Hire start date"] },
      end_date: { type: String, required: [true, "Missing Hire end date"] },
    },
    total_price: { type: Number, required: [true, "Missing total hire price"] },
  },
  { timestamps: true }
);

//pre populate method
hireSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: "user",
  //   select:
  //     "-role -active -resetToken -resetTokenExpires -createdAt -updatedAt",
  // });

  this.populate({
    path: "cars",
    select: "-createdAt -updatedAt",
  });

  next();
});

const Hire = mongoose.model("Hire", hireSchema);

export default Hire;
