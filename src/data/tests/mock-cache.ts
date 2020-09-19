import { SavePurchases } from "@/domain/usecases"
import { CacheStore } from '@/data/procotols/cache'

export class CacheStoreSpy implements CacheStore{
    actions: Array<CacheStoreSpy.Action> = []
    // deleteCallsCount = 0
    // insertCallsCount = 0
    deleteKey: string
    insertKey: string
    insertValues: Array<SavePurchases.Params> = []

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
}

export namespace CacheStoreSpy {
    export enum Action {
        delete,
        insert
    }
}