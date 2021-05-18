"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services["vital-signs"].search(ctx.query);
    } else {
      entities = await strapi.services["vital-signs"].find(ctx.query, []);
    }

    return entities.map((entity) => {
      const data = sanitizeEntity(entity, {
        model: strapi.models["vital-signs"],
      });
      delete data.created_at;
      delete data.updated_at;
      delete data.patient;

      return data;
    });
  },
};
