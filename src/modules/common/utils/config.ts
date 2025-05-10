/** @format */

import { catchError } from "./index"

export const validateEnvs = (values: string[]) => {
    return values.map(value => {
        if (typeof process.env[value] !== "string") {
            throw catchError(`Add ${value} to env`)
        }
        return value
    })
}

const getEnv = (key: string) => String(process.env[key])

export const configs = {
    PORT: getEnv("PORT"),
    DB_URL: getEnv("DB_URL"),
    DB_NAME: getEnv("DB_NAME"),
    NODE_ENV: getEnv("NODE_ENV"),
    DB_URL_PROD: getEnv("DB_URL_PROD"),
    BACKEND_URL: getEnv("BACKEND_URL"),
    DB_NAME_PROD: getEnv("DB_NAME_PROD"),
    ENCRYPTIONIV: getEnv("ENCRYPTIONIV"),
    ENCRYPTIONKEY: getEnv("ENCRYPTIONKEY"),
}

validateEnvs(Object.keys(configs))
