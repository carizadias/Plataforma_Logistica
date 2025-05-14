module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
        file_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING
        },
        size: {
            type: DataTypes.INTEGER
        },
        uploaded_by: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: true,
        }
        
    }, {
        tableName: 'files',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
        paranoid: true
    });

    File.associate = function (models) {
        File.belongsTo(models.User, { foreignKey: 'uploaded_by' });
    };

    return File;
};
