/** @format */

import { configs } from "./modules/common/utils/config"
import app from "./server"

// Start the server
app.listen(configs.PORT, () => {
    console.log(`Environment is ${configs.NODE_ENV}`)
    console.log(`Server started on port: ${configs.PORT}`)
    console.log(
        `Connected to database: ${
            configs.NODE_ENV === "production"
                ? configs.DB_NAME_PROD
                : configs.DB_NAME
        }`
    )
})
