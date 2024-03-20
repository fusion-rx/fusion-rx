# characters

| pk_name           | age | address                                     | catchphrase                                             |
| ----------------- | --- | ------------------------------------------- | ------------------------------------------------------- |
| Jerry Seinfeld    | 42  | 129 West 81st Street, Apt. 5A, New York, NY | What's the deal with...                                 |
| George Costanza   | 41  | 236 W. 63rd Street, Apt. 6E, New York, NY   | I'm gonna take you outside and show you what it's like! |
| Elaine Benes      | 38  | 957 Park Avenue, Apt. 3B, New York, NY      | Get OUT!                                                |
| Cosmo Kramer      | 45  | 129 W. 81st Street, Apt. 5B, New York, NY   | Giddyup!                                                |
| Newman            | 50  | 346 E. 4th Street, Apt. 5F, New York, NY    | Hello, Jerry.                                           |
| Frank Costanza    | 68  | 119 W. 81st Street, Apt. 5C, New York, NY   | Serenity now!                                           |
| Estelle Costanza  | 65  | 119 W. 81st Street, Apt. 5C, New York, NY   |
| J. Peterman       | 50  | 721 5th Avenue, New York, NY                | The horror...                                           |
| Sue Ellen Mischke | 37  | 177 Riverside Drive, Apt. 3B, New York, NY  | It doesn't fit!                                         |
| Jackie Chiles     | 55  | 1122 Park Avenue, New York, NY              | It's outrageous, egregious, preposterous!               |
| Sidra Holland     | 30  | null                                        | They're real and they're spectacular.                   |

# relationships

| pk_relationship_index | fk_name_a => characters.pk_name | fk_name_b => characters.pk_name | relationship |
| --------------------- | ------------------------------- | ------------------------------- | ------------ |
| 1                     | Jerry Seinfeld                  | George Costanza                 | friends      |
| 2                     | Jerry Seinfeld                  | Elaine Benes                    | friends      |
| 3                     | Jerry Seinfeld                  | Cosmo Kramer                    | friends      |
| 4                     | Jerry Seinfeld                  | Newman                          | arch enemies |
| 5                     | Jerry Seinfled                  | Sidra Holland                   | ex           |
| 6                     | Frank Costanza                  | George Costanza                 | father       |
| 7                     | Estelle Costanza                | George Costanza                 | mother       |
| 8                     | J. Peterman                     | Elaine Benes                    | employer     |
| 9                     | Sue Ellen Mischke               | Elain Benes                     | arch enemies |
| 10                    | Jackie Chiles                   | Cosmo Kramer                    | lawyer       |

# quotes

| pk_quote_index | fk_name => characters.pk_name | quote                                                                                                                                                |
| -------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1              | Jerry Seinfeld                | Looking at cleavage is like looking at the sun. You don't stare at it. It's too risky. Ya get a sense of it and then you look away.                  |
| 2              | Jerry Seinfeld                | Breaking up is like knocking over a Coke machine. You can't do it in one push; you got to rock it back and forth a few times, and then it goes over. |
| 3              | Jerry Seinfeld                | Men want the same thing from their underwear that they want from women: a little bit of support, and a little bit of freedom.                        |
| 4              | Jerry Seinfeld                | So you're enjoying the not enjoying.                                                                                                                 |
| 5              | Jerry Seinfeld                | I was merely speaking extemperaneously.                                                                                                              |
| 6              | Jerry Seinfeld                | And you want to be my latex salesman.                                                                                                                |
| 7              | Jerry Seinfeld                | Shut up ya old bag!                                                                                                                                  |
| 8              | Jerry Seinfeld                | But I don't wanna be a pirate!                                                                                                                       |
| 9              | Jerry Seinfeld                | I choose not to run!                                                                                                                                 |
| 10             | Jerry Seinfeld                | You know how to take the reservation, you just don't know how to hold the reservation!                                                               |
| 11             | Jerry Seinfeld                | Hello, Newman.                                                                                                                                       |
| 12             | George Costanza               | It's not a lie if you believe it.                                                                                                                    |
| 13             | George Costanza               | Jerry, just remember. It's not a lie if you believe it.                                                                                              |
| 14             | George Costanza               | I would drape myself in velvet if it were socially acceptable.                                                                                       |
| 15             | George Costanza               | I lie every second of the day. My whole life is a sham.                                                                                              |
| 16             | George Costanza               | I'm disturbed, I'm depressed, I'm inadequate. I got it all!                                                                                          |
| 17             | George Costanza               | A George divided against itself cannot stand!                                                                                                        |
| 18             | George Costanza               | You're killing independent George!                                                                                                                   |
| 19             | George Costanza               | Oh Noooooo! I'm So Sorry, It's The MOOPS! The Correct Answer Is 'The Moops'                                                                          |
| 20             | Elaine Benes                  | Maybe the dingo ate your baby.                                                                                                                       |
| 21             | Elaine Benes                  | I'm not a lesbian. I hate men, but I'm not a lesbian.                                                                                                |
| 22             | Elaine Benes                  | You can't spare one square?                                                                                                                          |
| 23             | Elaine Benes                  | I'm George... I'M GEORGE!                                                                                                                            |
| 24             | Elaine Benes                  | I don't know how you guys walk around with those things.                                                                                             |
| 25             | Elaine Benes                  | I would put an exclamation at the end of all of these sentences! On this one! And on that one!                                                       |
| 26             | Cosmo Kramer                  | I'm out there, Jerry, and I'm loving every minute of it!                                                                                             |
| 27             | Cosmo Kramer                  | These pretzels are making me thirsty!                                                                                                                |
| 28             | Cosmo Kramer                  | I'm Cosmo Kramer, the Assman!                                                                                                                        |
| 29             | Cosmo Kramer                  | Look away, I'm hideous!                                                                                                                              |
| 30             | Cosmo Kramer                  | Oh no, you gotta eat before surgery. You need your strength!                                                                                         |
| 31             | Cosmo Kramer                  | Jerry, these are load bearing walls!                                                                                                                 |
| 32             | Cosmo Kramer                  | Here's to feeling good all the time.                                                                                                                 |
| 33             | Cosmo Kramer                  | I could raise enough money to cure polio                                                                                                             |
| 34             | Cosmo Kramer                  | I've got the body of a taut pre teen Swedish boy                                                                                                     |
| 35             | Frank Costanza                | I'm like a phoenix, rising from Arizona.                                                                                                             |
| 36             | Frank Costanza                | A FESTIVUS FOR THE REST-OF-US!                                                                                                                       |
| 37             | Frank Costanza                | You want a piece of me? YOU GOT IT!                                                                                                                  |
| 38             | Frank Costanza                | Let me understand, you got the hen, the chicken and the rooster. The rooster goes with the chicken. So, who's having sex with the hen?               |
| 39             | Frank Costanza                | THEY DON'T WANT ME, I DON'T WANT THEM                                                                                                                |
| 40             | Estelle Costanza              | I come home and find my son treating his body like it was an amusement park!                                                                         |
| 41             | Estelle Costanza              | May I ask why?                                                                                                                                       |
| 42             | Estelle Costanza              | We're sitting there like idiots with no cake!                                                                                                        |
| 43             | Estelle Costanza              | As soon as I leave the house, he turns into J. Edgar Hoover!                                                                                         |
| 44             | Jackie Chiles                 | I'm outraged, I'm miffed, and I'm peeved!                                                                                                            |
| 45             | Jackie Chiles                 | This is the most public yet of my many humiliations.                                                                                                 |
