export function formatString(value: string, ...args: string[]): string {
    return value.replace(/{(\d+)}/g, (match: string, ix: number) => {
        return typeof args[ix] !== "undefined" ? args[ix] : match
    })
}
