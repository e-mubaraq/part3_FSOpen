require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


morgan.token('body', req => {
  if (req.method !== 'POST' && req.method !== 'PUT')
    return ('')
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/info', (req, res) => {
  const d = new Date()
  res.send(
    `<div>
        <p>Phonebook has info for ${Person.length} people</p>
        <p>${d}</p>
    </div>`
  )
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    }
    else{
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name missing'
    })
  }

  const person = Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => res.json(savedAndFormattedPerson))
    .catch(error => next(error))
})
//const opts = { runValidators: true }
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => updatedPerson.toJSON())
    .then(updatedAndFormattedPerson => res.json(updatedAndFormattedPerson))
    .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformated id' })
  }
  else if (error.name === 'ValidationError') {
    //return res.status(400).json({ error: error.message })
    return res.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
