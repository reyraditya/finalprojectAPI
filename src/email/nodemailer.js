const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'raedaegun@gmail.com',
        clientId: '683037259483-4c1s51s2qg2ao2haj4b32pd9564d4sf8.apps.googleusercontent.com',
        clientSecret: 'GjQ6ajXq5kwy2LmTDLMMKk9p',
        refreshToken: '1/s_Bn87gKyAp0wOsqQKdULYrtRXkh3Tj3ntf0VHPWDPE'
    }
})

const sendVerify = (username, email) => {
    const mail = {
        from: 'Rey Raditya <raedaegun@gmail.com>',
        to: email,
        subject: 'Email Verification',
        html: `<h1><a href='http://localhost:1995/verify?username=${username}'>Click to verify</a></h1>`
    }
    
    transporter.sendMail(mail, (err, res) => {
        if(err) return console.log(err.message);
        
        console.log("Email sent");
        
    })
}

module.exports = {sendVerify}