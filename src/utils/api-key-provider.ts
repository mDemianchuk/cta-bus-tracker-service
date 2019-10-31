import {config} from 'dotenv';

export class ApiKeyProvider {
    private constructor() {
    }

    static getApiKey(): string {
        config();
        let apiKey: string | undefined = process.env['API_KEY'];
        if (!apiKey) {
            throw new Error('No API key provided');
        }
        return apiKey;
    }
}