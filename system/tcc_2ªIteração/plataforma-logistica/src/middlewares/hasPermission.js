const { UserRole, UserType, UserTypePermission, Permission } = require('../../models');

function hasPermission(requiredPermission) {
    return async (req, res, next) => {
        try {
            const userId = req.user.user_id;

            // Buscar os papéis (user_types) do usuário
            const userRoles = await UserRole.findAll({
                where: { user_id: userId },
                include: {
                    model: UserType,
                    as: 'user_type',
                    include: {
                        model: UserTypePermission,
                        as: 'permissions',
                        include: {
                            model: Permission,
                            as: 'permission',
                            where: { name: requiredPermission },
                        }
                    }
                }
            });

            // Verifica se alguma role do usuário tem a permissão
            const hasPermission = userRoles.some(role =>
                role.user_type?.permissions?.some(perm => perm.permission?.name === requiredPermission)
            );

            if (!hasPermission) {
                return res.status(403).json({ message: 'Acesso negado: permissão insuficiente' });
            }

            next();
        } catch (error) {
            console.error('Erro na verificação de permissão:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    };
}

module.exports = hasPermission;
