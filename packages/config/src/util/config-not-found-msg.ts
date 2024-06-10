import { join, joinWith, squish, period } from '@fusion-rx/common';
import { red, yellow } from '@fusion-rx/node';

export const configNotFoundMsg = joinWith(
    '\n',
    join(
        ...red('We were unable to load'),
        squish(...yellow('env.config.json'), ...red('.'))
    ),
    join(
        ...red(
            period(
                'This file should live in the root of your project',
                'and should include configuration settings that apply',
                'to your application on an environment/global level,',
                'such as ports, security key locations, hostnames, and IPs'
            )
        )
    )
);
