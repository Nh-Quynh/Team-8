const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'llqonlinestore@gmail.com', // Thay thế bằng email của bạn
    pass: 'xyqf ltbu vmul rnfa'   // Thay thế bằng mật khẩu email của bạn
  }
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: 'LL&Q Store llqonlinestore@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email: ', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = sendEmail;