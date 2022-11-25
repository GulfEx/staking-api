const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const stakeSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    stakes: [
      new mongoose.Schema({
        amount: {
          type: Number,
          required: true
        },
        is_active: {
          type: Boolean,
          default: true,
        },
        staked_date: {
          type: Date,
          default: Date.now,
        },
        unstaked_date: {
          type: Date
        },
        unclaimed_rewards: {
          type: Number,
          default: 0,
        }
      })
    ]
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
stakeSchema.plugin(toJSON);
stakeSchema.plugin(paginate);

/**
 * @typedef Stake
 */
const Stake = mongoose.model('Stake', stakeSchema);

module.exports = Stake;
