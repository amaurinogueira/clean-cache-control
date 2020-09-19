import { LocalSavePurchases } from '@/data/usecases'
import { mockPurchases, CacheStoreSpy } from '@/data/tests'
import { date } from 'faker'
import { prototype } from 'module'



type SutTypes = {
    sut: LocalSavePurchases
    cacheStore: CacheStoreSpy
}

const  makeSut = (timestamp = new Date()): SutTypes => {
    const cacheStore  = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore, timestamp) 

    return{
    sut,
    cacheStore
    }
}

describe('LocalSavePurchases', () => {
    test('Should not delete or insert cache on sut.init', () => {
        const { cacheStore }  = makeSut()
        //new LocalSavePurchases(cacheStore)
        //expect (cacheStore.deleteCallsCount).toBe(0)
        expect(cacheStore.actions).toEqual([])
    })
    // test('Should delete old cache on sut.save', async() => {
    //     const { cacheStore, sut }  = makeSut()
    //     await sut.save (mockPurchases())
    //     //expect(cacheStore.deleteCallsCount).toBe(1)
    //     expect (cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
    //     expect(cacheStore.deleteKey).toBe('purchases')
    // })
    test('Should not insert new Cache if delete fails', async () => {
        const { cacheStore, sut }  = makeSut()
        cacheStore.simulateDeleteError()
        const promise = sut.save (mockPurchases())
        //expect(cacheStore.insertCallsCount).toBe(0)
        expect (cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
        await expect(promise).rejects.toThrow()
        
    })
    test('Should insert new Cache if delete succeds', async() => {
        const timestamp = new Date()
        const { cacheStore, sut }  = makeSut(timestamp)
        const purchases = mockPurchases()
        const promise = sut.save (purchases)
        // expect(cacheStore.deleteCallsCount).toBe(1)
        // expect(cacheStore.insertCallsCount).toBe(1)
        expect (cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
        expect(cacheStore.deleteKey).toBe('purchases')
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual({
            timestamp,
            value: purchases
        })
        await expect(promise).resolves.toBeFalsy()        
    })
    test('Should throw if insert throws', async () => {
        const { cacheStore, sut }  = makeSut()
        cacheStore.simulateInsertError()
        const promise = sut.save (mockPurchases())
        expect (cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
        await expect(promise).rejects.toThrow()
        
    })
})
