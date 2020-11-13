const express = require('express')
var gju = require('geojson-utils');
const app = express()
app.get('/', (req, res) => res.send('Geo Demo!'))

const players = require("./gameData.js").players
const gameArea = require("./gameData.js").gameArea.geometry

app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.get("/geoapi/isuserinarea/:lon/:lat", (req, res) => {
    const {lon, lat} = req.params;
    const point = {"type":"Point", "coordinates": [lon, lat]};
    const result = gju.pointInPolygon(point,gameArea);
    const txt = result ? "Point was inside the tested polygon" : "Point was not inside the tested polygon"
    const response = {
        "status": result,
        "msg" : txt
    }
    res.send(response)
                 
})