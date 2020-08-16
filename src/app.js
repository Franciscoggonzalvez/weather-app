const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require ('./utils/forecast')

// // console.log(__dirname) //path al directorio
// // console.log(__filename) //path al archivo
// console.log(path.join(__dirname, '../public'))

const app = express()

//Se configuran los path para Express (__dirname -> proporciona el path del el directorio donde reside el archivo)
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Se establecen los handlebars y las views locations
app.set('view engine', 'hbs') //set('key', 'value') el value es el nombre del modulo
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//toma el path a la carpeta que queremos servir
app.use(express.static(publicDirectoryPath)) 

app.get('',(req, res) => {
    //primer argumento el nombre del archivo hbs y el segundo es un objeto
    res.render('index', {
        title: 'El Tiempo',
        name: 'Francisco G.Gonzálvez'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Sobre mi..',
        name: 'Franciso G. Gonzálvez'
    } )
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Texto de ayuda',
        title: 'Ayuda',
        name: 'Francisco G.Gonzálvez'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'Debes porporcionar una localidad'
        })
    }
    geocode (req.query.address, (error, {latitude, longitude, location} = {}) =>{
        if(error) {
            return res.send({error})
        }

        forecast (latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

})
//req.query permite ver qué parametros pasamos en la url
app.get('/products', (req, res) => {
    if(!req.query.search){ //si no hay parámetros en la url 
        return res.send({
            error: 'Debes proporcionar una búsqueda'
        })

    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})



//app.com
//app.com/help
//app.com/about

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Francisco G.Gonzálvez',
        errorMessage: 'Ayuda no encontrada'
    })
})

app.get('*', (req, res) =>{
    res.render('404', {
        title: '404',
        name: 'Francisco G.Gonzálvez',
        errorMessage: 'Página no encontrada'
    })
})

app.listen(3000, () => {
    console.log('Server está activo en el puerto 3000')
})

