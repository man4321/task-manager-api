const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email,name)=>{
    
    sgMail.send({
        to: email,
        from:"manohar2000.seervi@gmail.com",
        subject:"Welcome to The Task App",
        text:`Welcome to your Task app ${name}`
    });
}
const SendGoodByeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from:"manohar2000.seervi@gmail.com",
        subject:"Sorry to see you go",
        text:`Good bye from Task App ${name},hope to see you back sometime soon.`
    });
}

module.exports = {
    sendWelcomeEmail, SendGoodByeEmail
}