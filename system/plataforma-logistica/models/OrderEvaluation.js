module.exports = (sequelize, DataTypes) => {
    const OrderEvaluation = sequelize.define('OrderEvaluation', {
        order_evaluation_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'order_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: [0, 1000],
            },
        },
        evaluation_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        is_active:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    }, {
        tableName: 'order_evaluations',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true,
        indexes:[
            //IDX DE COMENT TB?
            {
                fields:['rating']
            },
        ]
    });

    OrderEvaluation.associate = (models) => {
        
        OrderEvaluation.belongsTo(models.Order, {foreignKey: 'order_id',as: 'order',});
    };

    return OrderEvaluation;
};
