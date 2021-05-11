const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'shreyam803@gmail.com',
        subject: 'Thanks for joining us.',
        text: `Welcome to the app ,${name}.`
        })
}

const sendCancelationEmail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'shreyam803@gamil.com',
        subject:'Cancelation of your account',
        text:`GoodBye,${name}.I hope to see you back sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}