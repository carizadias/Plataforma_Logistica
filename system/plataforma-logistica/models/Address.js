module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define("Address", {
        address_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        neighborhood_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'neighborhoods',
                key: 'neighborhood_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT'//não deixa apagar se tiver um address associado
        },
        street: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        door_number: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        floor_number: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        tableName: 'addresses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true,
        indexes: [
            {
                fields: ['street']
            },
        ]
    });
    Address.associate = (models) => {

        Address.hasOne(models.PostOffice, { foreignKey: 'address_id', as: 'postOffice' });

        Address.belongsTo(models.Neighborhood, { foreignKey: 'neighborhood_id', as: 'neighborhood' });

        Address.belongsToMany(models.User, {
            through: 'user_address',
            foreignKey: 'address_id',
            otherKey: 'user_id',
            as: 'users',
        });

    }

    return Address;

};
