const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(__dirname + '/dist/type-racer'))

app.get('/*', (rqe, res) => {
	res.sendFile(path.join(__dirname + '/dist/type-racer/index.html'))
})

app.listen(process.env.PORT || 3000)