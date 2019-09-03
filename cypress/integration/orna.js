import Chance from 'chance'
let version = Cypress.env('version')
let agent = Cypress.env('agent')
let sid = Cypress.env('sid')
let spells = ['Fulmination', 'Fulmination', 'SummonDead', 'SummonDead', 'MultiFlame', 'MultiFrost']


var i;
for (i = 0; i < 100; i++) {
    it('battle # ' + i, () => {
        cy.wait(chance.integer({ min: 2000, max: 2500 }))

        cy.getMonsters(sid, version, agent)
            .then(monsters => {
                monsters.body.result.forEach(monster => {
                    cy.log('___________________________________________')
                    cy.wait(chance.integer({ min: 1100, max: 1500 }))
                    //let monster = Chance().pickone(monsters.body.result.filter(monster => (monster.current_hp <= 2500)))
                    cy.log('[NEW MONSTER =](htttp://e.com)' + monster.name + ' -- hp=' + monster.hp)

                    cy.heal(sid, version, agent)
                    cy.wait(chance.integer({ min: 1000, max: 2000 }))

                    cy.battleCreate(sid, version, agent, monster.uuid)
                        .then(battle => {

                                if (battle.body.success == true) {
                                    cy.battleInitiate(sid, version, agent, battle.body.result.uuid)
                                    cy.wait(chance.integer({ min: 1000, max: 2000 }))
                                    let state = ''
                                    cy.battleSpell(sid, version, agent, battle.body.result.uuid, spells, state)
                                }
                                else {
                                    cy.log('[===> FATAL ERROR ===> the monster is not ready](htttp://e.com)')
                                    cy.wait(chance.integer({ min: 1000, max: 3000 }))
                                }

                        })
                    })
            })
    })
}
