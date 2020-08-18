const http = require('http')

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
    "number": "07380870505",
    "id": 5
    }
]

const app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json'})
    res.end(JSON.stringify(persons))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)