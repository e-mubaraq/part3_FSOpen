const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true , useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })
const runValidatorsPlugin = function(schema) {
  schema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true
    next()
  })
}
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true,
    required:true
  },
  number: {
    type: String,
    minlength: 8,
    required: true
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator)
personSchema.plugin(runValidatorsPlugin)
module.exports = mongoose.model('Person', personSchema)

