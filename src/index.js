import dotenv from "dotenv"
import {app} from "./app.js"

dotenv.config({
    path:'./.env'
})
try {
    app.listen(process.env.PORT|| 8000, () => {
        console.log(`Server running on http://localhost:${process.env.PORT||8000}`);
        console.log("Server started successfully");
      });
} catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); 
  } 

