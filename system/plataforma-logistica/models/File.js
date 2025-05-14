module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define('File', {
        file_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        uploaded_by: {
            type: DataTypes.UUID,
            allowNull: true,
            references:{
                model:'users',
                key:'user_id'
            },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        url: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isUrl: true
            }
        },
        type: {
            type: DataTypes.STRING(50),
            validate: {
                isIn:[['image','pdf']]//...utilizar junto com enum?
            }
        },
        size: {
            type: DataTypes.INTEGER
        },
        tag: {
            type: DataTypes.STRING(150),//unique?
            allowNull: true,
        }
    }, {
        tableName: 'files',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
        indexes: [
            {
                fields: ['tag'],
            }
        ]
    });

    File.associate = function (models) {

        File.hasOne(models.User, {foreignKey: 'profile_picture_id', as: 'usedByUser'});
        File.hasOne(models.PostalCompany, {foreignKey: 'logotype_id', as: 'usedByPostalCompany'});
        File.hasOne(models.PostOffice, {foreignKey: 'photo_id', as: 'usedByPostOffice'});

        File.belongsTo(models.User, { foreignKey: 'uploaded_by', as:'uploadedBy' });


    };

    return File;
};
