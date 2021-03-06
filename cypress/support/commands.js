// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getMonsters', (sid, version, agent) => {
    return cy.request({
        url: 'https://playorna.com/api/monsters/?x=' + Date.now(),
        method: 'GET',
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    }).then(response => { expect(response.status).to.eq(200) })
})

Cypress.Commands.add('battleCreate', (sid, version, agent, monsterId) => {
    let date = Date.now()
    cy.request({
        url: 'https://playorna.com/api/battles/monster/?x=' + date,
        method: 'OPTIONS',
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ORNA-SID': sid
        }
    }).then(response => { expect(response.status).to.eq(204) })
    // the main request for battle creation
    return cy.request({
        url: 'https://playorna.com/api/battles/monster/?x=' + date,
        method: 'POST',
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded', //required !!
            'X-ORNA-SID': sid
        },
        body: 'uuid=' + monsterId
    }).then(response => { expect(response.status).to.eq(200) })
})

Cypress.Commands.add('battleInitiate', (sid, version, agent, battleId) => {
    let date = Date.now()
    cy.request({
        url: 'https://playorna.com/api/battles/monster/?uuid=' + battleId + '&x=' + date,
        method: 'OPTIONS',
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    }).then(response => { expect(response.status).to.eq(204) })
    // the main request for battle initioation, preconditions
    return cy.request({
        url: 'https://playorna.com/api/battles/monster/?uuid=' + battleId + '&x=' + date,
        method: 'GET',
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    }).then(response => { expect(response.status).to.eq(200) })
})

let state = ''
Cypress.Commands.add('battleSpell', (sid, version, agent, battleId, spells, state) => {
    let spell = Chance().pickone(spells)
    cy.request({
        url: 'https://playorna.com/api/battles/monster/turn/?x=' + Date.now(),
        method: 'POST',
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ORNA-SID': sid
        },
        body: 'uuid=' + battleId + '&type=spell&spell_id=' + spell + '&state_id=' + state
    })
        .then(response => {
            expect(response.status).to.eq(200)
            if (response.status >= 400) { cy.log('ERROR=' + response.status) }
            else {
                if (response.body.result.lost == true) {
                    cy.log('[ ' + spell + ' DAMAGE= ' + response.body.damage + ' ] - [ HP=' + response.body.player_hp + ' MANA=' + response.body.player_mana + ' ] - [ monster=' + response.body.monster_hp + ' ]')
                    cy.log('[===> looser](htttp://e.com)')
                    console.log('battle lost')
                    cy.wait(chance.integer({ min: 2000, max: 3000 }))
                    return
                }
                else if (response.body.result.won == true) {
                    cy.log('[ ' + spell + ' DAMAGE= ' + response.body.damage + ' ] - [ HP=' + response.body.player_hp + ' MANA=' + response.body.player_mana + ' ] - [ monster=' + response.body.monster_hp + ' ]')
                    cy.log(response.body.result.gold + '[ gold, and orns=](htttp://e.com)' + response.body.result.orns)
                    return
                }
                else if (response.body.result.lost == false && response.body.result.won == false) {
                    state = response.body.state_id
                    cy.log('[ ' + spell + ' DAMAGE= ' + response.body.damage + ' ] - [ HP=' + response.body.player_hp + ' MANA=' + response.body.player_mana + ' ] - [ monster=' + response.body.monster_hp + ' ]')
                    cy.wait(chance.integer({ min: 555, max: 777 }))
                    cy.battleSpell(sid, version, agent, battleId, spells, state)
                    return
                }
            }
        })
})

let raidstate = ''
let dd = Cypress.env('raidBattle') + '&type=spell&spell_id=SummonDead&state_id='
let healAll = Cypress.env('raidBattle') + '&type=item&item_uuid=fe151a51-9ea3-4f36-85c0-1e7347d7bd29&item_id=292ddeaa-8b22-4753-8c0f-2f2dc6ff8daf&grouped=true&state_id='

Cypress.Commands.add('raid', (sid, version, agent, bodystate, raidstate) => {

    cy.request({
        url: 'https://playorna.com/api/battles/raid/turn/?x=' + Date.now(),
        method: 'OPTIONS',
        failOnStatusCode: false,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    }).then(response => { expect(response.status).to.eq(204) })

    cy.request({
        url: 'https://playorna.com/api/battles/raid/turn/?x=' + Date.now(),
        method: 'POST',
        failOnStatusCode: false,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ORNA-SID': sid
        },
        body: bodystate + raidstate
    })
        .then(response => {
            expect(response.status).to.eq(200)
            if (response.status >= 400) { cy.log('ERROR=' + response.status) }
            else {
                if (response.body.result.lost == true) {
                    //cy.log('[ ' + spell + ' DAMAGE= ' + response.body.damage + ' ] - [ HP=' + response.body.player_hp + ' MANA=' + response.body.player_mana + ' ] - [ monster=' + response.body.monster_hp + ' ]')
                    cy.log('[===> looser](htttp://e.com)')
                    //console.log('battle lost')
                    //cy.wait(chance.integer({ min: 2000, max: 3000 }))
                    return
                }

                else if (response.body.result.won == true) {
                    //cy.log('[ ' + spell + ' DAMAGE= ' + response.body.damage + ' ] - [ HP=' + response.body.player_hp + ' MANA=' + response.body.player_mana + ' ] - [ monster=' + response.body.monster_hp + ' ]')
                    //cy.log(response.body.result.gold + '[ gold, and orns=](htttp://e.com)' + response.body.result.orns)
                    cy.log('[===> winner](htttp://e.com)')
                    return
                }
                else if (response.body.result.lost == false && response.body.result.won == false) {
                    raidstate = response.body.state_id
                    cy.log(' DAMAGE= ' + response.body.damage + ' ] - [ HP=' + response.body.player_hp + ' MANA=' + response.body.player_mana + ' ] - [ monster=' + response.body.monster_hp + ' ]')

                    if (response.body.player_mana <= 100 || response.body.player_hp <= 1000) {
                        cy.wait(chance.integer({ min: 1500, max: 3000 }))
                        cy.raid(sid, version, agent, healAll, raidstate)
                        cy.wait(chance.integer({ min: 1000, max: 2000 }))
                        return

                    } else {
                        cy.wait(chance.integer({ min: 1300, max: 1600 }))
                        cy.raid(sid, version, agent, dd, raidstate)
                        return
                    }
                }
            }
        })
})


Cypress.Commands.add('heal', (sid, version, agent) => {
    return cy.request({
        url: 'https://playorna.com/api/me/?x=' + Date.now(),
        method: 'POST',
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ORNA-SID': sid
        },
        body: 'action=autoheal'
    }).then(response => { expect(response.status).to.eq(200) })
})

Cypress.Commands.add('getShops', (sid, version, agent) => {
    return cy.request({
        url: 'https://playorna.com/api/shops/?x=' + Date.now(),
        method: 'GET',
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    }).then(response => { expect(response.status).to.eq(200) })
})

Cypress.Commands.add('getBoss', (sid, version, agent) => {
    return cy.request({
        url: 'https://playorna.com/api/area/?x=' + Date.now(),
        method: 'GET',
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    }).then(response => { expect(response.status).to.eq(200) })
})