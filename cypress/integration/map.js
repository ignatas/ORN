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

/*
POST https://playorna.com/api/chest/?x=1566160279677 HTTP/1.1
Host: playorna.com
Content-Type: application/x-www-form-urlencoded
Origin: null
Accept-Encoding: br, gzip, deflate
Connection: keep-alive
X-ORNA-SID: jwa97glli6ngawphql2dw2dg4eqgtqer
Accept: application/json, text/plain, 
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148
Content-Length: 41
Cache-Control: no-cache
Accept-Language: ru

uuid=2aa7c464-8808-4886-b589-fb491cdc2921
*/