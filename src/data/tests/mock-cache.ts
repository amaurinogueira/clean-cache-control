import {  SavePurchases } from "@/domain/usecases"
import { CacheStore } from '@/data/procotols/cache'

export const getCacheExpirationDate = (timestamp: Date): Date => {
    const maxCacheAge = new Date(timestamp)
    maxCacheAge.setDate(maxCacheAge.getDate()-3)
    return maxCacheAge
}

export class CacheStoreSpy implements CacheStore{
    actions: Array<CacheStoreSpy.Action> = []
    // deleteCallsCount = 0
    // insertCallsCount = 0
    deleteKey: string
    insertKey: string
    fetchKey: string 
    insertValues: Array<SavePurchases.Params> = []
    fetchResult: any

    fetch (key: string): any {
        this.actions.push(CacheStoreSpy.Action.fetch)
        // this.deleteCallsCount++
        this.fetchKey = key
        return this.fetchResult
    }
    delete (key: string): void {
        this.actions.push(CacheStoreSpy.Action.delete)
        // this.deleteCallsCount++
        this.deleteKey = key
    }
    insert (key: string, value: any) : void {
        this.actions.push(CacheStoreSpy.Action.insert)
        // this.insertCallsCount++
        this.insertKey = key
        this.insertValues = value
    }
    replace (key: string, value: any) : void {
        this.delete(key)
        this.insert(key, value)
    }
    simulateDeleteError (): void{
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { 
            this.actions.push(CacheStoreSpy.Action.delete)
            throw new Error( )
        })
    }    
    simulateInsertError (): void{
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { 
            this.actions.push(CacheStoreSpy.Action.insert)
            throw new Error( )
        })
    } 
    simulateFetchError (): void{
        jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce(() => { 
            this.actions.push(CacheStoreSpy.Action.fetch)
            throw new Error( )
        })
    } 
}

export namespace CacheStoreSpy {
    export enum Action {
        delete,
        insert,
        fetch
    }
}