import { Th } from './th';

export class Warranty {
    brand: string;
    b2b: string;
    powertrain: string;
    method: string;
    constructor(brand: string, method: string) {
        this.brand = brand;
        this.method = method;
    }
}

export class WarrantyData {

    static readonly instance = new WarrantyData();
    private constructor() {
    }

    // https://www.cartelligent.com/blog/understanding-new-car-warranties
    warranties: Warranty[] = [
        { brand: 'Acura', b2b: '4 yr/50,000 mi', powertrain: '6 yr/70,000 mi', method: 'UNDEFINED' },
        { brand: 'Audi', b2b: '4 yr/50,000 mi', powertrain: '4 yr/50,000 mi', method: 'UNDEFINED' },
        { brand: 'BMW', b2b: '4 yr/50,000 mi', powertrain: '4 yr/50,000 mi', method: 'UNDEFINED' },
        { brand: 'Buick', b2b: '4 yr/50,000 mi', powertrain: '6 yr/70,000 mi', method: 'UNDEFINED' },
        { brand: 'Cadillac', b2b: '4 yr/50,000 mi', powertrain: '6 yr/70,000 mi', method: 'UNDEFINED' },
        { brand: 'Chevrolet', b2b: '3 yr/36,000 mi', powertrain: '5 yr/100,000 mi', method: 'UNDEFINED' },
        { brand: 'Dodge', b2b: '3 yr/36,000 mi', powertrain: '5 yr/100,000 mi', method: 'UNDEFINED' },
        { brand: 'FIAT', b2b: '4 yr/50,000 mi', powertrain: '4 yr/50,000 mi', method: 'UNDEFINED' },
        { brand: 'Ford', b2b: '3 yr/36,000 mi', powertrain: '5 yr/60,000 mi', method: 'UNDEFINED' },
        { brand: 'GMC', b2b: '3 yr/36,000 mi', powertrain: '5 yr/60,000 mi', method: 'UNDEFINED' },
        { brand: 'Honda', b2b: '3 yr/36,000 mi', powertrain: '5 yr/60,000 mi', method: 'UNDEFINED' },
        { brand: 'Hyundai', b2b: '5 yr/60,000 mi', powertrain: '10 yr/100,000 mi', method: 'UNDEFINED' },
        { brand: 'Infiniti', b2b: '4 yr/60,000 mi', powertrain: '6 yr/70,000 mi', method: 'UNDEFINED' },
        { brand: 'Jeep', b2b: '3 yr/36,000 mi', powertrain: '5 yr/100,000 mi', method: 'UNDEFINED' },
        { brand: 'Land Rover', b2b: '4 yr/50,000 mi', powertrain: '4 yr/50,000 mi', method: 'UNDEFINED' },
        { brand: 'Lexus', b2b: '4 yr/50,000 mi', powertrain: '6 yr/70,000 mi', method: 'UNDEFINED' },
        { brand: 'Mazda', b2b: '3 yr/36,000 mi', powertrain: '5 yr/60,000 mi', method: 'UNDEFINED' },
        { brand: 'Mercedes-Benz', b2b: '4 yr/50,000 mi', powertrain: '4 yr/50,000 mi', method: 'UNDEFINED' },
        { brand: 'MINI', b2b: '4 yr/50,000 mi', powertrain: '4 yr/50,000 mi', method: 'UNDEFINED' },
        { brand: 'Nissan', b2b: '3 yr/36,000 mi', powertrain: '5 yr/60,000 mi', method: 'UNDEFINED' },
        { brand: 'Porsche', b2b: '4 yr/50,000 mi', powertrain: '4 yr/50,000 mi', method: 'UNDEFINED' },
        { brand: 'Subaru', b2b: '3 yr/36,000 mi', powertrain: '5 yr/60,000 mi', method: 'UNDEFINED' },
        { brand: 'Toyota', b2b: '3 yr/36,000 mi', powertrain: '5 yr/60,000 mi', method: 'UNDEFINED' },
        { brand: 'Volkswagen', b2b: '3 yr/36,000 mi', powertrain: '5 yr/60,000 mi', method: 'UNDEFINED' },
        { brand: 'Volvo', b2b: '4 yr/50,000 mi', powertrain: '4 yr/50,000 mi', method: 'UNDEFINED' },
    ];

    // SEQUENTIAL ACCESS TO THE DATA:

    getWarrantyB2b(brand: string): string {
        const warranty = this.warranties.find((w: Warranty) => {
            return w.brand === brand;
        });
        if (!warranty) {
            throw new Error(`Failed to find a bumper-to-bumper warranty for the brand "${brand}"`);
        }
        return warranty.b2b;
    }

    getWarrantyPowertrain(brand: string): string {
        const warranty = this.warranties.find((w: Warranty) => {
            return w.brand === brand;
        });
        if (!warranty) {
            throw new Error(`Failed to find a powertrain warranty for the brand "${brand}"`);
        }
        return warranty.powertrain;
    }

    // ASYNCHRONOUS ACCESS TO THE DATA

    getWarrantyB2bCB(brand: string, resolve: (b2b: string) => void, reject: (err: any) => void): void {
        Th.toDelayedCallback(() => { resolve(this.getWarrantyB2b(brand)); }, reject, 2500);
    }

    getWarrantyB2bAsync(brand: string): Promise<string> {
        return Th.toDelayedPromise(() => this.getWarrantyB2b(brand), 2500);
    }

    getWarrantyPowertrainCB(brand: string, resolve: (powertrain: string) => void, reject: (err: any) => void): void {
        Th.toDelayedCallback(() => { resolve(this.getWarrantyPowertrain(brand)); }, reject, 2500);
    }

    getWarrantyPowertrainAsync(brand: string): Promise<string> {
        return Th.toDelayedPromise(() => this.getWarrantyPowertrain(brand), 2500);
    }
}
