// utils/uploadUtils.js
const {File} = require('../models');

const handleFileUpload = async (req, folder = '') => {
            console.log("req.file:", req.file);

            if (!req.file) {
                return reject({ status: 400, message: 'Nenhum ficheiro foi enviado' });
            }

            try {
                const folder = req.folder || '';
                
                const urlPath = folder ? `/uploads/${folder}/${req.file.filename}`:`/uploads/${req.file.filename}`;

                const file = await File.create({
                    name: req.file.originalname,
                    url: urlPath,
                    type: req.file.mimetype,
                    size: req.file.size,
                    uploaded_by: req.user?.user_id || null
                });

                return file;
            } catch (error) {
                throw { status: 500, message: 'Erro ao salvar o ficheiro no banco de dados', error: error };
            }

};


module.exports = {
    handleFileUpload,
};
