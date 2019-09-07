import Chance from 'chance'
let version = Cypress.env('version')
let agent = Cypress.env('agent')
let sid = Cypress.env('sid')

let dd = Cypress.env('raidBattle') + '&type=spell&spell_id=SummonDead&state_id='


it('boss killer', () => {

         //cy.raid(sid, version, agent, battle, bodystate, raidstate)
        cy.raid(sid, version, agent, dd, '')

})

