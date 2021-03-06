const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require ('./utils/forecast')
const reversegeocode = require('./utils/reversegeocode')
//import 'bulma/css/bulma.css'

// // console.log(__dirname) //path al directorio
// // console.log(__filename) //path al archivo
// console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000

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
        title: 'Weather',
        name: 'Francisco G. Gonzálvez'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Francisco G. Gonzálvez'
    } )
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Francisco G. Gonzálvez'
    })
})

app.get('/weather', (req, res) => {

    if(!req.query.address && !req.query.currentlocation) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    
    if(req.query.currentlocation) {
        var location = req.query.currentlocation
        const latitude = location.split('%')[0]
        const longitude = location.split('%')[1]
        console.log(longitude+ 'en query ' + latitude)
        forecast (latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({error})
            }

            reversegeocode(longitude, latitude, (error, {location}) => {
                if(error) {
                    return res.send({error})
                }

                    return res.send({
                    forecast: forecastData,
                    location : location,
                    //address: forecastData 
                })
            })   

        })
    
    }
    //

    if(req.query.address) {
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
    }

})
//req.query permite ver qué parametros pasamos en la url
app.get('/products', (req, res) => {
    if(!req.query.search){ //si no hay parámetros en la url 
        return res.send({
            error: 'You must provide a search'
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
        errorMessage: 'Help not found'
    })
})

app.get('*', (req, res) =>{
    res.render('404', {
        title: '404',
        name: 'Francisco G.Gonzálvez',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server está activo en el puerto '+port)
})

