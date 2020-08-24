const mongoose = require('mongoose')
const sz = process.argv.length
if (sz < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.3zjm1.mongodb.net/phonebook?retryWrites=true`


// mongodb+srv://fullstack:<password>@cluster0.3zjm1.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})

if (sz === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(pers => {
      console.log(`${pers.name} ${pers.number}`)
    })
    mongoose.connection.close()
  })
}

if (sz > 3) {
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
