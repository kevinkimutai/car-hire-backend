import { DEVELOPMENT_URL, PRODUCTION_URL } from "../constants/constants.js";
import { stripePkg } from "../index.js";
import Car from "../model/car.js";
import Hire from "../model/hire.js";
import User from "../model/user.js";
import { catchAsync } from "../utils/catchAsync.js";
import { calculateDaysBetweenDates } from "../utils/getNumberOfDays.js";
import { AppError } from "../utils/globalAppError.js";

export const CREATEHIRE = catchAsync(async (req, res, next) => {
  const { personalDetails, deliveryDate, carOrderDetails, totalPrice } =
    req.body;
  const { id } = req.user;

  if (!personalDetails || !deliveryDate || !carOrderDetails) {
    return next(new AppError("Missing hire details", 400));
  }

  const { phone_number, dl_number, id_number } = personalDetails;

  if (!phone_number || !dl_number || !id_number) {
    return next(new AppError("Missing personal_details fields", 400));
  }

  //save personal details to user model
  const user = await User.findById(id);

  user.phone_number = phone_number;
  user.dl_number = dl_number;
  user.id_number = id_number;

  await user.save();

  // const {
  //   year,
  //   make,
  //   model,
  //   fuel_type,
  //   price,
  //   paint,
  //   class: class_type,
  // } = carOrderDetails;

  // if (!year || !make || !model || !paint) {
  //   return next(new AppError("Missing carDetails fields", 400));
  // }

  // let newCar;

  // const existingCar = await Car.findOne({
  //   year,
  //   make,
  //   model,
  //   fuel_type,
  //   price,
  //   paint,
  //   class_type,
  // });

  // if (!existingCar) {
  //   newCar = await Car.create({
  //     year,
  //     make,
  //     model,
  //     fuel_type,
  //     price,
  //     paint,
  //     class_type,
  //   });
  // } else {
  //   newCar = existingCar;
  // }

  const createdCars = [];

  for (const carOrderDetail of carOrderDetails) {
    const {
      year,
      make,
      model,
      fuel_type,
      price,
      paint,
      class: class_type,
      image,
    } = carOrderDetail;

    if (!year || !make || !model || !paint) {
      return next(new AppError("Missing carDetails fields", 400));
    }

    const existingCar = await Car.findOne({
      year,
      make,
      model,
      fuel_type,
      price,
      paint,
      class_type,
    });

    let newCar;

    if (!existingCar) {
      newCar = await Car.create({
        year,
        make,
        model,
        fuel_type,
        price,
        paint,
        class_type,
        image,
      });
    } else {
      newCar = existingCar;
    }

    createdCars.push(newCar._id);
  }

  console.log("CREATED", createdCars);

  const { startDate, endDate } = deliveryDate;

  if (!startDate || !endDate) {
    return next(new AppError("Missing Delivery Dates Fields", 400));
  }

  const hire = await Hire.create({
    user: id,
    cars: createdCars,
    hire_dates: { start_date: startDate, end_date: endDate },
    total_price: totalPrice,
  });

  req.hire = { id: hire._id };

  next();
});

export const CHECKOUTSESSION = catchAsync(async (req, res, next) => {
  //get gift
  const hire = await Hire.findById(req.hire.id);
  const user = await User.findById(req.user.id);

  const numberOfDaysHired = calculateDaysBetweenDates(
    hire.hire_dates.start_date,
    hire.hire_dates.end_date
  );

  const hireData = hire.cars.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: `${item.make} ${item.model}`, // Use item.gift instead of gift
        description: `${item.make} ${item.model} ${item.year} ${item.paint}`,
        images: [item.image],
      },
      unit_amount: +item.price * 100,
    },
    quantity: numberOfDaysHired,
  }));

  console.log("HIREDATA", hireData);

  //TODO:CREATE F/E  SUCCESS AND CANCEL URLS
  const session = await stripePkg.checkout.sessions.create({
    line_items: hireData,
    success_url: `${
      process.env === "development"
        ? DEVELOPMENT_URL + "/checkout/success"
        : PRODUCTION_URL + "/checkout/success"
    }`,
    cancel_url: ireData,
    success_url: `${
      process.env === "development"
        ? DEVELOPMENT_URL + "/checkout/fail"
        : PRODUCTION_URL + "/checkout/fail"
    }`,
    customer_email: user.email,
    client_reference_id: req.user.id,
    payment_method_types: ["card"],
    mode: "payment",
  });

  res.status(200).json({ status: "success", redirectUrl: session.url });
});
