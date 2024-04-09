# @fusion-rx/core

This package includes the core of Fusion's application framework,
including its dependency injection functionality, as well as its
built-in routing functionality.

## FsnModules

**FsnModules** configure the injector and the compiler and help organize related things together
by promoting abstraction and information hiding.

A FsnModule class is marked by the `@FsnModule` decorator. `@FsnModule` takes a metadata object
that describes...

-   **providers**: Injectables declared by this module
-   **exports**: Which Injectables are available for use in other modules
-   **imports**: Which

## Injectables
