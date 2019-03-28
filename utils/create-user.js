require('dotenv').config();
var admin = require("firebase-admin");
var inquirer = require("inquirer");

admin.initializeApp();

const prompt = inquirer.createPromptModule();
prompt([
    {
      type: "input",
      name: "name",
      message: "Users full name"
    },
    {
      type: "input",
      name: "email",
      message: "e-mail address"
    },
    {
      type: "password",
      name: "password",
      message: "Password",
      mask: "*"
    },
    {
      type: "password",
      name: "verifyPassword",
      message: "Re-type password",
      mask: "*"
    }
  ])
  .then(answers => {
    if(answers.password !== answers.verifyPassword) {
      throw new Error('Passwords do not match!!!');
    }
    
    return admin
      .auth()
      .createUser({
        email: answers.email,
        password: answers.password,
        displayName: answers.name,
        emailVerified: false,
        disabled: false
      })
      .then(user => {
        console.log("* User created");
      });
  })
  .catch(err => {
    console.error('Error:', err.message);
  })
  .then(() => process.exit());
