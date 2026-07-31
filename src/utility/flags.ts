import { FlagsEnum } from "src/common/constants/flags.enum";

export const Flags = {
    set: (value: number, flag: number): number => value | flag,

    remove: (value: number, flag: number): number => value & ~flag,

    has: (value: number, flag: number): boolean => (value & flag) !== 0,

    getKey: (flag: number, flagsEnum = FlagsEnum): string => flagsEnum[flag],

    getName: (key: string): string => key.toLowerCase().replaceAll('_', '-'),

    getKeyName: (flag: number, flagsEnum: any = FlagsEnum): string =>
        (flagsEnum[flag] as string)?.toLowerCase().replaceAll('_', '-'),

    convertNameToKey: (name: string): string => name.toUpperCase().replaceAll('-', '_'),
};
