// Extract main domain from URL
export function extractMainDomain(hostname) {
    // Remove trailing dot (if exists)
    hostname = hostname.replace(/\.$/, '');
    
    // Split hostname and handle multi-level TLDs
    const parts = hostname.split('.');
    
    // Handle special multi-level TLDs
    const specialTLDs = [
        // UK
        'co.uk', 'org.uk', 'me.uk', 'ltd.uk', 'plc.uk', 'net.uk', 'sch.uk', 'nhs.uk',
        // China
        'com.cn', 'net.cn', 'org.cn', 'gov.cn', 'edu.cn',
        // Japan 
        'co.jp', 'or.jp', 'ne.jp', 'ac.jp', 'ad.jp', 'ed.jp', 'go.jp', 'gr.jp', 'lg.jp',
        // Korea
        'co.kr', 'ne.kr', 'or.kr', 're.kr', 'pe.kr', 'go.kr', 'mil.kr', 'ac.kr',
        // Taiwan
        'com.tw', 'org.tw', 'gov.tw', 'edu.tw', 'net.tw', 'idv.tw',
        // Hong Kong
        'com.hk', 'org.hk', 'gov.hk', 'edu.hk', 'net.hk',
        // Brazil
        'com.br', 'net.br', 'org.br', 'gov.br', 'edu.br',
        // Australia  
        'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au',
        // India
        'co.in', 'net.in', 'org.in', 'gov.in', 'edu.in',
        // DCloud
        'dcloud.net.cn'
    ];
    const lastThree = parts.slice(-3).join('.');
    if(specialTLDs.some(tld => lastThree.endsWith(tld))) {
        return lastThree;
    }
    
    // If only two parts or less, return directly
    if (parts.length <= 2) return hostname;
    
    // Return last two parts
    return parts.slice(-2).join('.');
} 