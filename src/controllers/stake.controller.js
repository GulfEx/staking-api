const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { stakeService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  console.log('req.body');
  console.log(req.body);
  stakeService.createUser(req.body).then((user) => {
    console.log('user');
    console.log(user);
    res.status(httpStatus.CREATED).send(user);
  }).catch((err) => {
    console.log('err');
    console.log(err);
    res.status(httpStatus.NOT_FOUND).send(err.message);
  });
});

const getStakingAll = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await stakeService.queryStaking(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  console.log(req.body)
  const user = await stakeService.getStakingByEmail(req.body.email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await stakeService.updateStakeById(req.params.id, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await stakeService.deleteStakeById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getStakingAll,
  getUser,
  updateUser,
  deleteUser,
};
