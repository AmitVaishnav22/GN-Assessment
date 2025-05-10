import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const loadData = (file) => JSON.parse(fs.readFileSync(path.join(__dirname, `../models/${file}`)));
const saveData = (file, data) => fs.writeFileSync(path.join(__dirname, `../models/${file}`), JSON.stringify(data, null, 2));

export { loadData, saveData }; 