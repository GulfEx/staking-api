const httpStatus = require('http-status');
const axios = require('axios');
const { Stake } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a staking user
 * @param {Object} stakingBody
 * @returns {Promise<Stake>}
 */
const createUser = async (stakingBody) => {
  return new Promise((resolve, reject) => { 
    console.log('stakingBody');
    console.log(stakingBody);
    if (!stakingBody.email) {
      reject(new ApiError(httpStatus.BAD_REQUEST, 'Email is required'));
    }
    if (stakingBody.amount >= 10000) { 
      reject(new ApiError(httpStatus.BAD_REQUEST, 'Amount must be greater than 10000'));
    }
    axios.get('https://dev.gulfex.io/api/v2/user', {
      headers: {
       'Authorization': `Bearer ${stakingBody.token}`
      }
    }).then((result) => {
      console.log(result.data.balance.gulf_available)
      console.log(result.data.balance.gulf_available >= stakingBody.amount)
      if(result.data.balance.gulf_available >= stakingBody.amount) {
        console.log('available balance');
        Stake.create({
          email: result.data.email,
          stakes: [
            {
              amount: stakingBody.amount,
              is_active: true,
              // is_paid: false,
              // is_withdrawn: false,
              // is_expired: false,
              // is_cancelled: false,
              // is_refunded: false,
              // is_rejected: false,
              // is_approved: false,
              // is_pending: true,
              // is_completed: false,
            }
          ]
        }).then((user) => {
          console.log('user');
          console.log(user);
          resolve(user);
        }).catch((err) => {
          console.log('err');
          console.log(err);
          reject(err);
        });
      } else {
        console.log('not available balance');
        reject(new ApiError(httpStatus.NOT_FOUND, 'insufficient balance'));
      }
    }).catch((err) => {
      console.log(err);
      reject(new ApiError(httpStatus.NOT_FOUND, 'api error'));
    });
   });
  //return Stake.create(stakingBody);
};

/**
 * Query for staking
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryStaking = async (filter, options) => {
  const staking = await Stake.paginate(filter, options);
  return staking;
};

/**
 * Get Stake by id
 * @param {ObjectId} id
 * @returns {Promise<Stake>}
 */
const getStakingById = async (id) => {
  return Stake.findById(id);
};

const getStakingByEmail = async (email) => {
  return Stake.findOne({ email });
};

/**
 * Update staking by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Stake>}
 */
const updateStakeById = async (id, updateBody) => {
  const stake = await getStakingById(id);
  if (!stake) {
    throw new ApiError(httpStatus.NOT_FOUND, 'stake not found');
  }
  Object.assign(stake, updateBody);
  await stake.save();
  return stake;
};

/**
 * Delete user by id
 * @param {ObjectId} id
 * @returns {Promise<Stake>}
 */
const deleteStakeById = async (id) => {
  const staake = await getStakingById(id);
  if (!staake) {
    throw new ApiError(httpStatus.NOT_FOUND, 'staake not found');
  }
  await staake.remove();
  return staake;
};

module.exports = {
  createUser,
  queryStaking,
  getStakingById,
  getStakingByEmail,
  getStakingById,
  updateStakeById,
  deleteStakeById,
};
