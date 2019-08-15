let version = Cypress.env('version')
let agent = Cypress.env('agent')
let sid = Cypress.env('sid')

var Realm = require('realm')

/*let geoSchema = {
    "type": "FeatureCollection",
    "features": []
}*/

let pointSchema = {
    name: 'mapPoint',
    primaryKey: 'id',
    properties:
    {
        type: { type: 'string', default: "Feature" },
        id: 'string',
        geometry: {
            type: { type: 'string', default: "Point" },
            coordinates: [
                'float',
                'float'
            ]
        },
        properties: {
            description: 'string',
            iconCaption: 'string',
            [marker - color]: 'string'
        }
    }
}

Realm.open({ schema: [pointSchema] }).then(realm => {

    let i = 0
    for (i = 0; i < 1000; i++) {
        it('draw the map iteration', () => {


            cy.getShops(sid, version, agent)
                .then(response => {
                    response.body.result.forEach(shop => {
                        /*newPoint.type = 'Feature'
                        newPoint.id = shop.uuid
                        newPoint.geometry.type = 'Point'
                        newPoint.geometry.coordinates[0] = shop.location[1]
                        newPoint.geometry.coordinates[1] = shop.location[0]
                        newPoint.properties.description = shop.name + ' --lvl= ' + shop.level
                        newPoint.properties.iconCaption = newPoint.properties.description
                        newPoint.properties["marker-color"] = '#0000ff'

                        mapdata.features.push(newPoint)*/
                        try {
                            realm.write(() => {
                                realm.create('mapPoint', {
                                    type: 'Feature',
                                    id: shop.uuid,
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [
                                            shop.location[1],
                                            shop.location[0]
                                        ]
                                    },
                                    properties: {
                                        description: shop.name + ' --lvl=' + shop.level,
                                        iconCaption: 'Shop',
                                        [marker - color]: '#0000ff'
                                    }
                                })
                            })
                        } catch (e) {
                            console.log("Error on creation")
                        }
                    })
                })

            cy.wait(1000)

            cy.getBoss(sid, version, agent)
                .then(response => {
                    response.body.result.forEach(boss => {
                        try {
                            realm.write(() => {
                                realm.create('mapPoint', {
                                    type: 'Feature',
                                    id: boss.uuid,
                                    geometry: {
                                        type: 'Point',
                                        coordinates: [
                                            boss.location[1],
                                            boss.location[0]
                                        ]
                                    },
                                    properties: {
                                        description: boss.name + ' --lvl=' + boss.level,
                                        iconCaption: 'Boss',
                                        [marker - color]: '#ff0000'
                                    }
                                })
                            })
                        } catch (e) {
                            console.log("Error on creation");
                        }
                    })
                })
        })
        cy.wait(5000)
    }
})