export declare type ParcelBuildOptimizers = {
    dataUrl: {
        'data-url:*': ['...', '@parcel/optimizer-data-url'];
    };
    image: {
        '*.{jpg,jpeg,png}': ['@parcel/optimizer-image'];
    };
    svg: {
        '*.svg': ['@parcel/optimizer-svgo'];
    };
    javascript: {
        '*.{js,mjs,cjs}': ['@parcel/optimizer-swc'];
    };
    html: {
        '*.{html,xhtml}': ['@parcel/optimizer-htmlnano'];
    };
    css: {
        '*.css': ['@parcel/optimizer-css'];
    };
};
