import { catchError } from "../../modules/common/utils";

const {
  DB_URL,
  DB_NAME,
  DB_URL_STAG,
  DB_URL_PROD,
  DB_NAME_STAG,
  DB_NAME_PROD,
  NODE_ENV,
} = process.env;

if (
  (NODE_ENV === "development" && typeof DB_URL !== "string") ||
  typeof DB_NAME !== "string"
) {
  throw catchError("Add TESTING MONGO URI", 404);
}

if (
  NODE_ENV === "staging" &&
  (typeof DB_URL_STAG !== "string" || typeof DB_NAME_STAG !== "string")
) {
  throw catchError("Add STAGING MONGO URI", 404);
}

if (
  NODE_ENV === "production" &&
  (typeof DB_URL_PROD !== "string" || typeof DB_NAME_PROD !== "string")
) {
  throw catchError("Add PRODUCTION MONGO URI", 404);
}

export default {
  development: {
    MONGO_URI: `${DB_URL}/${DB_NAME}`,
  },
  staging: {
    MONGO_URI: `${DB_URL_STAG}/${DB_NAME_STAG}`,
  },
  production: {
    MONGO_URI: `${DB_URL_PROD}/${DB_NAME_PROD}`,
  },
};
