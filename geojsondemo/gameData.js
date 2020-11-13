const gameArea = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            12.560462951660156,
            55.79269287414265
          ],
          [
            12.562179565429688,
            55.782848006688226
          ],
          [
            12.57908821105957,
            55.78260667967944
          ],
          [
            12.580461502075195,
            55.78888069614341
          ],
          [
            12.571020126342772,
            55.79578094732261
          ],
          [
            12.560462951660156,
            55.79269287414265
          ]
        ]
      ]
    }
  }
   
   
   
  const players =
    [
      {
        "type": "Feature",
        "properties": {
          "name": "John-outstide"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            12.561149597167969,
            55.79563619936199
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "name": "Tine-outstide"
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            12.55436897277832,
            55.78902546921169
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Jan-outstide" },
        "geometry": {
          "type": "Point",
          "coordinates": [
            12.567758560180664,
            55.79196907157191
          ]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Ida-outstide" },
        "geometry": {
          "type": "Point",
          "coordinates": [
            12.570934295654297,
            55.78690207695228
          ]
        }
      }]
   
  module.exports = {
    gameArea,
    players
  }
  
  