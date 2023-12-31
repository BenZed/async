import { isFunc, isObject, isNumber, isString } from '@benzed/types'

import milliseconds from './milliseconds'

//// Types ////

type Condition = ((deltaTime: number) => boolean) | (() => boolean)

type TimeoutMessage = string | ((timeout?: number) => string)

interface UntilOptions {
    interval?: number
    timeout?: number
    timeoutMsg?: TimeoutMessage
}

type UntilArgs =
    | [condition: Condition]
    | [condition: Condition, timeout: number]
    | [condition: Condition, timeout: number, interval: number]
    | [
          condition: Condition,
          timeout: number,
          interval: number,
          errMsg: TimeoutMessage
      ]
    | [condition: Condition, timeout: number, timeoutMsg: TimeoutMessage]
    | [condition: Condition, timeoutMsg: TimeoutMessage]
    | [condition: Condition, options: UntilOptions]

//// Constants ////

const DEFAULT_INTERVAL = 25 // ms
const DEFAULT_TIMEOUT = Infinity
const DEFAULT_TIMEOUT_MSG = ((timeout?: number) => {
    throw new Error(`Could not resolve condition in ${timeout} ms`)
}) as TimeoutMessage

//// Helper ////

const sortUntilArgs = (
    args: UntilArgs
): [Condition, number, number, TimeoutMessage] => {
    const [a0, a1, a2, a3] = args

    const condition = a0
    let timeout = DEFAULT_TIMEOUT
    let interval = DEFAULT_INTERVAL
    let timeoutMsg = DEFAULT_TIMEOUT_MSG

    // Find timeoutMsg
    if (isFunc(a1) || isString(a1)) timeoutMsg = a1
    else if (isFunc(a2) || isString(a2)) timeoutMsg = a2
    else if (isFunc(a3) || isFunc(a3)) timeoutMsg = a3

    // Find interval & timeout
    if (isNumber(a1)) {
        timeout = a1

        if (isNumber(a2)) interval = a2

        // Find configuration object
    } else if (isObject<UntilOptions>(a1)) {
        timeout = a1.timeout ?? timeout
        interval = a1.interval ?? interval
        timeoutMsg = a1.timeoutMsg ?? timeoutMsg
    }

    return [condition, timeout, interval, timeoutMsg]
}

//// Main ////

/**
 * Wait until a given condition passes.
 *
 * @returns Total number of milliseconds waited.
 */
async function until(...args: UntilArgs): Promise<number> {
    const [condition, timeout, interval, timeoutMsg] = sortUntilArgs(args)

    const start = Date.now()
    let elapsed = 0

    while (!condition(elapsed)) {
        await milliseconds(interval)

        elapsed = Date.now() - start
        if (elapsed >= timeout) {
            const message = isFunc(timeoutMsg)
                ? timeoutMsg(timeout)
                : timeoutMsg
            throw new Error(message)
        }
    }

    return elapsed
}

//// Exports ////

export default until

export { until, UntilOptions }
