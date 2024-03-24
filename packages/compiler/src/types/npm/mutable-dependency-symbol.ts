import { SourceLocation } from './dependency';
import { JSONObject } from '../json';

type Mutable = [
    Symbol,
    {
        local: Symbol;
        loc: SourceLocation | null | undefined;
        /** the symbol is not used by the parent asset itself and is merely reexported */
        isWeak: boolean;
        meta?: JSONObject | null | undefined;
    }
];

export interface MutableDependencySymbols extends Iterable<Mutable> {
    /**
     * The symbols taht are imports are unknown, rather than just empty.
     * This is the default state.
     */
    readonly isCleared: boolean;

    /**
     * Initilizes the map, sets isCleared to false.
     */
    ensure(): void;

    get(exportSymbol: Symbol):
        | {
              local: Symbol;
              loc: SourceLocation | null | undefined;
              isWeak: boolean;
              meta?: JSONObject | null | undefined;
          }
        | null
        | undefined;
    set(
        exportSymbol: Symbol,
        local: Symbol,
        loc: SourceLocation | null | undefined,
        isWeak: boolean | null | undefined
    ): void;
    delete(exportSymbol: Symbol): void;
    hasExportSymbol(exportSymbol: Symbol): boolean;
    hasLocalSymbol(local: Symbol): boolean;
    exportSymbols(): Iterable<Symbol>;
}
