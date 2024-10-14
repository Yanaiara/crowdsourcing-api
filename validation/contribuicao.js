const Joi = require("joi");

const contribuicaoSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "O nome deve ser um texto.",
    "string.min": "O nome deve ter pelo menos 3 caracteres.",
    "string.max": "O nome pode ter no máximo 100 caracteres.",
    "any.required": "O nome é obrigatório."
  }),
  address: Joi.string().min(5).max(200).required().messages({
    "string.base": "O endereço deve ser um texto.",
    "string.min": "O endereço deve ter pelo menos 5 caracteres.",
    "string.max": "O endereço pode ter no máximo 200 caracteres.",
    "any.required": "O endereço é obrigatório."
  }),
  features: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "Deve haver pelo menos uma característica de acessibilidade."
  }),
  rating: Joi.number().min(0).max(5).required().messages({
    "number.base": "A avaliação deve ser um número.",
    "number.min": "A avaliação não pode ser menor que 0.",
    "number.max": "A avaliação não pode ser maior que 5.",
    "any.required": "A avaliação é obrigatória."
  })
});

module.exports = contribuicaoSchema;
