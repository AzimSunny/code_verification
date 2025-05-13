const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const codesFilePath = path.join(__dirname, 'codes.json');

let codes = [];
if (fs.existsSync(codesFilePath)) {
    codes = JSON.parse(fs.readFileSync(codesFilePath));
}

function saveCodes() {
    fs.writeFileSync(codesFilePath, JSON.stringify(codes, null, 2));
}

// Home page
app.get('/', (req, res) => {
    res.render('index', { result: null });
});

// Check code
app.post('/verify', (req, res) => {
    const userCode = req.body.code;
    const found = codes.find(c => c.code === userCode);

    if (!found) {
        return res.render('index', { result: '❌ আপনার কোডটি ভুল বা ভুয়া।' });
    }

    if (found.used) {
        return res.render('index', { result: '⚠️ এই কোডটি ইতিমধ্যে ব্যবহৃত হয়েছে।' });
    }

    found.used = true;
    saveCodes();
    res.render('index', { result: '✅ এই কোডটি বৈধ, প্রোডাক্টটি আসল।' });
});

// Admin page
app.get('/admin', (req, res) => {
    res.render('admin', { codes });
});

// Generate codes
app.post('/generate', (req, res) => {
    const password = req.body.password;
    if (password !== '661996') {
        return res.send('ভুল পাসওয়ার্ড!');
    }

    const count = parseInt(req.body.count);
    for (let i = 0; i < count; i++) {
        let newCode = Math.floor(10000000 + Math.random() * 90000000).toString();
        codes.push({ code: newCode, used: false });
    }
    saveCodes();
    res.redirect('/admin');
});

// Export to .txt
app.get('/export', (req, res) => {
    let exportText = 'Generated Codes:\n\n';
    codes.forEach(c => {
        exportText += `${c.code} - ${c.used ? 'USED' : 'UNUSED'}\n`;
    });

    res.setHeader('Content-disposition', 'attachment; filename=codes.txt');
    res.setHeader('Content-Type', 'text/plain');
    res.send(exportText);
});

// Delete old codes
app.post('/delete-old-codes', (req, res) => {
    const password = req.body.password;
    if (password !== '661996') {
        return res.send('❌ ভুল পাসওয়ার্ড! অনুমতি নেই।');
    }

    codes = [];
    saveCodes();
    res.send('✅ পুরাতন সব কোড মুছে ফেলা হয়েছে।');
});
 const exportRoutes = require('./routes/export');
app.use('/export', exportRoutes);
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
