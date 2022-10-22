const mongoose = require("mongoose")

const PatrolSchema = new mongoose.Schema({
	jobs: {
		type: mongoose.SchemaTypes.Number,
		required: false,
	},
	discordID: {
		type: mongoose.SchemaTypes.String,
		required: true,
	},
	guildID: {
		type: mongoose.SchemaTypes.String,
		required: true,
	}
})

module.exports = PatrolSchema