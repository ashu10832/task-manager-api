const sgMail = require('@sendgrid/mail')

const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY

sgMail.setApiKey(SEND_GRID_API_KEY)


const sendWelcomeEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'ashu.gupta.dce@gmail.com',
        subject:'Hey! Welcome to my App',
        text: `Welcome to the app, ${name}. Thanks for joining. `
    })
}


const sendCancelEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'ashu.gupta.dce@gmail.com',
        subject:'We are sad',
        text: `Hey, ${name}. We saw that you deleted your account recently.
         Sorry to see you go. I hope to see you back soon. 
         Adios Amigo! `
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}

