import { through } from '@benzed/util'
import { Guarantee } from './guarantee'
import milliseconds from './milliseconds'

import { it, expect } from '@jest/globals'

//// Tests ////

it('returns a callable object', async () => {
    const guarantee = new Guarantee(async () => {
        await milliseconds(50)
        return 'Complete!'
    })

    const result = await guarantee()
    expect(result).toEqual('Complete!')
})

it('multiple invocations result in the same promise', async () => {
    let calls = 0

    const guarantee = new Guarantee(async () => {
        calls++
        await milliseconds(50)
    })

    await Promise.all([guarantee(), guarantee(), guarantee()])

    expect(calls).toBe(1)
})

it('throws on errors', async () => {
    const guarantee = new Guarantee(async () => {
        await milliseconds(10)
        throw new Error('Damage!')
    })

    const result = await guarantee().catch(through)

    expect(result).toHaveProperty('message', 'Damage!')
})

it('type safe state methods', () => {
    const guarantee = new Guarantee(() => 0)
    if (guarantee.isIdle()) guarantee.state satisfies { status: 'idle' }

    if (guarantee.isPending())
        guarantee.state satisfies {
            status: 'pending'
            promise: Promise<0>
        }

    if (guarantee.isRejected())
        guarantee.state satisfies {
            status: 'pending'
            promise: Promise<0>
        }

    if (guarantee.isResolved())
        guarantee.state satisfies {
            status: 'pending'
            promise: Promise<0>
        }

    if (guarantee.isFulfilled())
        guarantee.state satisfies {
            status: 'pending'
            promise: Promise<0>
        }
})
