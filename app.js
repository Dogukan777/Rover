const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));  // Base64 veri boyutunu artırdık

// Mail gönderme işlemi
const sendEmail = (photoBase64) => {
    if (!photoBase64) {
        console.log('Base64 verisi yok!');
        return;
    }

    // Fotoğraf Base64 verisinin başındaki data:image/jpeg;base64, kısmını temizleme
    const base64Data = photoBase64.replace(/^data:image\/jpeg;base64,/, '');

    // Fotoğrafı Base64'ten Buffer'a dönüştürme
    const bufferContent = Buffer.from(base64Data, 'base64');
    if (!bufferContent) {
        console.log('Fotoğraf verisi dönüştürülemedi!');
        return;
    }

    // E-posta için SMTP transportu oluşturma
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dgknn.bas@gmail.com',
            pass: 'rhno zsho apwp gdhj'  // Uygulama şifresi kullanılmalı
        }
    });

    const mailOptions = {
        from: 'dgknn.bas@gmail.com',
        to: 'dgknn.bas@gmail.com',
        subject: 'Base64 Fotoğraf',
        text: 'İlgili Base64 fotoğrafı ekte bulabilirsiniz.',
        attachments: [
            {
                filename: 'photo.jpg',
                content: bufferContent
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('E-posta gönderilemedi:', error);
        } else {
            console.log('E-posta gönderildi:', info.response);
        }
    });
};


app.post('/', (req, res) => {
    const message = req.body.message;
    const photo = req.body.photo;  // Base64 formatındaki fotoğraf

    console.log("Gelen Mesaj:", message);
    console.log("Gelen Fotoğraf:", photo);  // Burada fotoğrafın doğru geldiğini kontrol edin

    if (message && photo) {
        sendEmail(photo);
        res.send('Mesaj ve Fotoğraf alındı ve e-posta gönderildi.');
    } else {
        res.status(400).send('Mesaj veya fotoğraf bulunamadı!');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
