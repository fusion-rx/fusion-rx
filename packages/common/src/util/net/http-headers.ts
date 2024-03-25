/**
 * [Internet Assigned Numbers Authority (IANA) Hypertext Transfer Protocol (HTTP) Field Name Registry](https://www.iana.org/assignments/http-fields/http-fields.xhtml)
 */
export declare interface HttpHeaders {
    /**
     * [RFC 3229: Delta encoding in HTTP](https://www.iana.org/go/rfc3229)
     */
    'A-IM'?: string;

    /**
     * [RFC9110, Section 12.5.1: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Accept?: string;

    /**
     * [RFC 2324: Hyper Text Coffee Pot Control Protocol (HTCPCP/1.0)](https://www.iana.org/go/rfc2324)
     **/
    'Accept-Additions'?: string;

    /**
     * [RFC 8942, Section 3.1: HTTP Client Hints](https://www.iana.org/go/rfc8942)
     **/
    'Accept-CH'?: string;

    /**
     * [RFC9110, Section 12.5.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     * @depracated
     **/
    'Accept-Charset'?: string;

    /**
     * [RFC 7089: HTTP Framework for Time-Based Access to Resource States -- Memento](https://www.iana.org/go/rfc7089)
     **/
    'Accept-Datetime'?: string;

    /**
     * [RFC9110, Section 12.5.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Accept-Encoding'?: string;

    /**
     * [RFC 2295: Transparent Content Negotiation in HTTP](https://www.iana.org/go/rfc2295)
     **/
    'Accept-Features'?: string;

    /**
     * [RFC9110, Section 12.5.4: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Accept-Language'?: string;

    /**
     * [RFC 5789: PATCH Method for HTTP](https://www.iana.org/go/rfc5789)
     **/
    'Accept-Patch'?: string;

    /**
     * [Linked Data Platform 1.0](https://www.w3.org/TR/ldp)
     * [perm/accept-post](perm/accept-post)
     **/
    'Accept-Post'?: string;

    /**
     * [RFC9110, Section 14.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Accept-Ranges'?: string;

    /**
     * [RFC-ietf-httpbis-message-signatures-19, Section 5.1: HTTP Message Signatures](https://www.iana.org/go/draft-ietf-httpbis-message-signatures-19)
     **/
    'Accept-Signature'?: string;

    /**
     * [Access Control for Cross-site Requests](https://www.w3.org/TR/2007/WD-access-control-20071126/#access-control0)
     * @obsoleted
     **/
    'Access-Control'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#http-access-control-allow-credentials)
     **/
    'Access-Control-Allow-Credentials'?: string;

    /*
     * [Fetch](https://fetch.spec.whatwg.org/#http-access-control-allow-headers)
     **/
    'Access-Control-Allow-Headers'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#http-access-control-allow-methods)
     **/
    'Access-Control-Allow-Methods'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#http-access-control-allow-origin)
     **/
    'Access-Control-Allow-Origin'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#http-access-control-expose-headers)
     **/
    'Access-Control-Expose-Headers'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#http-access-control-max-age)
     **/
    'Access-Control-Max-Age'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#http-access-control-request-headers)
     **/
    'Access-Control-Request-Headers'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#http-access-control-request-method)
     **/
    'Access-Control-Request-Method'?: string;

    /**
     * [RFC9111, Section 5.1: HTTP Caching](https://www.iana.org/go/rfc9111)
     **/
    Age?: string;

    /**
     * [RFC9110, Section 10.2.1: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Allow?: string;

    /**
     * [RFC 7639, Section 2: The ALPN HTTP Header Field](https://www.iana.org/go/rfc7639)
     **/
    ALPN?: string;

    /**
     * [RFC 7838: HTTP Alternative Services](https://www.iana.org/go/rfc7838)
     **/
    'Alt-Svc'?: string;

    /**
     * [RFC 7838: HTTP Alternative Services](https://www.iana.org/go/rfc7838)
     **/
    'Alt-Used'?: string;

    /**
     * [RFC 2295: Transparent Content Negotiation in HTTP](https://www.iana.org/go/rfc2295)
     **/
    Alternates?: string;

    /**
     * [AMP-Cache-Transform HTTP request header](https://github.com/ampproject/amphtml/blob/main/docs/spec/amp-cache-transform.md)
     * @provisional
     **/
    'AMP-Cache-Transform'?: string;

    /**
     * [RFC 4437: Web Distributed Authoring and Versioning (WebDAV) Redirect Reference Resources](https://www.iana.org/go/rfc4437)
     **/
    'Apply-To-Redirect-Ref'?: string;

    /**
     * [RFC 8053, Section 4: HTTP Authentication Extensions for Interactive Clients](https://www.iana.org/go/rfc8053)
     **/
    'Authentication-Control'?: string;

    /**
     * [RFC9110, Section 11.6.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Authentication-Info'?: string;

    /**
     * [RFC9110, Section 11.6.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Authorization?: string;

    /**
     * [RFC 2774: An HTTP Extension Framework](https://www.iana.org/go/rfc2774)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)
     * @obsoleted
     **/
    'C-Ext'?: string;

    /**
     * [RFC 2774: An HTTP Extension Framework](https://www.iana.org/go/rfc2774)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)
     * @obsoleted
     **/
    'C-Man'?: string;

    /**
     * [RFC 2774: An HTTP Extension Framework](https://www.iana.org/go/rfc2774)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)@obsoleted
     **/
    'C-Opt'?: string;

    /**
     * @obsoleted
     * [PEP - an Extension Mechanism for HTTP](https://www.w3.org/TR/WD-http-pep)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)
     **/
    'C-PEP'?: string;

    /**
     * @depracated
     * [PEP - an Extension Mechanism for HTTP](https://www.w3.org/TR/WD-http-pep)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)
     **/
    'C-PEP-Info'?: string;

    /**
     * [RFC9111, Section 5.2](https://www.iana.org/go/rfc9111)
     **/
    'Cache-Control'?: string;

    /**
     * [RFC9211: The Cache-Status HTTP Response Header Field](https://www.iana.org/go/rfc9211)
     **/
    'Cache-Status'?: string;

    /**
     * [RFC 8607, Section 5.1: Calendaring Extensions to WebDAV (CalDAV): Managed Attachments](https://www.iana.org/go/rfc8607)
     **/
    'Cal-Managed-ID'?: string;

    /**
     * [RFC 7809, Section 7.1: Calendaring Extensions to WebDAV (CalDAV): Time Zones by Reference](https://www.iana.org/go/rfc7809)
     **/
    'CalDAV-Timezones'?: string;

    /**
     * [RFC9297](https://www.iana.org/go/rfc9297)
     **/
    'Capsule-Protocol'?: string;

    /**
     * "Cache": string, directives targeted at content delivery networks
     * [RFC9213: Targeted HTTP Cache Control](https://www.iana.org/go/rfc9213)
     **/
    'CDN-Cache-Control'?: string;

    /**
     * [RFC 8586: Loop Detection in Content Delivery Networks (CDNs)](https://www.iana.org/go/rfc8586)
     **/
    'CDN-Loop'?: string;

    /**
     * [RFC 8739, Section 3.3: Support for Short-Term, Automatically Renewed (STAR) Certificates in the Automated Certificate Management Environment (ACME)](https://www.iana.org/go/rfc8739)
     **/
    'Cert-Not-After'?: string;

    /**
     * [RFC 8739, Section 3.3: Support for Short-Term, Automatically Renewed (STAR) Certificates in the Automated Certificate Management Environment (ACME)](https://www.iana.org/go/rfc8739)
     **/
    'Cert-Not-Before'?: string;

    /**
     * [Clear Site Data](https://w3.org/TR/clear-site-data/#header)
     **/
    'Clear-Site-Data'?: string;

    /**
     * [RFC9440, Section 2: Client-Cert HTTP Header Field](https://www.iana.org/go/rfc9440)
     **/
    'Client-Cert'?: string;

    /**
     * [RFC9440, Section 2: Client-Cert HTTP Header Field](https://www.iana.org/go/rfc9440)
     **/
    'Client-Cert-Chain'?: string;

    /**
     * [RFC9112, Section 9.6: HTTP/1.1](https://www.iana.org/go/rfc9112)
     * @reserved
     **/
    Close?: string;

    /**
     * [OSLC Configuration Management Version 1.0. Part 3: Configuration Specification](https://docs.oasis-open-projects.org/oslc-op/config/v1.0/psd01/config-resources.html#configcontext)
     * @provisional
     **/
    'Configuration-Context'?: string;

    /**
     * [RFC9110, Section 7.6.1: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Connection?: string;

    /**
     * [RFC 2068: Hypertext Transfer Protocol -- HTTP/1.1](https://www.iana.org/go/rfc2068)
     * [RFC 2616: Hypertext Transfer Protocol -- HTTP/1.1](https://www.iana.org/go/rfc2616)
     * @obsoleted
     **/
    'Content-Base'?: string;

    /**
     * [RFC-ietf-httpbis-digest-headers-13, Section 2: Digest Fields](https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13)
     **/
    'Content-Digest'?: string;

    /**
     * [RFC 6266: Use of the Content-Disposition Header Field in the Hypertext Transfer Protocol (HTTP)](https://www.iana.org/go/rfc6266)
     **/
    'Content-Disposition'?: string;

    /**
     * [RFC9110, Section 8.4: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Content-Encoding'?: string;

    /**
     * [The HTTP Distribution and Replication Protocol](https://www.w3.org/TR/NOTE-drp)
     * @depracated
     **/
    'Content-ID'?: string;

    /**
     * [RFC9110, Section 8.5: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Content-Language'?: string;

    /**
     * [RFC9110, Section 8.6: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Content-Length'?: string;

    /**
     * [RFC9110, Section 8.7: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Content-Location'?: string;

    /**
     * [RFC 2616, Section 14.15: Hypertext Transfer Protocol -- HTTP/1.1](https://www.iana.org/go/rfc2616)
     * [RFC 7231, Appendix B: Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content](https://www.iana.org/go/rfc7231)
     * @obsoleted
     **/
    'Content-MD5'?: string;

    /**
     * [RFC9110, Section 14.4: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Content-Range'?: string;

    /**
     * [HTML 4.01 Specification](https://www.w3.org/TR/html401)
     * @obsoleted
     **/
    'Content-Script-Type'?: string;

    /**
     * [Content Security Policy Level 3](https://www.w3.org/TR/CSP/#csp-header)
     **/
    'Content-Security-Policy'?: string;

    /**
     * [Content Security Policy Level 3](https://www.w3.org/TR/CSP/#cspro-header)
     **/
    'Content-Security-Policy-Report-Only'?: string;

    /**
     * [HTML 4.01 Specification](https://www.w3.org/TR/html401)
     * @obsoleted
     **/
    'Content-Style-Type'?: string;

    /**
     * [RFC9110, Section 8.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Content-Type'?: string;

    /**
     * [RFC 2068: Hypertext Transfer Protocol -- HTTP/1.1](https://www.iana.org/go/rfc2068)
     * @obsoleted
     **/
    'Content-Version'?: string;

    /**
     * [RFC 6265: HTTP State Management Mechanism](https://www.iana.org/go/rfc6265)
     **/
    Cookie?: string;

    /**
     * [RFC 2965: HTTP State Management Mechanism](https://www.iana.org/go/rfc2965)
     * [RFC 6265: HTTP State Management Mechanism](https://www.iana.org/go/rfc6265)
     * @obsoleted
     **/
    Cookie2?: string;

    /**
     * [HTML](https://html.spec.whatwg.org/multipage/origin.html#cross-origin-embedder-policy)
     **/
    'Cross-Origin-Embedder-Policy'?: string;

    /**
     * [HTML](https://html.spec.whatwg.org/multipage/origin.html#cross-origin-embedder-policy-report-only)
     **/
    'Cross-Origin-Embedder-Policy-Report-Only'?: string;

    /**
     * [HTML](https://html.spec.whatwg.org/multipage/origin.html#cross-origin-opener-policy-2)
     **/
    'Cross-Origin-Opener-Policy'?: string;

    /**
     * [HTML](https://html.spec.whatwg.org/multipage/origin.html#cross-origin-opener-policy-report-only)
     **/
    'Cross-Origin-Opener-Policy-Report-Only'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#cross-origin-resource-policy-header)
     **/
    'Cross-Origin-Resource-Policy'?: string;

    /**
     * [RFC 5323: Web Distributed Authoring and Versioning (WebDAV) SEARCH](https://www.iana.org/go/rfc5323)
     **/
    DASL?: string;

    /**
     * [RFC9110, Section 6.6.1: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Date?: string;

    /**
     * [RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)](https://www.iana.org/go/rfc4918)
     **/
    DAV?: string;

    /**
     * [HTML 4.01 Specification](https://www.w3.org/TR/html401)
     * @obsoleted
     **/
    'Default-Style'?: string;

    /**
     * [RFC 3229: Delta encoding in HTTP](https://www.iana.org/go/rfc3229)
     **/
    'Delta-Base'?: string;

    /**
     * [RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)](https://www.iana.org/go/rfc4918)
     **/
    Depth?: string;

    /**
     * [RFC 2068: Hypertext Transfer Protocol -- HTTP/1.1](https://www.iana.org/go/rfc2068)
     * @obsoleted
     **/
    'Derived-From'?: string;

    /**
     * [RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)](https://www.iana.org/go/rfc4918)
     **/
    Destination?: string;

    /**
     * [The HTTP Distribution and Replication Protocol](https://www.w3.org/TR/NOTE-drp)
     * @depracated
     **/
    'Differential-ID'?: string;

    /**
     * [RFC 3230: Instance Digests in HTTP](https://www.iana.org/go/rfc3230)
     * [RFC-ietf-httpbis-digest-headers-13, Section 1.3: Digest Fields](https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13)
     * @obsoleted
     **/
    Digest?: string;

    /**
     * [RFC9449: OAuth 2.0 Demonstrating Proof of Possession (DPoP)](https://www.iana.org/go/rfc9449)
     **/
    DPoP?: string;

    /**
     * [RFC9449: OAuth 2.0 Demonstrating Proof of Possession (DPoP)](https://www.iana.org/go/rfc9449)
     **/
    'DPoP-Nonce'?: string;

    /**
     * [RFC 8470: Using Early Data in HTTP](https://www.iana.org/go/rfc8470)
     **/
    'Early-Data'?: string;

    /**
     * [RFC 6017: Electronic Data Interchange - Internet Integration (EDIINT) Features Header Field](https://www.iana.org/go/rfc6017)
     * @provisional
     **/
    'EDIINT-Features'?: string;

    /**
     * [RFC9110, Section 8.8.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    ETag?: string;

    /**
     * [RFC9110, Section 10.1.1: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Expect?: string;

    /**
     * [RFC9163: Expect-CT Extension for HTTP](https://www.iana.org/go/rfc9163)
     **/
    'Expect-CT'?: string;

    /**
     * [RFC9111, Section 5.3: HTTP Caching](https://www.iana.org/go/rfc9111)
     **/
    Expires?: string;

    /**
     * [RFC 2774: An HTTP Extension Framework](https://www.iana.org/go/rfc2774)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)
     * @obsoleted
     **/
    Ext?: string;

    /**
     * [RFC 7239: Forwarded HTTP Extension](https://www.iana.org/go/rfc7239)
     **/
    Forwarded?: string;

    /**
     * [RFC9110, Section 10.1.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    From?: string;

    /**
     * [Implementation of OPS Over HTTP](https://www.w3.org/TR/NOTE-OPS-OverHTTP)
     * @obsoleted
     **/
    GetProfile?: string;

    /**
     * [RFC 7486, Section 6.1.1: HTTP Origin-Bound Authentication (HOBA)](https://www.iana.org/go/rfc7486)
     **/
    Hobareg?: string;

    /**
     * [RFC9110, Section 7.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Host?: string;

    /**
     * [RFC 7540, Section 3.2.1: Hypertext Transfer Protocol Version 2 (HTTP/2)](https://www.iana.org/go/rfc7540)
     * @obsoleted
     **/
    'HTTP2-Settings'?: string;

    /**
     * [RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)](https://www.iana.org/go/rfc4918)
     **/
    If?: string;

    /**
     * [RFC9110, Section 13.1.1: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'If-Match'?: string;

    /**
     * [RFC9110, Section 13.1.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'If-Modified-Since'?: string;

    /**
     * [RFC9110, Section 13.1.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'If-None-Match'?: string;

    /**
     * [RFC9110, Section 13.1.5: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'If-Range'?: string;

    /**
     * [RFC 6338: Scheduling Extensions to CalDAV](https://www.iana.org/go/rfc6638)
     */
    'If-Schedule-Tag-Match'?: string;

    /**
     * [RFC9110, Section 13.1.4: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'If-Unmodified-Since'?: string;

    /**
     * [RFC 3229: Delta encoding in HTTP](https://www.iana.org/go/rfc3229)
     **/
    IM?: string;

    /**
     * [RFC 8473: Token Binding over HTTP](https://www.iana.org/go/rfc8473)
     **/
    'Include-Referred-Token-Binding-ID'?: string;

    /**
     * [OData Version 4.01 Part 1: Protocol](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_HeaderIsolationODataIsolation)
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [prov/isolation](prov/isolation)
     * @provisional
     **/
    Isolation?: string;

    /**
     * [RFC 2068: Hypertext Transfer Protocol -- HTTP/1.1](https://www.iana.org/go/rfc2068)
     **/
    'Keep-Alive'?: string;

    /**
     * [RFC 3253: Versioning Extensions to WebDAV: (Web Distributed Authoring and Versioning)](https://www.iana.org/go/rfc3253)
     **/
    Label?: string;

    /**
     * [HTML](https://html.spec.whatwg.org/multipage/server-sent-events.html#last-event-id)
     **/
    'Last-Event-ID'?: string;

    /**
     * [RFC9110, Section 8.8.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Last-Modified'?: string;

    /**
     * [RFC 8288: Web Linking](https://www.iana.org/go/rfc8288)
     **/
    Link?: string;

    /**
     * [RFC9110, Section 10.2.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Location?: string;

    /**
     * [RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)](https://www.iana.org/go/rfc4918)
     **/
    'Lock-Token'?: string;

    /**
     * [RFC 2774: An HTTP Extension Framework](https://www.iana.org/go/rfc2774)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)
     * @obsoleted
     **/
    Man?: string;

    /**
     * [RFC9110, Section 7.6.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Max-Forwards'?: string;

    /**
     * [RFC 7089: HTTP Framework for Time-Based Access to Resource States -- Memento](https://www.iana.org/go/rfc7089)
     **/
    'Memento-Datetime'?: string;

    /**
     * [RFC 2227: Simple Hit-Metering and Usage-Limiting for HTTP](https://www.iana.org/go/rfc2227)
     **/
    Meter?: string;

    /**
     * [Access Control for Cross-site Requests](https://www.w3.org/TR/2007/WD-access-control-20071126/#method-check)
     * @obsoleted
     **/
    'Method-Check'?: string;

    /**
     * [Access Control for Cross-site Requests](https://www.w3.org/TR/2007/WD-access-control-20071126/#method-check-expires)
     * @obsoleted
     **/
    'Method-Check-Expires'?: string;

    /**
     * [RFC9112, Appendix B.1: HTTP/1.1](https://www.iana.org/go/rfc9112)
     **/
    'MIME-Version'?: string;

    /**
     * [RFC 2295: Transparent Content Negotiation in HTTP](https://www.iana.org/go/rfc2295)
     **/
    Negotiate?: string;

    /**
     * [Network Error Logging](https://www.w3.org/TR/network-error-logging/)
     **/
    NEL?: string;

    /**
     * [OData Version 4.01 Part 1: Protocol](http://docs.oasis-open.org/odata/odata/v4.01/csprd05/part1-protocol/odata-v4.01-csprd05-part1-protocol.html#_Toc14172735)
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [perm/odata-entityid](perm/odata-entityid)
     **/
    'OData-EntityId'?: string;

    /**
     * [OData Version 4.01 Part 1: Protocol](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_HeaderIsolationODataIsolation)
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [perm/odata-isolation](perm/odata-isolation)
     **/
    'OData-Isolation'?: string;

    /**
     * [OData Version 4.01 Part 1: Protocol](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_HeaderODataMaxVersion)
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [perm/odata-maxversion](perm/odata-maxversion)
     **/
    'OData-MaxVersion'?: string;

    /**
     * [OData Version 4.01 Part 1: Protocol](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_HeaderODataVersion)
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [perm/odata-version](perm/odata-version)
     **/
    'OData-Version'?: string;

    /**
     * [RFC 2774: An HTTP Extension Framework](https://www.iana.org/go/rfc2774)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)
     * @obsoleted
     **/
    Opt?: string;

    /**
     * [RFC 8053, Section 3: HTTP Authentication Extensions for Interactive Clients](https://www.iana.org/go/rfc8053)
     **/
    'Optional-WWW-Authenticate'?: string;

    /**
     * [RFC 3648: Web Distributed Authoring and Versioning (WebDAV) Ordered Collections Protocol](https://www.iana.org/go/rfc3648)
     **/
    'Ordering-Type'?: string;

    /**
     * [RFC 6454: The Web Origin Concept](https://www.iana.org/go/rfc6454)
     **/
    Origin?: string;

    /**
     * [HTML](https://html.spec.whatwg.org/multipage/origin.html#origin-agent-cluster)
     **/
    'Origin-Agent-Cluster'?: string;

    /**
     * [RFC 8613, Section 11.1: Object Security for Constrained RESTful Environments (OSCORE)](https://www.iana.org/go/rfc8613)
     **/
    OSCORE?: string;

    /**
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [OASIS Project Specification 01](https://docs.oasis-open-projects.org/oslc-op/core/v3.0/oslc-core.html)
     **/
    'OSLC-Core-Version'?: string;

    /**
     * [RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)](https://www.iana.org/go/rfc4918)
     **/
    Overwrite?: string;

    /**
     * [The Platform for Privacy Preferences 1.0 (P3P1.0) Specification](https://www.w3.org/TR/P3P)
     * @obsoleted
     **/
    P3P?: string;

    /**
* [PEP - an Extension Mechanism for HTTP](http://www.w3.org/TR/WD-http-pep)

 * @obsoleted
 **/
    PEP?: string;

    /**
     * [PEP - an Extension Mechanism for HTTP](http://www.w3.org/TR/WD-http-pep)
     * @obsoleted
     **/
    'PEP-Info'?: string;

    /**
     * [Permissions Policy]( https://w3c.github.io/webappsec-permissions-policy)
     * @provisional
     **/
    'Permissions-Policy'?: string;

    /**
     * [PICS Label Distribution Label Syntax and Communication Protocols](https://www.w3.org/TR/REC-PICS-labels-961031)
     * @obsoleted
     **/
    'PICS-Label'?: string;

    /**
     * [HTML](https://html.spec.whatwg.org/multipage/links.html#ping-from)
     **/
    'Ping-From'?: string;

    /**
     * [HTML](https://html.spec.whatwg.org/multipage/links.html#ping-to)
     **/
    'Ping-To'?: string;

    /**
     * [RFC 3648: Web Distributed Authoring and Versioning (WebDAV) Ordered Collections Protocol](https://www.iana.org/go/rfc3648)
     **/
    Position?: string;

    /**
     * [RFC9111, Section 5.4: HTTP Caching](https://www.iana.org/go/rfc9111)
     * @depracated
     **/
    Pragma?: string;

    /**
     * [RFC 7240: Prefer Header for HTTP](https://www.iana.org/go/rfc7240)
     **/
    Prefer?: string;

    /**
     * [RFC 7240: Prefer Header for HTTP](https://www.iana.org/go/rfc7240)
     **/
    'Preference-Applied'?: string;

    /**
     * [RFC9218: Extensible Prioritization Scheme for HTTP](https://www.iana.org/go/rfc9218)
     **/
    Priority?: string;

    /**
     * [Implementation of OPS Over HTTP](https://www.w3.org/TR/NOTE-OPS-OverHTTP)
     * @obsoleted
     **/
    ProfileObject?: string;

    /**
     * [PICS Label Distribution Label Syntax and Communication Protocols](https://www.w3.org/TR/REC-PICS-labels-961031)
     * @obsoleted
     **/
    Protocol?: string;

    /**
     * [White Paper: Joint Electronic Payment Initiative](https://www.w3.org/TR/NOTE-jepi)
     * @depracated
     **/
    'Protocol-Info'?: string;

    /**
     * [White Paper: Joint Electronic Payment Initiative](https://www.w3.org/TR/NOTE-jepi)
     * @depracated
     **/
    'Protocol-Query'?: string;

    /**
     * [PICS Label Distribution Label Syntax and Communication Protocols](https://www.w3.org/TR/REC-PICS-labels-961031)
     * @obsoleted
     **/
    'Protocol-Request'?: string;

    /**
     * [RFC9110, Section 11.7.1: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Proxy-Authenticate'?: string;

    /**
     * [RFC9110, Section 11.7.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Proxy-Authentication-Info'?: string;

    /**
     * [RFC9110, Section 11.7.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Proxy-Authorization'?: string;

    /**
     * [Notification for Proxy Caches](https://www.w3.org/TR/WD-proxy.html)
     * @obsoleted
     **/
    'Proxy-Features'?: string;

    /**
     * [Notification for Proxy Caches](https://www.w3.org/TR/WD-proxy.html)
     * @obsoleted
     **/
    'Proxy-Instruction'?: string;

    /**
     * [RFC9209: The Proxy-Status HTTP Response Header Field](https://www.iana.org/go/rfc9209)
     **/
    'Proxy-Status'?: string;

    /**
     * [RFC 2068: Hypertext Transfer Protocol -- HTTP/1.1](https://www.iana.org/go/rfc2068)
     * @obsoleted
     **/
    Public?: string;

    /**
     * [RFC 7469: Public Key Pinning Extension for HTTP](https://www.iana.org/go/rfc7469)
     **/
    'Public-Key-Pins'?: string;

    /**
     * [RFC 7469: Public Key Pinning Extension for HTTP](https://www.iana.org/go/rfc7469)
     **/
    'Public-Key-Pins-Report-Only'?: string;

    /**
     * [RFC9110, Section 14.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Range?: string;

    /**
     * [RFC 4437: Web Distributed Authoring and Versioning (WebDAV) Redirect Reference Resources](https://www.iana.org/go/rfc4437)
     **/
    'Redirect-Ref'?: string;

    /**
     * [RFC9110, Section 10.1.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Referer?: string;

    /**
     * [Access Control for Cross-site Requests](https://www.w3.org/TR/2007/WD-access-control-20071126/#referer-root)
     * @obsoleted
     **/
    'Referer-Root'?: string;

    /**
     * [HTML](https://html.spec.whatwg.org/multipage/browsing-the-web.html#refresh)
     **/
    Refresh?: string;

    /**
     * [Repeatable Requests Version 1.0](https://docs.oasis-open.org/odata/repeatable-requests/v1.0/cs01/repeatable-requests-v1.0-cs01.html)
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [prov/repeatability-client-id](prov/repeatability-client-id)
     * @provisional
     **/
    'Repeatability-Client-ID'?: string;

    /**
     * [Repeatable Requests Version 1.0](https://docs.oasis-open.org/odata/repeatable-requests/v1.0/cs01/repeatable-requests-v1.0-cs01.html)
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [prov/repeatability-first-sent](prov/repeatability-first-sent)
     * @provisional
     **/
    'Repeatability-First-Sent'?: string;

    /**
     * [Repeatable Requests Version 1.0](https://docs.oasis-open.org/odata/repeatable-requests/v1.0/cs01/repeatable-requests-v1.0-cs01.html)
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [prov/repeatability-request-id](prov/repeatability-request-id)
     * @provisional
     **/
    'Repeatability-Request-ID'?: string;

    /**
     * [Repeatable Requests Version 1.0](https://docs.oasis-open.org/odata/repeatable-requests/v1.0/cs01/repeatable-requests-v1.0-cs01.html)
     * [OASIS](#OASIS)
     * [Chet\_Ensign](#Chet_Ensign)
     * [prov/repeatability-result](prov/repeatability-result)
     * @provisional
     **/
    'Repeatability-Result'?: string;

    /**
     * [RFC 8555, Section 6.5.1: Automatic Certificate Management Environment (ACME)](https://www.iana.org/go/rfc8555)
     **/
    'Replay-Nonce'?: string;

    /**
     * [Reporting API](https://w3c.github.io/reporting/#header)
     * @provisional
     **/
    'Reporting-Endpoints'?: string;

    /**
     * [RFC-ietf-httpbis-digest-headers-13, Section 3: Digest Fields](https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13)
     **/
    'Repr-Digest'?: string;

    /**
     * [RFC9110, Section 10.2.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'Retry-After'?: string;

    /**
     * [RFC 2310: The Safe Response Header Field](https://www.iana.org/go/rfc2310)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)
     * @obsoleted
     **/
    Safe?: string;

    /**
     * [RFC 6638: Scheduling Extensions to CalDAV](https://www.iana.org/go/rfc6638)
     **/
    'Schedule-Reply'?: string;

    /**
     * [RFC 6338: Scheduling Extensions to CalDAV](https://www.iana.org/go/rfc6638)
     **/
    'Schedule-Tag'?: string;

    /**
     * [Global Privacy Control (GPC)](https://privacycg.github.io/gpc-spec/)
     * @provisional
     **/
    'Sec-GPC'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#sec-purpose-header)
     **/
    'Sec-Purpose'?: string;

    /** to replace the (not registered) Purpose and x-moz headers. */
    Intended?: string;

    /**
     * [RFC 8473: Token Binding over HTTP](https://www.iana.org/go/rfc8473)
     **/
    'Sec-Token-Binding'?: string;

    /**
     * [RFC 6455: The WebSocket Protocol](https://www.iana.org/go/rfc6455)
     **/
    'Sec-WebSocket-Accept'?: string;

    /**
     * [RFC 6455: The WebSocket Protocol](https://www.iana.org/go/rfc6455)
     **/
    'Sec-WebSocket-Extensions'?: string;

    /**
     * [RFC 6455: The WebSocket Protocol](https://www.iana.org/go/rfc6455)
     **/
    'Sec-WebSocket-Key'?: string;

    /**
     * [RFC 6455: The WebSocket Protocol](https://www.iana.org/go/rfc6455)
     **/
    'Sec-WebSocket-Protocol'?: string;

    /**
     * [RFC 6455: The WebSocket Protocol](https://www.iana.org/go/rfc6455)
     **/
    'Sec-WebSocket-Version'?: string;

    /**
     * [RFC 2660: The Secure HyperText Transfer Protocol](https://www.iana.org/go/rfc2660)
     * [status-change-http-experiments-to-historic](https://datatracker.ietf.org/doc/status-change-http-experiments-to-historic)@obsoleted
     **/
    'Security-Scheme'?: string;

    /**
     * [RFC9110, Section 10.2.4: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Server?: string;

    /**
     * [Server Timing](https://www.w3.org/TR/server-timing/)
     **/
    'Server-Timing'?: string;

    /**
     * [RFC 6265: HTTP State Management Mechanism](https://www.iana.org/go/rfc6265)
     **/
    'Set-Cookie'?: string;

    /**
     * [RFC 2965: HTTP State Management Mechanism](https://www.iana.org/go/rfc2965)
     * [RFC 6265: HTTP State Management Mechanism](https://www.iana.org/go/rfc6265)
     * @obsoleted
     **/
    'Set-Cookie2'?: string;

    /**
     * [Implementation of OPS Over HTTP](https://www.w3.org/TR/NOTE-OPS-OverHTTP)
     * @obsoleted
     **/
    SetProfile?: string;

    /**
     * [RFC-ietf-httpbis-message-signatures-19, Section 4.2: HTTP Message Signatures](https://www.iana.org/go/draft-ietf-httpbis-message-signatures-19)
     **/
    Signature?: string;

    /**
     * [RFC-ietf-httpbis-message-signatures-19, Section 4.1: HTTP Message Signatures](https://www.iana.org/go/draft-ietf-httpbis-message-signatures-19)
     **/
    'Signature-Input'?: string;

    /**
     * [RFC 5023: The Atom Publishing Protocol](https://www.iana.org/go/rfc5023)
     **/
    SLUG?: string;

    /**
     * [Simple Object Access Protocol (SOAP) 1.1](https://www.w3.org/TR/2000/NOTE-SOAP-20000508)
     **/
    SoapAction?: string;

    /**
     * [RFC 2518: HTTP Extensions for Distributed Authoring -- WEBDAV](https://www.iana.org/go/rfc2518)
     **/
    'Status-URI'?: string;

    /**
     * [RFC 6797: HTTP Strict Transport Security (HSTS)](https://www.iana.org/go/rfc6797)
     **/
    'Strict-Transport-Security'?: string;

    /**
     * [RFC 8594: The Sunset HTTP Header Field](https://www.iana.org/go/rfc8594)
     **/
    Sunset?: string;

    /**
     * [Edge Architecture Specification](https://www.w3.org/TR/edge-arch)
     * @provisional
     **/
    'Surrogate-Capability'?: string;

    /**
     * [Edge Architecture Specification](https://www.w3.org/TR/edge-arch)
     * @provisional
     **/
    'Surrogate-Control'?: string;

    /**
     * [RFC 2295: Transparent Content Negotiation in HTTP](https://www.iana.org/go/rfc2295)
     **/
    TCN?: string;

    /**
     * [RFC9110, Section 10.1.4: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    TE?: string;

    /**
     * [RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)](https://www.iana.org/go/rfc4918)
     **/
    Timeout?: string;

    /**
     * @provisional
     * [Resource Timing Level 1](https://www.w3.org/TR/resource-timing-1/#timing-allow-origin)
     * [prov/timing-allow-origin](prov/timing-allow-origin)
     **/
    'Timing-Allow-Origin'?: string;

    /**
     * [RFC 8030, Section 5.4: Generic Event Delivery Using HTTP Push](https://www.iana.org/go/rfc8030)
     **/
    Topic?: string;

    /**
     * [Trace Context](https://www.w3.org/TR/trace-context/#traceparent-header)
     **/
    Traceparent?: string;

    /**
     * [Trace Context](https://www.w3.org/TR/trace-context/#tracestate-header)
     **/
    Tracestate?: string;

    /**
     * [RFC9110, Section 6.6.2: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Trailer?: string;

    /**
     * [RFC9112, Section 6.1: HTTP Semantics](https://www.iana.org/go/rfc9112)
     **/
    'Transfer-Encoding'?: string;

    /**
     * [RFC 8030, Section 5.2: Generic Event Delivery Using HTTP Push](https://www.iana.org/go/rfc8030)
     **/
    TTL?: string;

    /**
     * [RFC9110, Section 7.8: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Upgrade?: string;

    /**
     * [RFC 8030, Section 5.3: Generic Event Delivery Using HTTP Push](https://www.iana.org/go/rfc8030)
     **/
    Urgency?: string;

    /**
     * [RFC 2068: Hypertext Transfer Protocol -- HTTP/1.1](https://www.iana.org/go/rfc2068)
     * @obsoleted
     **/
    URI?: string;

    /**
     * [RFC9110, Section 10.1.5: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'User-Agent'?: string;

    /**
     * [RFC 2295: Transparent Content Negotiation in HTTP](https://www.iana.org/go/rfc2295)
     **/
    'Variant-Vary'?: string;

    /**
     * [RFC9110, Section 12.5.5: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Vary?: string;

    /**
     * [RFC9110, Section 7.6.3: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    Via?: string;

    /**
     * [RFC-ietf-httpbis-digest-headers-13, Section 4: Digest Fields](https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13)
     **/
    'Want-Content-Digest'?: string;

    /**
     * [RFC 3230: Instance Digests in HTTP](https://www.iana.org/go/rfc3230)
     * [RFC-ietf-httpbis-digest-headers-13, Section 1.3: Digest Fields](https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13)
     * @obsoleted
     **/
    'Want-Digest'?: string;

    /**
     * [RFC-ietf-httpbis-digest-headers-13, Section 4: Digest Fields](https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13)
     **/
    'Want-Repr-Digest'?: string;

    /**
     * [RFC9111, Section 5.5: HTTP Caching](https://www.iana.org/go/rfc9111)
     * @obsoleted
     **/
    Warning?: string;

    /**
     * [RFC9110, Section 11.6.1: HTTP Semantics](https://www.iana.org/go/rfc9110)
     **/
    'WWW-Authenticate'?: string;

    /**
     * [Fetch](https://fetch.spec.whatwg.org/#x-content-type-options-header)
     **/
    'X-Content-Type-Options'?: string;

    /**
     * [RFC9110, Section 12.5.5: HTTP Semantics](https://www.iana.org/go/rfc9110)
     * [HTML](https://html.spec.whatwg.org/multipage/browsing-the-web.html#x-frame-options)
     * @reserved
     **/
    'X-Frame-Options'?: string;

    [key: string]: string | undefined;
}
