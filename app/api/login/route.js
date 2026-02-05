import { AuthController } from "../../../controllers/authController.js";

export async function POST(req) {
    return AuthController.login(req);
}
