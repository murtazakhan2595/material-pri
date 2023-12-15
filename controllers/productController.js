// import Flatwork from "../models/flatworkModel.js";
// import AppError from "../utils/appError.js";
// import catchAsync from "../utils/catchAsync.js";
// import Mosaic from "./../models/mosaicModel.js";
// import Fireplace from "../models/fireplaceModel.js";
const Flatwork = require("../models/flatworkModel.js");
const AppError = require("../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const Mosaic = require("./../models/mosaicModel.js");
const Fireplace = require("../models/fireplaceModel.js");


const getAll = catchAsync(async (req, res, next) => {

  const filter = {};
  const mosaic = await Mosaic.find(filter);
  const flatwork = await Flatwork.find(filter);
  const fireplace = await Fireplace.find(filter);

  const product = { mosaic, flatwork, fireplace };
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: mosaic.length + flatwork.length + fireplace.length,
    data: {
      products: product,
    },
  });
});

const addProduct = catchAsync(async (req, res, next) => {
  const { productType } = req.params;
  console.log(req.params,req.body)
  let newProduct;
  if (productType === "mosaic") {
    newProduct = await Mosaic.create(req.body);
  }
  else if(productType ==="flatwork"){
    newProduct = await Flatwork.create(req.body);
  }
  else if(productType==="fireplace"){
    newProduct = await Fireplace.create(req.body);
  }
  else {
    return next(
      new AppError(`Product with name ${productType} don't exist`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      newProduct,
    },
  });
});

const get = catchAsync(async (req, res, next) => {
  let data={};
  // Extract filters from query parameters
  const {productType} = req.params;
  // Define a filter object based on provided parameters
  const filters = {};
  if(productType === "flatwork"){
    const perSheetSize=2;
    const { color, stone, finishedGroup, thickness, size, estimateFT } =
      req.body;
    if (color) filters.color = color;
    if (stone) filters.stone = stone;
    if (finishedGroup) filters.finishedGroup = finishedGroup;
    if (thickness) filters.thickness = thickness;
    filters.size = "16x24";
    // Use the filters to query your database or perform any necessary actions
    const flatwork = await Flatwork.find(filters);
    let [length,width]=size.split('x');
    const customSize=(length*width/384)

    data.flatwork = flatwork;
    data.totalSalePrice = flatwork[0].basePrice * estimateFT * customSize;
    
    
    data.customBasePrice = flatwork[0].basePrice  * customSize;
    data.customBaseCost = flatwork[0].baseCost  * customSize;
    
    data.persheetSalePrice = flatwork[0].basePrice * perSheetSize * customSize;
    data.totalCostPrice = flatwork[0].baseCost * estimateFT * customSize;
    data.persheetCostPrice = flatwork[0].baseCost * perSheetSize * customSize;
    data.grossMargin =
    ((data.totalCostPrice - data.totalSalePrice) / data.totalCostPrice) * 100;
    console.log(flatwork,customSize,data)
  }
  else if(productType=== "fireplace"){
    const {amount,groupType,size,color,materialType}= req.body;
    if (color) filters.color = color;
    if (groupType) filters.groupType = groupType;
    if (materialType) filters.materialType = materialType;
    if (size) filters.size = size;

    const fireplace = await Fireplace.find(filters);
    data.fireplace=fireplace;
    // console.log(amount,fireplace[0].basePrice)
    data.total= amount * fireplace[0].basePrice;
  }

    // Respond with the filtered data
  res.status(200).json({
    status: "success",
    data
  });
});

const update = catchAsync(async (req, res, next) => {
  let updateProduct;
  const { productType } = req.params;
  if (productType === "mosaic") {
    updateProduct = await Mosaic.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
  } else {
    return next(
      new AppError(`Product with name ${productType} don't exist`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      updateProduct,
    },
  });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { productType } = req.params;
  if (productType === "mosaic") {
    const mosaic = await Mosaic.findByIdAndDelete(req.params.id);
    if (!mosaic) {
      return next(new AppError("No mosaic found with that ID", 404));
    }
  } else {
    return next(
      new AppError(`Product with name ${productType} don't exist`, 404)
    );
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// export default {
//   addProduct,
//   getAll,
//   get,
//   update,
//   deleteProduct,
// };
module.exports = {
  addProduct,
  getAll,
  get,
  update,
  deleteProduct,
};
