export interface WindowSize {
    width: number
    height: number,
}

export const getWindowSize = (name: 'small' | 'medium'): WindowSize => {
    return {
        small: {
            width: 920,
            height: 600,
        },
        medium: {
            width: 1020,
            height: 660
        }
    }[name]
}

export const closeAsHidden = () => {
    return true
}