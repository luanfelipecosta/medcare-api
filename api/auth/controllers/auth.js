const { sanitizeEntity } = require("strapi-utils");
const crypto = require("crypto");

module.exports = {
  async test(ctx) {
    console.log(strapi.services);
  },
  async send(ctx) {
    const { phone } = ctx.request.body;

    if (!phone) {
      return ctx.badRequest("O telefone deve ser informado");
    }

    const user = await strapi
      .query("user", "users-permissions")
      .findOne({ username: phone });

    if (!user) {
      ctx.notFound("Usuário não encontrado");
    }

    if (user.blocked) {
      return ctx.badRequest("Usuário bloqueado");
    }

    const confirmationKey = crypto.randomBytes(64).toString("hex");
    const confirmationPin = await strapi.services.auth.generatePin();

    await strapi.services.auth.sendPin(phone, confirmationPin);

    await strapi
      .query("user", "users-permissions")
      .update(
        { username: phone },
        { ...user, confirmationKey, confirmationPin }
      );

    return confirmationKey;
  },
  async validate(ctx) {
    const { pin, confirmationKey } = ctx.request.body;

    if (!pin || !confirmationKey) {
      return ctx.badRequest(
        "Parâmetros inválidos. informar chave secreta e PIN."
      );
    }

    const user = await strapi
      .query("user", "users-permissions")
      .findOne({ confirmationKey, confirmationPin: pin });

    if (!user) {
      return ctx.notFound("PIN inválido");
    }

    ctx.send({
      jwt: strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      }),
      user: sanitizeEntity(user.toJSON ? user.toJSON() : user, {
        model: strapi.query("user", "users-permissions").model,
      }),
    });
  },
};
