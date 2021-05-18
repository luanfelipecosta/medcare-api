module.exports = ({ env }) => {
  console.log("emvs", env("DATABASE_HOST"));
  return {
    defaultConnection: "awspg",
    connections: {
      awspg: {
        connector: "bookshelf",
        settings: {
          client: "postgres",
          host: env("DATABASE_HOST", "127.0.0.1"),
          port: env.int("DATABASE_PORT", 5432),
          database: env("DATABASE_NAME", "strapi"),
          username: env("DATABASE_USERNAME", ""),
          password: env("DATABASE_PASSWORD", ""),
        },
        options: {
          ssl: false,
        },
      },
      default: {
        connector: "bookshelf",
        settings: {
          client: "sqlite",
          filename: env("DATABASE_FILENAME", ".tmp/data.db"),
        },
        options: {
          useNullAsDefault: true,
        },
      },
    },
  };
};
