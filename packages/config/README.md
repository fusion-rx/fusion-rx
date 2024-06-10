# Fusion.rx Configuration

## Configuration Overloading

Fusion.rx's configuration compiler provides the ability to create
core (base) configuration files and to overload individual settings in that
core configuration file.

### Example

You deploy regularly to two environments: preproduction and production.
Your base configuration file (`core.config.json`) looks like this:

```json
{
    "setting1": "globalVal1",
    "setting2": "globalVal2",
    "ips": {
        "database": "xx.xx.xx.xx",
        "auth-tenant": "xx.xx.xx.xx"
    }
}
```

Within `core.config.json`, `setting1` and `setting2` are global. The only setting that
changes between environments is `ips`.

To manage the different IP addresses without duplicating `setting1` and `setting2`
in prod- and preprod-specific configuration files, create a file for each
that holds only the environment-specific values:

`preprod.config.json`

```json
{
    "ips": {
        "database": "preprod-ip",
        "auth-tenant": "preprod-ip"
    }
}
```

`prod.config.json`

```json
{
    "ips": {
        "database": "prod-ip",
        "auth-tenant": "prod-ip"
    }
}
```

When you compile your configuration and target `prod`, the compiler
will replace `ips` in `core.config.json` with the `ips` defined in `prod.config.json`.
