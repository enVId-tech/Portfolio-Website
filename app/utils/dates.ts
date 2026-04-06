const dates: { [key: string]: Date } = {
    dev: new Date('2020-04-01'),
    fullStack: new Date('2022-07-01'),
    react: new Date('2022-11-01'),
    next: new Date('2024-02-01')
};

const currentDate: Date = new Date();

export const years = {
    dev: Math.floor((currentDate.getTime() - dates.dev.getTime()) / (1000 * 60 * 60 * 24 * 365)),
    fullStack: Math.floor((currentDate.getTime() - dates.fullStack.getTime()) / (1000 * 60 * 60 * 24 * 365)),
    react: Math.floor((currentDate.getTime() - dates.react.getTime()) / (1000 * 60 * 60 * 24 * 365)),
    next: Math.floor((currentDate.getTime() - dates.next.getTime()) / (1000 * 60 * 60 * 24 * 365)),
}