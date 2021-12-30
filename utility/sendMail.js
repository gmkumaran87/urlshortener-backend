const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

const sendEmail = async(email, link) => {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email", //process.env.HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "juvenal.ritchie95@ethereal.email", //process.env.USER, // generated ethereal user
            pass: "BgygctYTEjBAeJVj76", //process.env.PASSWORD, // generated ethereal password
        },
    });

    console.log("User email id", email, link);
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Muthu Test 👻" <foo@example.com>', // sender address
        to: "ganapathy.m06@gmail.com", // list of receivers
        subject: "Forgot Password reset", // Subject line
        text: link, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return info;
};

const sendGridMail = async(email, link) => {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: email, // Change to your recipient
            from: "gmkumaran87@gmail.com", // Change to your verified sender
            subject: "Sending with SendGrid for Password reset",
            text: link,
            html: `<strong>Kindly click the link for resetting the Password,</strong>
            <a href=${link}><button>Reset Password</button></a>`,
        };

        const info = await sgMail.send(msg);

        console.log("Email sent", info);
        return info;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { sendEmail, sendGridMail };