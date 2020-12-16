const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const morgan = require('morgan')

const dataJson = require('./date.json')

dotenv.config()
app.use(cors())
app.use(morgan('dev'))


app.get('/',(req,res) => {
	res.json({
		message : "Alert message api"
	})
})

app.get('/expireDates',(req,res) => {
	res.json(dataJson)
})

let port = process.env.PORT
app.listen(port,() => {
	console.log(`this api server running on port ${port}`)
})