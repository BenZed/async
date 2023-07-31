//// Types ////

/**
 * This function should be returned from an automatic process.
 *
 * If this function is called, the automatic process it was returned from
 * should be aborted.
 */
interface Abort {
    (): void
}

//// Main ////

function onTimeout(func: () => unknown, timeout: number): Abort {
    const id = setTimeout(func, timeout)

    const abortTimeout = () => void clearTimeout(id)
    return abortTimeout
}

function onInterval(func: () => unknown, interval: number): Abort {
    const id = setInterval(func, interval)

    const aboutInterval = () => void clearInterval(id)
    return aboutInterval
}

function onAnimationFrame(func: () => unknown): Abort {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestAnimationFrame = (globalThis as any).requestAnimationFrame

    if (typeof requestAnimationFrame !== 'function') {
        const SIXTY_FRAMES_PER_SECOND = 1000 / 60
        return onInterval(func, SIXTY_FRAMES_PER_SECOND)
    }

    let enabled = true
    const animate = (): void => {
        func()
        if (enabled) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    const abortAnimationFrame = () => void (enabled = false)
    return abortAnimationFrame
}

//// Exports ////

export { onTimeout, onInterval, onAnimationFrame, Abort }
