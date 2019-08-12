let version = '1.68.3'
let agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
let sid = 'jwa97glli6ngawphql2dw2dg4eqgtqer'

it('draw the map', () => {
let i = 0
    for (i = 0; i < 50000; i++) {
        cy.getShops(sid, version, agent)
            .then(response => {
                response.body.result.forEach(shop => {
                    cy.writeFile('cypress/fixtures/mapdata.csv', shop.location[0] + ',' + shop.location[1] + ',' + shop.name + shop.level +'\n', { flag: 'a+' })
                })
            })

        cy.wait(1000)

        cy.getBoss(sid, version, agent)
            .then(response => {
                response.body.result.forEach(boss => {
                    cy.writeFile('cypress/fixtures/mapdata.csv', boss.location[0] + ',' + boss.location[1] + ',' + boss.name + boss.level +'\n', { flag: 'a+' })
                })
            })

        cy.wait(5000)
    }

})