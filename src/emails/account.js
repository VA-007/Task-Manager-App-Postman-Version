const sgMail = require('@sendgrid/mail');

// --> Setting the API key for SendGrid to use by fetching it form the created enviroment variable SENDGRID_API_KEY
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --> Setting up the sendWelcomeEmail function to send welcome Emails to the users when they create an account
const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'va007coc@gmail.com',
    subject: 'Welcome to the Task Manager App! 😀',
    text: `Welcome you to the Task Manager Application ${name}. It is a pleasure to have you onboard and hope you will make the best out of this app. Thanks for joining in!`
  });
}

// --> Setting up the sendGoodbyeEmail function to send goodbye Emails to the users when they delete their account
const sendGoodbyeEmail = async (email, name) => {
  sgMail.send({
    to: email,
    from: 'va007coc@gmail.com',
    subject: 'We are sorry to see you go... ☹️',
    text: `You have been a great user of the Task Manager Application ${name}. It was a pleasure to have you onboard and we hope to see you again using the app and make the best out of it.`
  });
}

// --> Exporting both the modules
module.exports = { sendWelcomeEmail, sendGoodbyeEmail };
