export class Deployment {
    name: string;
    url: string;
    sauth: string[];

    project: string;
    service: string;
    instance: string;

    port: string;
    isProduction: boolean;

    private static _instance: Deployment;
    static get instance(): Deployment {
        if (!Deployment._instance) { Deployment._instance = Deployment.get(); }
        return Deployment._instance;
    }

    static get(): Deployment {
        const d = new Deployment();
        d.project = process.env.GOOGLE_CLOUD_PROJECT;
        d.instance = process.env.GAE_INSTANCE;
        d.service = process.env.GAE_SERVICE;

        d.isProduction = (process.env.NODE_ENV === 'production');
        d.port = (process.env.PORT || '3000');
        if (d.project) {
            if (d.service && d.service !== 'default') {
                d.url = `https://${d.service}-dot-${d.project}.appspot.com`;
            } else {
                d.url = `https://${d.project}.appspot.com`;
            }
        }
        else {
            d.url = `http://localhost:${d.port}`;
        }
        return d;
    }
}
