export declare type SeinfeldCharacter = {
    name: string;
    age: number;
    address?: string | null;
    catchphrase?: string | null;
};

export const CosmoKramer: SeinfeldCharacter = {
    name: 'Cosmo Kramer',
    age: 45,
    address: '129 W. 81st Street, Apt. 5B, New York, NY',
    catchphrase: 'Giddy up!'
};

export const SeinfeldCharacters: SeinfeldCharacter[] = [
    {
        name: 'Jerry Seinfeld',
        age: 42,
        address: '129 West 81st Street, Apt. 5A, New York, NY',
        catchphrase: "What's the deal with..."
    },
    {
        name: 'George Costanza',
        age: 41,
        address: '236 W. 63rd Street, Apt. 6E, New York, NY',
        catchphrase: "I'm gonna take you outside and show you what it's like!"
    },
    {
        name: 'Elaine Benes',
        age: 38,
        address: '957 Park Avenue, Apt. 3B, New York, NY',
        catchphrase: 'Get out!'
    },
    {
        name: 'Cosmo Kramer',
        age: 45,
        address: '129 W. 81st Street, Apt. 5B, New York, NY',
        catchphrase: 'Giddy up!'
    },
    {
        name: 'Newman',
        age: 50,
        address: '346 W. 81st Street, Apt. 5F, New York, NY',
        catchphrase: 'Hello, Jerry.'
    },
    {
        name: 'Frank Costanza',
        age: 68,
        address: '119 W. 81st Street, Apt. 5C, New York, NY',
        catchphrase: 'Serenity now!'
    },
    {
        name: 'Estelle Costanza',
        age: 65,
        address: '119 W. 81st Street, Apt. 5C, New York, NY',
        catchphrase: null
    },
    {
        name: 'J. Peterman',
        age: 50,
        address: '721 5th Avenue, New York, NY',
        catchphrase: 'The horror...'
    },
    {
        name: 'Sue Ellen Mischke',
        age: 37,
        address: '177 Riverside Drive, Apt. 3B, New York, NY',
        catchphrase: "It doesn't fit!"
    },
    {
        name: 'Jackie Chiles',
        age: 55,
        address: '1122 Park Avenue, New York, NY',
        catchphrase: "It's outrageous, egregious, preposterous!"
    },
    {
        name: 'Sidra Holland',
        age: 30,
        address: null,
        catchphrase: "They're real and they're spectacular."
    }
];
