require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', req => {
    if (req.method !== 'POST')
        return ('')
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
    },
    {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
    },
    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
    },
    {
    "name": "Mubarak Mikail",
    "number": "0738087050",
    "id": 5
    }
]

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
    //res.json(persons)
})

app.get('/info', (req, res) => {
    const d = new Date()
    res.send(
    `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${d}</p>
    </div>`
    )
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () =>  Math.floor((Math.random() * 20) + 1)

app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log(body)
    console.log(generateId)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'Name missing'
        })
    }

    if (persons.some(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'Name already exist'
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
