const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.folder || 'uploads';

    //const uploadPath = path.join(__dirname, '..','uploads', folder);
    const uploadPath = path.join(process.cwd(), 'uploads', folder);


    fs.mkdirSync(uploadPath, {recursive: true});

    cb(null, uploadPath); // pasta mais organizada
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);

    console.log("file:", file);
    console.log("file.fieldname:", file.fieldname);
  },

});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    console.log("file.mimetype:", file.mimetype);
  } else {
    cb(new Error('Apenas arquivos JPEG, PNG e JPG são permitidos'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
