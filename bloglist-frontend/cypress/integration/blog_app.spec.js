describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      username: 'testuser',
      name: 'test-man',
      password:'testsekret'
    }
    cy.request('POST','http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })
  it('Login from is shown', function() {
    cy.contains('log in')
  })

  describe('Login', function() {
    it('login form can be opened', function() {
      cy.contains('log in').click()
    })
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('testuser')
      cy.get('#password').type('testsekret')
      cy.get('#login-button').click()

      cy.contains('test-man logged in')
    })
    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('wrongUserame')
      cy.get('#password').type('wrongPassword')
      cy.get('#login-button').click()

      cy.get('.error').contains('wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
    describe('When logged in', function() {
      beforeEach(function() {

        cy.visit('http://localhost:3000')

        cy.contains('log in').click()
        cy.get('#username').type('testuser')
        cy.get('#password').type('testsekret')
        cy.get('#login-button').click()
      })

      it('a new blog can be created', function() {
        cy.contains('new blog').click()
        cy.get('#title').type('a blog about Cypress')
        cy.get('#author').type('Cypress Blogger')
        cy.get('#url').type('www.blogaboutcypress.com')
        cy.get('#submit-button').click()

        cy.contains('a new blog "a blog about Cypress" by Cypress Blogger added')
      })
      it('a created blog can be liked', function() {
        cy.contains('new blog').click()
        cy.get('#title').type('a blog about Cypress')
        cy.get('#author').type('Cypress Blogger')
        cy.get('#url').type('www.blogaboutcypress.com')
        cy.get('#submit-button').click()

        cy.get('#like').as('theLikeButton').click()
        cy.get('#view').click()
        cy.contains('likes: 1')
      })
      it('a created blog can be removed', function() {
        cy.contains('new blog').click()
        cy.get('#title').type('a blog about Cypress')
        cy.get('#author').type('Cypress Blogger')
        cy.get('#url').type('www.blogaboutcypress.com')
        cy.get('#submit-button').click()

        cy.get('#delete').click()
        cy.contains('blog "a blog about Cypress" removed!')


      })
      describe('when there is many blogs', function() {
        beforeEach(function(){

          cy.request('POST', 'http://localhost:3001/api/login', {
            username: 'testuser', password: 'testsekret'
          }).then(response => {
            localStorage.setItem('loggedUser', JSON.stringify(response.body))


            const blog = {
              title: 'a blog about Cypress',
              author: 'Cypress Blogger',
              url: 'www.cypress.com',
              likes: '5',
            }

            const blog2 = {
              title: 'a blog about likes',
              author: 'Liker Blogger',
              url: 'www.likes.com',
              likes: 10
            }
            cy.request({
              url:'http://localhost:3001/api/blogs',
              method: 'POST',
              body: blog,
              headers: {
                'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`
              }
            })
            cy.request({
              url:'http://localhost:3001/api/blogs',
              method: 'POST',
              body: blog2,
              headers: {
                'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`
              }
            })

          })
          cy.visit('http://localhost:3000')
        })


        it('most liked blogs are shown first', function() {

          cy.get('#blogtitle')
            .first()
            .contains('a blog about likes')


        })
      })
    })
  })
})

