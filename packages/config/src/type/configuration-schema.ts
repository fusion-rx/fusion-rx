export interface ConfigurationSchema<T = any> {
    name: string;
    type?: ConfigurationType;
    docs: string;
    optional?: boolean;
    options?:
        | T[]
        | {
              configName: string;
              optionKey: string;
          };
    settings?: ConfigurationSchema[];
    keys?: ConfigurationSchema[];
}

export type ConfigurationType =
    | 'object-list'
    | 'number-list'
    | 'string-list'
    | 'dropdown'
    | 'multi-dropdown'
    | 'key-value-pairs'
    | 'text'
    | 'category';
