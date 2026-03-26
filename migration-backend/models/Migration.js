const mongoose = require("mongoose");

const migrationSchema = new mongoose.Schema({
  name: String,   //updated
  version: String,

  up: Object,
  down: Object,

  status: {
    type: String,
    default: "pending"
  },

  logs: {
    type: [String],
    default: []
  },

  gitCommitId: String

}, { timestamps: true });

module.exports = mongoose.model("Migration", migrationSchema);