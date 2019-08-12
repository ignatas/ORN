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
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    })
})

Cypress.Commands.add('battleCreate', (sid, version, agent, monsterId) => {
    let date = Date.now()
    cy.request({
        url: 'https://playorna.com/api/battles/monster/?x=' + date,
        method: 'OPTIONS',
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ORNA-SID': sid
        }
    })
    // the main request for battle creation
    return cy.request({
        url: 'https://playorna.com/api/battles/monster/?x=' + date,
        method: 'POST',
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded', //required !!
            'X-ORNA-SID': sid
        },
        body: 'uuid=' + monsterId
    })
})

Cypress.Commands.add('battleInitiate', (sid, version, agent, battleId) => {
    let date = Date.now()
    cy.request({
        url: 'https://playorna.com/api/battles/monster/?uuid=' + battleId + '&x=' + date,
        method: 'OPTIONS',
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    })
    // the main request for battle initioation, preconditions
    return cy.request({
        url: 'https://playorna.com/api/battles/monster/?uuid=' + battleId + '&x=' + date,
        method: 'GET',
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    })
})

let state = ''
Cypress.Commands.add('battleSpell', (sid, version, agent, battleId, spell, state) => {
    cy.request({
        url: 'https://playorna.com/api/battles/monster/turn/?x=' + Date.now(),
        method: 'POST',
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ORNA-SID': sid
        },
        body: 'uuid=' + battleId + '&type=spell&spell_id=' + spell + '&state_id=' + state
    })
        .then(response => {
            if (response.body.result.lost == true) { cy.log('===> looser'); cy.wait(10000); return}
            else if (response.body.result.won == true) { cy.log(response.body.result); return }
            else if (response.body.result.lost == false && response.body.result.won == false)
            {
            state = response.body.state_id
            cy.wait(555)
            cy.battleSpell(sid, version, agent, battleId, spell, state)
            return
        }            
        })
})

Cypress.Commands.add('battleAttack', (sid, version, agent, battleId, state) => {
    cy.request({
        url: 'https://playorna.com/api/battles/monster/turn/?x=' + Date.now(),
        method: 'POST',
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ORNA-SID': sid
        },
        body: 'uuid=' + battleId + '&type=attack&state_id=' + state
    })
    .then(response => {
        if (response.body.result.lost == true) { cy.log('===> looser'); cy.wait(10000); return}
        else if (response.body.result.won == true) { cy.log(response.body.result); return }
        else if (response.body.result.lost == false && response.body.result.won == false)
        {
        state = response.body.state_id
        cy.wait(555)
        cy.battleSpell(sid, version, agent, battleId, spell, state)
        return
    }            
    })
})

Cypress.Commands.add('heal', (sid, version, agent) => {
    return cy.request({
        url: 'https://playorna.com/api/me/?x=' + Date.now(),
        method: 'POST',
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-ORNA-SID': sid
        },
        body: 'action=autoheal'
    })
})

Cypress.Commands.add('getShops', (sid, version, agent) => {
    return cy.request({
        url: 'https://playorna.com/api/shops/?x=' + Date.now(),
        method: 'GET',
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    })
})

Cypress.Commands.add('getBoss', (sid, version, agent) => {
    return cy.request({
        url: 'https://playorna.com/api/area/?x=' + Date.now(),
        method: 'GET',
        headers: {
            'User-Agent': agent,
            'X-ORNA-VERSION': version,
            'X-ORNA-SID': sid
        }
    })
})