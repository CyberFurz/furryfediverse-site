export function sortInstances(a: any) {
    a.sort(compareInstance)
}

function compareInstance(a: any, b: any) {
    return a.uri.toLowerCase() > b.uri.toLowerCase()
        ? 1
        : a.uri.toLowerCase() < b.uri.toLowerCase()
            ? -1
            : 0
}

export function shuffleArray(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
}