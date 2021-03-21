const express = require('express')
var morgan = require('morgan')
var uuid = require('uuid')

morgan.token('body', function getBody(req) {
    return req.method === 'POST' ? JSON.stringify(req.body) : ""
})

const app = express()

app.use(express.json())
app.use(assignId)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [{
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Pere Manresa",
        number: "040-21"
    },
    {
        id: 3,
        name: "Jaume Manresa",
        number: "040-12"
    },
    {
        id: 4,
        name: "Sheli Efimova",
        number: "040"
    }
]

app.get("/", (req, res) => {
    res.send("<h1>I'm a teapot!</h1>")
})

app.get("/info", (req, res) => {
    res.send(`<div><p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p></div>`)
})

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    const nameExists = persons.some(person => person.name === body.name)
    if (nameExists) {
        return response.status(400).json({
            error: `name ${body.name} already exists`
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        date: new Date(),
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


const generateId = () => {
    min = Math.ceil(0);
    max = Math.floor(99999);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function assignId(req, res, next) {
    req.id = uuid.v4()
    next()
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})