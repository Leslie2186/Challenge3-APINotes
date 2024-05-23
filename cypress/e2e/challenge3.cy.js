/*const { expect } = require("chai")*/

describe('CRUD complet sur API notes', () => {
  let notes = require('../fixtures/notes.json')
  let token = "";
  let noteId = 0;

  it("Test d'accès sur l'api notes", () => {
    cy.visit('https://practice.expandtesting.com/notes/api/api-docs/#/Notes/post_notes')
  })

  it("Test de santé de l'API", () => {
    cy.request('https://practice.expandtesting.com/notes/api/health-check')
    .then(response => {
      expect(response.body).to.have.property("success").equal(true)
      expect(response.body).to.have.property("status").equal(200)
      expect(response.body).to.have.property("message").equal("Notes API is Running")
    })
  })

  it.skip("Création d'un nouvel utilisateur", () => {
    cy.request({
      url: "https://practice.expandtesting.com/notes/api/users/register",
      method: "POST",
      body:{
        "name": notes.name,
        "email": notes.email,
        "password": notes.password
      }
    })
    .then(response => {
      expect(response.body).to.have.property("status", 201)
      expect(response.body.data).to.have.property("name", notes.name)
      expect(response.body.data).to.have.property("email", notes.email)
    })
  })

  it("Connexion du nouvel utilisateur", () =>{
    cy.LoginUser({
      "email": notes.email,
      "password": notes.password
    })
    .then(response => {
      expect(response.body).to.have.property("status", 200)
      expect(response.body).to.have.property("message", "Login successful")
      expect(response.body.data).to.have.property("name", notes.name)
      expect(response.body.data).to.have.property("token", response.body.data.token)

      token = response.body.data.token
    })
  })

  it("Récupérer le profil utilisateur", () => {
    cy.request({ 
      url: "https://practice.expandtesting.com/notes/api/users/profile",
      method: "GET",
      headers: {
        "x-auth-token": token
      }
    })
    .then( response => {
      expect(response.body).to.have.property("status", 200)
      expect(response.body).to.have.property("message", "Profile successful")
      expect(response.body.data).to.have.property("name", notes.name)
      expect(response.body.data).to.have.property("email", notes.email)
    })
  })

  it("Créer une nouvelle note", () => {
    cy.request({
      url: "https://practice.expandtesting.com/notes/api/notes",
      method: "POST",
      headers: {
        "x-auth-token": token
      },
      body: {
        "title": notes.title,
        "description": notes.description,
        "category": notes.category
      }
    })
    .then(response => {
      expect(response.body).to.have.property("status", 200)
      expect(response.body).to.have.property("message", "Note successfully created")
      expect(response.body.data).to.have.property("id", response.body.data.id)

      noteId = response.body.data.id
    })
  })

  it("Récupérer toutes les notes", () => {
    cy.request({
      url: "https://practice.expandtesting.com/notes/api/notes",
      method: "GET",
      headers: {
        "x-auth-token": token
      }
    })
    .then(response => {
      expect(response.body).to.have.property("status", 200)
      expect(response.body).to.have.property("message", "Notes successfully retrieved")
    })
  })

  it("Récupérer une note par son Id", () => {
    cy.request({
      url:`https://practice.expandtesting.com/notes/api/notes/${noteId}`,
      method: "GET",
      headers: {
        "x-auth-token": token
      }
    })
    .then(response => {
      expect(response.body).to.have.property("status", 200)
      expect(response.body).to.have.property("message", "Note successfully retrieved")
    })
  })

  it("Modification d'une note", () => {
    cy.request({
      url:`https://practice.expandtesting.com/notes/api/notes/${noteId}`,
      method: "PUT",
      headers: {
        "x-auth-token": token
      },
      body: {
        "id": noteId,
        "title": "Modif titre dernière note créée",
        "description": "Modif du blabla de description dernière note créée",
        "completed": false,
        "category": "Work"
      }
    })
    .then(response => {
      expect(response.body).to.have.property("status", 200)
      expect(response.body).to.have.property("message", "Note successfully Updated")
      expect(response.body.data).to.have.property("completed", false)
    })
  })

  it("Modifier l'attribut completed d'une note", () => {
    cy.request({
      url: `https://practice.expandtesting.com/notes/api/notes/${noteId}`,
      method: "PATCH",
      headers: {
        "x-auth-token": token
      },
      body: {
        "id": noteId,
        "completed": true
      }
    })
    .then(response => {
      expect(response.body).to.have.property("status", 200)
      expect(response.body).to.have.property("message", "Note successfully Updated")
      expect(response.body.data).to.have.property("completed", true)
    })
  })

  it("Supprimer une note grâce à son id", () => {
    cy.request({
      url: `https://practice.expandtesting.com/notes/api/notes/${noteId}`,
      method: "DELETE",
      headers: {
        "x-auth-token": token
      }
    })
    .then(response => {
      expect(response.body).to.have.property("status", 200)
      expect(response.body).to.have.property("message", "Note successfully deleted")
    })
  })
})