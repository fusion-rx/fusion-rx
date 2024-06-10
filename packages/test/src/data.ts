export declare type Character = {
    pk_name: string;
    age: number;
    address: string;
    catchphrase: string;
};

export declare type Relationship = {
    index: number;
    fk_name_a: string;
    fk_name_b: string;
    relationship: string;
};

export declare type Quote = {
    index: number;
    fk_name: string;
    quote: string;
};

export declare type Table = Character | Relationship | Quote;

export const data: {
    characters: Character[];
    relationships: Relationship[];
    quotes: Quote[];
} = {
    characters: [
        {
            pk_name: 'Jerry Seinfeld',
            age: 42,
            address: '129 West 81st Street, Apt. 5A, New York, NY',
            catchphrase: "What's the deal with..."
        },
        {
            pk_name: 'George Costanza',
            age: 41,
            address: '236 W. 63rd Street, Apt. 6E, New York, NY',
            catchphrase:
                "I'm gonna take you outside and show you what it's like!"
        },
        {
            pk_name: 'Elaine Benes',
            age: 38,
            address: '957 Park Avenue, Apt. 3B, New York, NY',
            catchphrase: 'Get OUT!'
        },
        {
            pk_name: 'Cosmo Kramer',
            age: 45,
            address: '129 W. 81st Street, Apt. 5B, New York, NY',
            catchphrase: 'Giddyup!'
        },
        {
            pk_name: 'Newman',
            age: 50,
            address: '346 E. 4th Street, Apt. 5F, New York, NY',
            catchphrase: 'Hello, Jerry.'
        },
        {
            pk_name: 'Frank Costanza',
            age: 68,
            address: '119 W. 81st Street, Apt. 5C, New York, NY',
            catchphrase: 'Serenity now!'
        },
        {
            pk_name: 'Estelle Costanza',
            age: 65,
            address: '119 W. 81st Street, Apt. 5C, New York, NY',
            catchphrase: ''
        },
        {
            pk_name: 'J. Peterman',
            age: 50,
            address: '721 5th Avenue, New York, NY',
            catchphrase: 'The horror...'
        },
        {
            pk_name: 'Sue Ellen Mischke',
            age: 37,
            address: '177 Riverside Drive, Apt. 3B, New York, NY',
            catchphrase: "It doesn't fit!"
        },
        {
            pk_name: 'Jackie Chiles',
            age: 55,
            address: '1122 Park Avenue, New York, NY',
            catchphrase: "It's outrageous, egregious, preposterous!"
        },
        {
            pk_name: 'Sidra Holland',
            age: 30,
            address: 'null',
            catchphrase: "They're real and they're spectacular."
        }
    ],
    relationships: [
        {
            index: 1,
            fk_name_a: 'Jerry Seinfeld',
            fk_name_b: 'George Costanza',
            relationship: 'friends'
        },
        {
            index: 2,
            fk_name_a: 'Jerry Seinfeld',
            fk_name_b: 'Elaine Benes',
            relationship: 'friends'
        },
        {
            index: 3,
            fk_name_a: 'Jerry Seinfeld',
            fk_name_b: 'Cosmo Kramer',
            relationship: 'friends'
        },
        {
            index: 4,
            fk_name_a: 'Jerry Seinfeld',
            fk_name_b: 'Newman',
            relationship: 'arch enemies'
        },
        {
            index: 5,
            fk_name_a: 'Jerry Seinfled',
            fk_name_b: 'Sidra Holland',
            relationship: 'ex'
        },
        {
            index: 6,
            fk_name_a: 'Frank Costanza',
            fk_name_b: 'George Costanza',
            relationship: 'father'
        },
        {
            index: 7,
            fk_name_a: 'Estelle Costanza',
            fk_name_b: 'George Costanza',
            relationship: 'mother'
        },
        {
            index: 8,
            fk_name_a: 'J. Peterman',
            fk_name_b: 'Elaine Benes',
            relationship: 'employer'
        },
        {
            index: 9,
            fk_name_a: 'Sue Ellen Mischke',
            fk_name_b: 'Elain Benes',
            relationship: 'arch enemies'
        },
        {
            index: 10,
            fk_name_a: 'Jackie Chiles',
            fk_name_b: 'Cosmo Kramer',
            relationship: 'lawyer'
        }
    ],
    quotes: [
        {
            index: 1,
            fk_name: 'Jerry Seinfeld',
            quote: "Looking at cleavage is like looking at the sun. You don't stare at it. It's too risky. Ya get a sense of it and then you look away."
        },
        {
            index: 2,
            fk_name: 'Jerry Seinfeld',
            quote: "Breaking up is like knocking over a Coke machine. You can't do it in one push; you got to rock it back and forth a few times, and then it goes over."
        },
        {
            index: 3,
            fk_name: 'Jerry Seinfeld',
            quote: 'Men want the same thing from their underwear that they want from women: a little bit of support, and a little bit of freedom.'
        },
        {
            index: 4,
            fk_name: 'Jerry Seinfeld',
            quote: "So you're enjoying the not enjoying."
        },
        {
            index: 5,
            fk_name: 'Jerry Seinfeld',
            quote: 'I was merely speaking extemperaneously.'
        },
        {
            index: 6,
            fk_name: 'Jerry Seinfeld',
            quote: 'And you want to be my latex salesman.'
        },
        {
            index: 7,
            fk_name: 'Jerry Seinfeld',
            quote: 'Shut up ya old bag!'
        },
        {
            index: 8,
            fk_name: 'Jerry Seinfeld',
            quote: "But I don't wanna be a pirate!"
        },
        {
            index: 9,
            fk_name: 'Jerry Seinfeld',
            quote: 'I choose not to run!'
        },
        {
            index: 10,
            fk_name: 'Jerry Seinfeld',
            quote: "You know how to take the reservation, you just don't know how to hold the reservation!"
        },
        {
            index: 11,
            fk_name: 'Jerry Seinfeld',
            quote: 'Hello, Newman.'
        },
        {
            index: 12,
            fk_name: 'George Costanza',
            quote: "It's not a lie if you believe it."
        },
        {
            index: 13,
            fk_name: 'George Costanza',
            quote: "Jerry, just remember. It's not a lie if you believe it."
        },
        {
            index: 14,
            fk_name: 'George Costanza',
            quote: 'I would drape myself in velvet if it were socially acceptable.'
        },
        {
            index: 15,
            fk_name: 'George Costanza',
            quote: 'I lie every second of the day. My whole life is a sham.'
        },
        {
            index: 16,
            fk_name: 'George Costanza',
            quote: "I'm disturbed, I'm depressed, I'm inadequate. I got it all!"
        },
        {
            index: 17,
            fk_name: 'George Costanza',
            quote: 'A George divided against itself cannot stand!'
        },
        {
            index: 18,
            fk_name: 'George Costanza',
            quote: "You're killing independent George!"
        },
        {
            index: 19,
            fk_name: 'George Costanza',
            quote: "Oh Noooooo! I'm So Sorry, It's The MOOPS! The Correct Answer Is 'The Moops'"
        },
        {
            index: 20,
            fk_name: 'Elaine Benes',
            quote: 'Maybe the dingo ate your baby.'
        },
        {
            index: 21,
            fk_name: 'Elaine Benes',
            quote: "I'm not a lesbian. I hate men, but I'm not a lesbian."
        },
        {
            index: 22,
            fk_name: 'Elaine Benes',
            quote: "You can't spare one square?"
        },
        {
            index: 23,
            fk_name: 'Elaine Benes',
            quote: "I'm George... I'M GEORGE!"
        },
        {
            index: 24,
            fk_name: 'Elaine Benes',
            quote: "I don't know how you guys walk around with those things."
        },
        {
            index: 25,
            fk_name: 'Elaine Benes',
            quote: 'I would put an exclamation at the end of all of these sentences! On this one! And on that one!'
        },
        {
            index: 26,
            fk_name: 'Cosmo Kramer',
            quote: "I'm out there, Jerry, and I'm loving every minute of it!"
        },
        {
            index: 27,
            fk_name: 'Cosmo Kramer',
            quote: 'These pretzels are making me thirsty!'
        },
        {
            index: 28,
            fk_name: 'Cosmo Kramer',
            quote: "I'm Cosmo Kramer, the Assman!"
        },
        {
            index: 29,
            fk_name: 'Cosmo Kramer',
            quote: "Look away, I'm hideous!"
        },
        {
            index: 30,
            fk_name: 'Cosmo Kramer',
            quote: 'Oh no, you gotta eat before surgery. You need your strength!'
        },
        {
            index: 31,
            fk_name: 'Cosmo Kramer',
            quote: 'Jerry, these are load bearing walls!'
        },
        {
            index: 32,
            fk_name: 'Cosmo Kramer',
            quote: "Here's to feeling good all the time."
        },
        {
            index: 33,
            fk_name: 'Cosmo Kramer',
            quote: 'I could raise enough money to cure polio'
        },
        {
            index: 34,
            fk_name: 'Cosmo Kramer',
            quote: "I've got the body of a taut pre teen Swedish boy"
        },
        {
            index: 35,
            fk_name: 'Frank Costanza',
            quote: "I'm like a phoenix, rising from Arizona."
        },
        {
            index: 36,
            fk_name: 'Frank Costanza',
            quote: 'A FESTIVUS FOR THE REST-OF-US!'
        },
        {
            index: 37,
            fk_name: 'Frank Costanza',
            quote: 'You want a piece of me? YOU GOT IT!'
        },
        {
            index: 38,
            fk_name: 'Frank Costanza',
            quote: "Let me understand, you got the hen, the chicken and the rooster. The rooster goes with the chicken. So, who's having sex with the hen?"
        },
        {
            index: 39,
            fk_name: 'Frank Costanza',
            quote: "THEY DON'T WANT ME, I DON'T WANT THEM"
        },
        {
            index: 40,
            fk_name: 'Estelle Costanza',
            quote: 'I come home and find my son treating his body like it was an amusement park!'
        },
        {
            index: 41,
            fk_name: 'Estelle Costanza',
            quote: 'May I ask why?'
        },
        {
            index: 42,
            fk_name: 'Estelle Costanza',
            quote: "We're sitting there like idiots with no cake!"
        },
        {
            index: 43,
            fk_name: 'Estelle Costanza',
            quote: 'As soon as I leave the house, he turns into J. Edgar Hoover!'
        },
        {
            index: 44,
            fk_name: 'Jackie Chiles',
            quote: "I'm outraged, I'm miffed, and I'm peeved!"
        },
        {
            index: 45,
            fk_name: 'Jackie Chiles',
            quote: 'This is the most public yet of my many humiliations.'
        }
    ]
};
