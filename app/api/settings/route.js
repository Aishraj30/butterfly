import { SettingsController } from "@/controllers/settingsController";

export async function GET() {
    return await SettingsController.getSettings();
}

export async function PUT(request) {
    return await SettingsController.updateSettings(request);
}

// Support POST as well if some clients use it instead of PUT
export async function POST(request) {
    return await SettingsController.updateSettings(request);
}
