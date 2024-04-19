let dataset = require('../fixtures/example.json')
context('Buy item', () => {

    beforeEach(() => {

        cy.visit('')
            .get('#user-name')
            .type(dataset.username)
            .get('#password')
            .type(dataset.password)
            .get('#login-button')
            .click()
    })

    it('Buys an item from the site', () => {
        //Store item title and price as Alias 
        cy.get('div.inventory_item_name', { timeout: 5000 }).eq(0).then(el => {
            let itemName = el.text()
            cy.wrap(itemName).as('itemName')
        })
        cy.get('div.inventory_item_price').eq(0).then(el => {
            let itemPrice = el.text()
            cy.wrap(itemPrice).as('itemPrice')
        })

        //Click on item
        cy.get('div.inventory_item_name', { timeout: 5000 }).eq(0).click({ force: true })

        //Add item to cart
        cy.get('button.btn_primary').click()

        // Go to cart
        cy.get('a.shopping_cart_link').click()

        //Assert item name and item price and quantity
        cy.get('@itemName').then(itemName => {
            cy.get('@itemPrice').then(itemPrice => {
                cy.get('div.inventory_item_name', { timeout: 5000 }).should('contain.text', itemName)
                cy.get('div.inventory_item_price').should('contain.text', itemPrice)
                cy.get('div.cart_quantity').should('contain', '1')

                //Proceed to checkout 
                cy.get('[data-test="checkout"]', { timeout: 5000 }).click()

                //Enter personal detail
                cy.get('#first-name').clear().type(dataset.firstName)
                cy.get('#last-name').clear().type(dataset.lastName)
                cy.get('#postal-code').clear().type(dataset.postcode)

                //Click continue
                cy.get('input.btn_primary.cart_button', { timeout: 5000 }).click()

                //submit the order
                cy.get('[data-test="finish"]', { timeout: 5000 }).click()

                //Assert order completion
                cy.get('h2.complete-header', { timeout: 5000 }).should('contain', 'Thank you for your order!')

            })
        })
    })
})