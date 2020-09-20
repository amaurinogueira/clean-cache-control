import {CacheStore} from '@/data/procotols/cache'
import { SavePurchases, LoadPurchases } from '@/domain/usecases'


export class LocalLoadPurchases implements SavePurchases {
    private readonly key = 'purchases'

    constructor (
        private readonly cacheStore: CacheStore,
        private readonly timestamp: Date
        ) {}    

   async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    // this.cacheStore.delete('purchases')
    // this.cacheStore.insert('purchases', {
    //     timestamp: this.timestamp,
    //     value: purchases
    // })
    this.cacheStore.replace(this.key, {
        timestamp: this.timestamp,
        value: purchases
    })
}

    async loadAll (): Promise<Array<LoadPurchases.Result>> {
        try{
            const cache = this.cacheStore.fetch(this.key)
            return cache.value
        } catch(error){
            this.cacheStore.delete(this.key)
            return []
        }      
    }
}