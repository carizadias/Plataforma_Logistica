module.exports = (sequelize, DataTypes) => {
    const PostOfficeHours = sequelize.define('PostOfficeHours', {
        post_office_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'post_offices',
                key: 'post_office_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        day_of_week: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            validate: {
                min: 1,
                max: 7
            }
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
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        paranoid: true
    });

    PostOfficeHours.associate = (models) => {
        
        PostOfficeHours.belongsTo(models.PostOffice, {foreignKey: 'post_office_id',as: 'postOffice'});
    };

    return PostOfficeHours;
};
