const express = require('express')
const app = express()

app.use(express.json())
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
    res.json(persons)
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
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
