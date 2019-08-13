let version = '1.68.3'
let agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
let sid = 'jwa97glli6ngawphql2dw2dg4eqgtqer'

it('draw the map', () => {

    let i = 0
    for (i = 0; i < 50000; i++) {
        cy.readFile('cypress/fixtures/mapdata.json').then(mapdata => {

            cy.getShops(sid, version, agent)
                .then(response => {
                    response.body.result.forEach(shop => {
                        if (!mapdata.shops.includes(JSON.stringify(shop))) { mapdata.shops.push(shop) }
                    })

                })

            cy.wait(1000)

            cy.getBoss(sid, version, agent)
                .then(response => {
                    response.body.result.forEach(boss => {
                        let position
                        position = mapdata.shops.indexOf(boss)
                        if (!~position) { mapdata.bosses.push(boss) }
                    })
                })
                cy.writeFile('cypress/fixtures/mapdata.json', mapdata)
            cy.wait(5000)
        })
    }
})