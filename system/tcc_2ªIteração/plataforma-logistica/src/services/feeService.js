const { Fee } = require('../../models');
const { Op } = require('sequelize');


exports.addOrUpdateFee = async ({
  order_type_id,
  sub_service_id,
  weight_min,
  weight_max,
  price_national,
  price_international
}) => {
  const existingFee = await Fee.findOne({
    where: {
      order_type_id,
      sub_service_id,
      weight_min,
      weight_max
    }
  });

  if (existingFee) {
    existingFee.price_national = price_national;
    existingFee.price_international = price_international;
    await existingFee.save();

    return { updated: true };
  } else {
    await Fee.create({
      order_type_id,
      sub_service_id,
      weight_min,
      weight_max,
      price_national,
      price_international
    });

    return { updated: false };
  }
};


exports.calculateFee = async ({ sub_service_id, order_type_id, weight, destination }) => {
  const column = destination.toLowerCase() === 'nacional' ? 'price_national' : 'price_international';
  console.log("Valores recebidos no service:", { sub_service_id, order_type_id, weight, destination, column });

  const fee = await Fee.findOne({
    where: {
      sub_service_id,
      order_type_id,
      weight_min: { [Op.lte]: weight },
      weight_max: { [Op.gte]: weight }
    },
    attributes: [[column, 'price']]
  });

  console.log("Resultado da consulta:", fee);

  if (!fee) {
    throw new Error("Nenhuma tarifa encontrada para os critérios informados.");
  }

  //return fee.dataValues.price;
  return parseFloat(fee.dataValues.price); // Converte para número

};
