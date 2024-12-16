const express = require('express')
const morgan = require('morgan')

const app = express()
const cors = require('cors')

app.use((express.static('dist')))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info',(request,response) => {
    const now  = new Date()
    response.send(
        `Phonebook has info for ${persons.length} people <br> ${now}`
        )
})

app.get('/api/persons/:id',(request,response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request,response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons',(request,response) => {
    const body = request.body
        if(!body.name || !body.number){
            return response.status(400).json({
                error:'missing name or number'
            })
        }
        if(persons.find(person => person.name === body.name)){
            return response.status(400).json({
                error:'name already exists'
            })
        }

        const person = {
            id : Math.floor(Math.random()*10000000),
            name : body.name,
            number : body.number
        }

        persons = persons.concat(person)
    // console.log(person)
    response.status(201).json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)