import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import Quote from "./../models/quoteModel.js";
import Customer from "../models/customerModel.js";
import Mosaic from "./../models/mosaicModel.js";
import Flatwork from './../models/flatworkModel.js';
import Fireplace from './../models/fireplaceModel.js';

const getAll = catchAsync(async (req, res, next) => {
  const filter = {};
  const quotes = await Quote.find().populate([
    { path: "customer" },
    { path: "product", model: "Flatwork" },
    { path: "product", model: "Mosaic" },
    { path: "product", model: "Fireplace" },
  ]);

  // const quotes = await Quote.find()
  //   .populate({
  //     path: "customer",
  //   })
  //   .populate({
  //     path: "product",
  //     model: "Fireplace",
  //   })
  //   .populate({
  //     path: "product",
  //     model: "Flatwork",
  //   })
  //   .populate({
  //     path: "product",
  //     model: "Moulding",
  //   })
  //   .populate({
  //     path: "product",
  //     model: "Mosaic",
  //   });

  res.status(200).json({
    status: "success",
    results: quotes.length,
    data: {
      quotes: quotes,
    },
  });
});

const addQuote = catchAsync(async (req, res, next) => {
  console.log(req.body);
  let productTypeDb;
  let productIdDb;
  let pricingDetailsDb;
  const { customer, productType } = req.body;
  let customerDoc = await Customer.findOne({ customer: customer });

  if (!customerDoc) {
     customerDoc = await Customer.create({
       customer,
       createdBy: req.user.id,
     });
  }

  if (productType === "mosaic") {
    const { color, stone, group, type } = req.body;
    const mosaicFilter = {
      color,
      stone,
      group,
      type,
    };
    const mosaic = await Mosaic.findOne(mosaicFilter);
    if (!mosaic) {
      return next(
        new AppError("No mosaic found with the specified filters", 404)
      );
    }
    productTypeDb = "mosaic";
    productIdDb = mosaic._id;
    pricingDetailsDb = {
      estimatedSquareFootage: req.body.estimatedSquareFootage,
      perSquareFootage: req.body.perSquareFootage,
      perSheetPrice: req.body.perSheetPrice,
      totalSalesPrice: req.body.totalSalesPrice,
      dilsXSqft: req.body.dilsXSqft,
      dilsXPiece: req.body.dilsXPiece,
      totalDilsCost: req.body.totalDilsCost,
      dilsGrossMargin: req.body.dilsGrossMargin,
    };
    // console.log(mosaic);
  }
  else if(productType === "flatwork"){
    const { color, stone, finishedGroup, thickness, size } =
      req.body;
    const flatworkFilter = {
      color,
      stone,
      finishedGroup,
      thickness,
      size,
    };
    const flatwork = await Flatwork.findOne(flatworkFilter);
    console.log(flatworkFilter);
    if (!flatwork) {
      return next(
        new AppError("No flatwork found with the specified filters", 404)
      );
    }
    productTypeDb = "flatwork";
    productIdDb = flatwork._id;
    pricingDetailsDb = {
      estimatedSquareFootage: req.body.estimateFT,
      basePrice: req.body.basePrice,
      costPrice: req.body.costPrice,
      perSheetPrice: req.body.perSheetPrice,
      totalSalesPrice: req.body.totalSalesPrice,
      dilsXPiece: req.body.dilsXPiece,
      totalDilsCost: req.body.totalDilsCost,
      grossMargin: req.body.dilsGrossMargin,
    };
  }
  else if(productType === "fireplace"){
    const { groupType, materialType, color, size } =
      req.body;
    const fireplaceFilter = {
      color,
      materialType,
      groupType,
      size,
    };
    const fireplace = await Fireplace.findOne(fireplaceFilter);
    console.log(fireplaceFilter);
    if (!fireplace) {
      return next(
        new AppError("No fireplace found with the specified filters", 404)
      );
    }

    productTypeDb = "fireplace";
    productIdDb = fireplace._id;
    pricingDetailsDb = {
      total:req.body.total,
      amount: req.body.amount,
    };
  }
  
  else {
    return next(
      new AppError(`Product with name ${productType} don't exist`, 404)
    );
  }
  console.log(productIdDb);

  const newQuote = await Quote.create({
    customer: customerDoc._id,
    productType: productTypeDb,
    product: productIdDb,
    pricingDetails: pricingDetailsDb,
    finalize: req.body.finalize || false,
  });

  res.status(200).json({
    status: "success",
    data: {
      newQuote,
    },
  });
});

const get = catchAsync(async (req, res, next) => {});

const update = catchAsync(async (req, res, next) => {
  let { customer, productType } = req.body;
  let updatedQuote;
  let pricingDetailsdB;
  let productdB;
  console.log(req.body);
  // Update customer if provided
  if (customer) {
    const updatedCustomer = await Customer.findOne({ customer: customer });
    // console.log(updatedCustomer);
    if (!updatedCustomer) {
      return next(
        new AppError("Customer not found with the specified name", 404)
      );
    }
    req.body.customer = updatedCustomer._id;
  }

  if (productType === "mosaic") {
    const quote = await Quote.findById(req.params.id).populate({
      path: "product",
      model: "Mosaic",
    });
    // console.log(quote.product);
    let { type, color, stone, group } = req.body;
    type = type || quote.product.type;
    color = color || quote.product.color;
    stone = stone || quote.product.stone;
    group = group || quote.product.group;
    const mosaicFilter = {
      color,
      stone,
      group,
      type,
    };
    console.log(mosaicFilter);
    const mosaic = await Mosaic.findOne(mosaicFilter);
    if (!mosaic) {
      return next(
        new AppError("No mosaic found with the specified filters", 404)
      );
    }

    pricingDetailsdB = { ...quote.pricingDetails };

    pricingDetailsdB.estimatedSquareFootage =
      req.body.estimatedSquareFootage ||
      pricingDetailsdB.estimatedSquareFootage;
    pricingDetailsdB.perSquareFootage =
      req.body.perSquareFootage || pricingDetailsdB.estimatedSquareFootage;
    pricingDetailsdB.perSheetPrice =
      req.body.perSheetPrice || pricingDetailsdB.perSheetPrice;
    pricingDetailsdB.totalSalesPrice =
      req.body.totalSalesPrice || pricingDetailsdB.totalSalesPrice;
    pricingDetailsdB.dilsXSqft =
      req.body.dilsXSqft || pricingDetailsdB.dilsXSqft;
    pricingDetailsdB.dilsXPiece =
      req.body.dilsXPiece || pricingDetailsdB.dilsXPiece;
    pricingDetailsdB.totalDilsCost =
      req.body.totalDilsCost || pricingDetailsdB.totalDilsCost;
    pricingDetailsdB.dilsGrossMargin =
      req.body.dilsGrossMargin || pricingDetailsdB.dilsGrossMargin;

    // console.log(pricingDetailsdB);
    updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      {
        product: mosaic,
        customer: req.body.customer || quote.customer,
        pricingDetails: pricingDetailsdB,
        finalize: req.body.finalize || quote.finalize,
      },
      { new: true }
    );
  }

  console.log(updatedQuote);
  res.status(200).json({
    status: "success",
    data: {
      updatedQuote,
    },
  });
});

const deleteQuote = catchAsync(async (req, res, next) => {
  const quote = await Quote.findByIdAndDelete(req.params.id);
  if (!quote) {
    return next(new AppError("No quote found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export default {
  addQuote,
  getAll,
  get,
  update,
  deleteQuote,
};
