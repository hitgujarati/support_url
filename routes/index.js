var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'welcome to the page' });
});

router.post('/send/mail', function (req, res, next) {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message || !phone) {
      return next(
        res.status(400).json({
          success: false,
          message: "Please provide all details",
        })
      );
    }

    if (phone.length > 10) {
      return (
        res.status(400).json({
          success: false,
          message: "Invalid Phone Number",
        })
      )
    }

    var transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICES, 
      auth: {
        user: process.env.SMTP_MAIL, 
        pass: process.env.SMTP_PASSWORD //'czqi wdkb oogt mvxe '
      }
    });

    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: 'gujaratiyutik@gmail.com', //recive email
      subject: 'CAR MOD MELON',
      text: `${message} \n\nEmail of User Who Sent The Message: ${email} \n\nMobile Number of User Who Sent The Message: ${phone}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log('Email sent: ' + info.response);
        console.log('Email sent successfully');
      }
    });

    res.status(200).json({
      success: true,
      message: "Message Sent Successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
