import { milliseconds } from './milliseconds'

/**
 * Wait until next tick.
 */
const untilNextTick = () => milliseconds(0)

//// Exports ////

export default untilNextTick

export { untilNextTick }
