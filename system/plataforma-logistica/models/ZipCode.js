// models/ZipCode.js
module.exports = (sequelize, DataTypes) => {
    const ZipCode = sequelize.define('ZipCode', {
        zip_code_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        neighborhood_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'neighborhoods',
                key: 'neighborhood_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'
        },
        zip_code:{
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'zip_codes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
    });

    ZipCode.associate = (models) => {
        
        ZipCode.belongsTo(models.Neighborhood,{foreignKey:'neighborhood_id', as:'neighborhood'});
    };

    return ZipCode;
};
