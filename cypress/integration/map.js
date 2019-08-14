let version = '1.68.3'
let agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
let sid = 'jwa97glli6ngawphql2dw2dg4eqgtqer'

let newPoint = {
    "type": "Feature",
    "id": 4,
    "geometry": {
        "type": "Point",
        "coordinates": [
            0.0,
            0.0
        ]
    },
    "properties": {
        "description": "shop",
        "iconCaption": "Shop",
        "marker-color": "#ffffff"
    }
}

it('draw the map', () => {
  //  Cypress.Errors.onUncaughtException(false)
    let i = 0
    for (i = 0; i < 1000; i++) {
        cy.readFile('cypress/fixtures/example.json').then(mapdata => {

            cy.getShops(sid, version, agent)
                .then(response => {
                    response.body.result.forEach(shop => {
                        newPoint.type = 'Feature'
                        newPoint.id = shop.uuid
                        newPoint.geometry.type = 'Point'
                        newPoint.geometry.coordinates[0] = shop.location[1]
                        newPoint.geometry.coordinates[1] = shop.location[0]
                        newPoint.properties.description = shop.name + ' --lvl= ' + shop.level
                        newPoint.properties.iconCaption = newPoint.properties.description
                        newPoint.properties["marker-color"] = '#0000ff'

                        mapdata.features.push(newPoint)
                    })

                })

            cy.wait(1000)

            cy.getBoss(sid, version, agent)
                .then(response => {
                    response.body.result.forEach(boss => {
                        newPoint.type = 'Feature'
                        newPoint.id = boss.uuid
                        newPoint.geometry.type = 'Point'
                        newPoint.geometry.coordinates[0] = boss.location[1]
                        newPoint.geometry.coordinates[1] = boss.location[0]
                        newPoint.properties.description = boss.name + ' --lvl= ' + boss.level
                        newPoint.properties.iconCaption = newPoint.properties.description
                        newPoint.properties["marker-color"] = '#ff0000'

                        mapdata.features.push(newPoint)
                    })
                })
            cy.writeFile('cypress/fixtures/example.json', mapdata)
            cy.wait(5000)
        })
    }
})