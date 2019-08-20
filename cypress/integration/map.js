let version = Cypress.env('version')
let agent = Cypress.env('agent')
let sid = Cypress.env('sid')

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
            marker: 'string'
        }
    }
}

describe('map builder', () => {

    let i = 0
    for (i = 0; i < 350; i++) {
        it('draw the map iteration #'+i, () => {
            cy.getShops(sid, version, agent)
                .then(response => {
                    cy.readFile('cypress/fixtures/shops.csv').then(points => {
                        response.body.result.forEach(element => {
                            let point = element.location[0] + ',' + element.location[1] + ',' + element.uuid + ',' + element.name + ' lvl' + element.level + '\n'
                            if (!points.includes(point)) {
                                cy.writeFile('cypress/fixtures/shops.csv', point, { flag: 'a+' })
                            }
                        })
                    })
                })

            cy.wait(500)

            cy.getBoss(sid, version, agent)
                .then(response => {
                    cy.readFile('cypress/fixtures/bosses.csv').then(points => {
                        response.body.result.forEach(element => {
                            let point = element.location[0] + ',' + element.location[1] + ',' + element.uuid + ',' + element.name + ' lvl' + element.level + '\n'
                            if (!points.includes(point)) {
                                cy.writeFile('cypress/fixtures/bosses.csv', point, { flag: 'a+' })
                            }
                        })
                    })
                })
            cy.wait(5000)
        })
        // cy.wait(5000)
    }

})