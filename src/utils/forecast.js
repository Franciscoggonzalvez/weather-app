const request = require ('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=0f33f408e48071fbd2a607a31b9b9502&query='+latitude+','+longitude

    request({url, json: true}, (error, {body}) => {// json:true-> Parsea automaticamente la respuesta //el segundo argumento de request es nuestro callback
        if (error) {
            callback('Unable to connect to weather service!', undefined) //devolvemos en el callback el error, el segundo argumento es undefined
        } else if (body.error){
            callback('Unable to find location')
        } else {
            //el callback tiene como primer argumento el error undefined
            callback (undefined, body.current.weather_descriptions[0] + '. It is currently '+ body.current.temperature + ' degrees out. It feels like '+ body.current.feelslike +' degress out.')
        }
    })

}

module.exports = forecast