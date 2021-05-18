const { path } = require("ramda");
module.exports = async (ctx, next) => {
  const type = path(["state", "user", "profile", 0, "type"], ctx);

  if (type && type === "Nurse") {
    return await next();
  }

  ctx.unauthorized(`You're not allowed to perform this action!`);
};
