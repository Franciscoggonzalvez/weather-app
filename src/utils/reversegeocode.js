const request = require ('request')

const reversegeocode = (longitude, latitude, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+longitude+','+latitude+'.json?access_token=pk.eyJ1IjoiZmdhcmNpYWdvbnphbHZleiIsImEiOiJjanpiZmtqb2kwMGlvM29sbGowbGxpbGJrIn0.ml_K95hDIe-6lOOssnULkQ'
        
    request({url, json: true}, (error, {body})=>{
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, {
               location: body.features[0].place_name 
            })
        }
    })
}

module.exports = reversegeocode