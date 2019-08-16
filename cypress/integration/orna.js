import Chance from 'chance'
let version = Cypress.env('version')
let agent = Cypress.env('agent')
let sid = Cypress.env('sid')
let spells = ['Fulmination', 'SummonDead', 'MagicCuts', 'Arc', 'Fulmination', 'MagicCuts']

it('battle # ', () => {
    var i;
    for (i = 0; i < 5000; i++) {
        cy.wait(chance.integer({ min: 100, max: 1000 }))

        cy.getMonsters(sid, version, agent)
            .then(monsters => {
                let monster = Chance().pickone(monsters.body.result.filter(monster => (monster.current_hp <= 5000)))
                cy.log(monster.name + ' -- hp=' + monster.hp)

                cy.battleCreate(sid, version, agent, monster.uuid)
                    .then(battle => {
                        if (battle.body.success == true) {
                            cy.battleInitiate(sid, version, agent, battle.body.result.uuid)
                            cy.wait(chance.integer({ min: 1000, max: 2000 }))
                            let state = ''
                            cy.battleSpell(sid, version, agent, battle.body.result.uuid, spells, state)
                        }
                        else {
                            cy.log('===> FATAL ERROR ===> the monster is not ready')
                            cy.wait(chance.integer({ min: 2000, max: 10000 }))
                        }
                    })
            })

        cy.wait(chance.integer({ min: 1000, max: 2000 }))
        cy.heal(sid, version, agent)
    }
})