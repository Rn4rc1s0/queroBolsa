export class HttpService {
    async get(url: string) {
        let response = await fetch(url);
        let data = await response.json();

        return data;
    }
}