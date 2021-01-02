export var agentInstance: Agent;
import Agent = require("./structure/agent");
export declare const Manga: typeof import("./structure/manga");
export declare const Chapter: typeof import("./structure/chapter");
export declare const Group: typeof import("./structure/group");
export declare const User: typeof import("./structure/user");
export declare const Thread: typeof import("./structure/thread");
export declare const Post: typeof import("./structure/post");
export declare const Home: typeof import("./structure/home");
export declare const MDList: typeof import("./structure/mdlist");
export declare const MDNet: typeof import("./structure/mdnet");
export declare const Util: {
    getHTTPS: (url: string | URL) => Promise<any>;
    getJSON: (url: string | URL) => Promise<any>;
    getMatches: (url: string | URL, regex: RegExp) => Promise<any>;
    quickSearch: (query: string, regex: RegExp) => Promise<any>;
    generateMultipartBoundary: () => string;
    generateMultipartPayload: (boundary?: string, obj?: any) => any;
    getKeyByValue: (obj: any, value: string) => string;
    parseEnumArray: (en: any, arr: any[]) => any[];
};
export declare const language: {
    SA: string;
    BD: string;
    BG: string;
    MM: string;
    CT: string;
    CN: string;
    HK: string;
    CZ: string;
    DK: string;
    NL: string;
    GB: string;
    PH: string;
    FI: string;
    FR: string;
    DE: string;
    GR: string;
    HU: string;
    ID: string;
    IT: string;
    JP: string;
    KR: string;
    LT: string;
    MY: string;
    MN: string;
    IR: string;
    PL: string;
    BR: string;
    PT: string;
    RO: string;
    RU: string;
    RS: string;
    ES: string;
    MX: string;
    SE: string;
    TH: string;
    TR: string;
    UA: string;
    VN: string;
};
export declare const genre: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
    14: string;
    16: string;
    17: string;
    18: string;
    19: string;
    20: string;
    21: string;
    22: string;
    23: string;
    24: string;
    25: string;
    28: string;
    30: string;
    31: string;
    32: string;
    33: string;
    34: string;
    35: string;
    36: string;
    37: string;
    38: string;
    40: string;
    41: string;
    42: string;
    43: string;
    44: string;
    45: string;
    46: string;
    47: string;
    48: string;
    49: string;
    50: string;
    51: string;
    52: string;
    53: string;
    54: string;
    55: string;
    56: string;
    57: string;
    58: string;
    59: string;
    60: string;
    61: string;
    62: string;
    63: string;
    64: string;
    65: string;
    66: string;
    67: string;
    68: string;
    69: string;
    70: string;
    71: string;
    72: string;
    73: string;
    74: string;
    75: string;
    76: string;
    77: string;
    78: string;
    79: string;
    80: string;
    81: string;
    82: string;
    83: string;
    84: string;
    85: string;
};
export declare const link: {
    bw: {
        name: string;
        prefix: string;
    };
    mu: {
        name: string;
        prefix: string;
    };
    mal: {
        name: string;
        prefix: string;
    };
    amz: {
        name: string;
        prefix: string;
    };
    ebj: {
        name: string;
        prefix: string;
    };
    engtl: {
        name: string;
        prefix: string;
    };
    raw: {
        name: string;
        prefix: string;
    };
    nu: {
        name: string;
        prefix: string;
    };
    cdj: {
        name: string;
        prefix: string;
    };
    kt: {
        name: string;
        prefix: string;
    };
    ap: {
        name: string;
        prefix: string;
    };
    al: {
        name: string;
        prefix: string;
    };
    dj: {
        name: string;
        prefix: string;
    };
};
export declare const settings: {
    hentai: {
        hidden: number;
        shown: number;
        exclusive: number;
    };
};
export declare const chapterType: {
    internal: number;
    delayed: number;
    external: number;
};
export declare const demographic: {
    1: string;
    2: string;
    3: string;
    4: string;
};
export declare const pubStatus: {
    1: string;
    2: string;
    3: string;
    4: string;
};
export declare const listingOrder: {
    "Last Updated (Asc)": number;
    "Last Updated (Des)": number;
    "Title (Asc)": number;
    "Title (Des)": number;
    "Comments (Asc)": number;
    "Comments (Des)": number;
    "Rating (Asc)": number;
    "Rating (Des)": number;
    "Views (Asc)": number;
    "Views (Des)": number;
    "Follows (Asc)": number;
    "Follows (Des)": number;
};
export declare const viewingCategories: {
    ALL: number;
    READING: number;
    COMPLETED: number;
    ON_HOLD: number;
    PLAN_TO_READ: number;
    DROPPED: number;
    RE_READING: number;
};
export { agentInstance as agent };
