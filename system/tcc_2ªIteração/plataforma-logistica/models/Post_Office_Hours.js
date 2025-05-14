module.exports = (sequelize, DataTypes) => {
    const PostOfficeHours = sequelize.define('PostOfficeHours', {
        post_office_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'post_offices',
                key: 'post_office_id'
            },
            primaryKey: true,  // Parte da chave primária composta
        },
        day_of_week: {
            type: DataTypes.STRING(20),
            allowNull: false,
            primaryKey: true,  // Parte da chave primária composta
        },
        opening_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        closing_time: {
            type: DataTypes.TIME,
            allowNull: false,
        }
    }, {
        tableName: 'post_office_hours',
        timestamps: false, // Não precisamos de created_at/updated_at para essa tabela
    });

    PostOfficeHours.associate = (models) => {
        PostOfficeHours.belongsTo(models.PostOffice, {
            foreignKey: 'post_office_id',
            as: 'post_office'
        });
    };

    return PostOfficeHours;
};
