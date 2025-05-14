//colocar este middleware no seu devido ficheiro
const setUploadFolder = (folderName) => (req, res, next) => {
    req.folder = folderName;
    next();
};

module.exports = setUploadFolder;