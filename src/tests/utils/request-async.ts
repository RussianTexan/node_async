import * as Request from 'request';

export async function requestAsync(req: Request.Options): Promise<Request.RequestResponse> {
    return new Promise<Request.RequestResponse>((
        resolve: (value: Request.RequestResponse) => void,
        reject: (reason: Error) => void
    ) => {
        try {
            Request(req, (error: any, response: any, body: any) => {
                if (error) { reject(error); }
                else { resolve(response); }
            });
        } catch (err) {
            reject(err);
        }
    });
}
