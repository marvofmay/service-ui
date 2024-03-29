// https://on.cypress.io/api

describe('visits pages', () => {
  it('visits the app home page', () => {
    cy.viewport(1300, 800)
    cy.visit('/')
    cy.contains('Home')
  })

  it('visits the app about page', () => {
    cy.viewport(1300, 800)
    cy.visit('/about')
    cy.contains('About')
  })

  it('visits the app about page', () => {
    cy.viewport(1300, 800)
    cy.visit('/login')
    cy.contains('User Login')
  })

  it('visits the app about page', () => {
    cy.viewport(1300, 800)
    cy.visit('/register')
    cy.contains('User Registration')
  })
})
