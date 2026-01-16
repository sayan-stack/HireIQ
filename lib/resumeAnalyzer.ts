'use client';

// Types for resume analysis
export interface PersonalInfo {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
}

export interface Experience {
    company: string;
    position: string;
    duration: string;
    description: string[];
}

export interface Education {
    institution: string;
    degree: string;
    field: string;
    year: string;
    gpa?: string;
}

export interface SkillCategory {
    category: string;
    skills: string[];
}

export interface ResumeDetails {
    personalInfo: PersonalInfo;
    summary: string;
    skills: SkillCategory[];
    experience: Experience[];
    education: Education[];
    certifications: string[];
    rawText: string;
}

export interface ATSScore {
    overall: number;
    keywordsScore: number;
    formattingScore: number;
    completenessScore: number;
    experienceScore: number;
    educationScore: number;
    suggestions: string[];
}

// ============= SKILL KEYWORDS DATABASE =============
const PROGRAMMING_LANGUAGES = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'golang',
    'rust', 'swift', 'kotlin', 'php', 'scala', 'r', 'matlab', 'perl', 'sql', 'html', 'css',
    'dart', 'objective-c', 'lua', 'shell', 'bash', 'powershell', 'groovy', 'haskell', 'elixir'
];

const FRAMEWORKS_LIBRARIES = [
    'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js',
    'next.js', 'nextjs', 'node.js', 'nodejs', 'express', 'expressjs', 'django', 'flask',
    'spring', 'spring boot', 'springboot', '.net', 'dotnet', 'rails', 'ruby on rails',
    'laravel', 'fastapi', 'svelte', 'nuxt', 'gatsby', 'redux', 'graphql', 'rest', 'restful',
    'tailwind', 'tailwindcss', 'bootstrap', 'material-ui', 'mui', 'chakra',
    'jquery', 'backbone', 'ember', 'meteor', 'electron', 'flutter', 'react native',
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'opencv'
];

const DATABASES = [
    'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'elasticsearch', 'dynamodb',
    'sqlite', 'oracle', 'sql server', 'cassandra', 'firebase', 'firestore', 'mariadb',
    'neo4j', 'couchdb', 'cockroachdb', 'influxdb', 'memcached', 'supabase'
];

const CLOUD_DEVOPS = [
    'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes',
    'k8s', 'jenkins', 'ci/cd', 'terraform', 'ansible', 'linux', 'unix', 'git', 'github',
    'gitlab', 'bitbucket', 'jira', 'confluence', 'vercel', 'netlify', 'heroku',
    'cloudflare', 'nginx', 'apache', 'travis ci', 'circleci', 'github actions',
    'prometheus', 'grafana', 'datadog', 'splunk', 'elk stack', 'vagrant', 'puppet', 'chef'
];

const SOFT_SKILLS = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'problem-solving',
    'analytical', 'creative', 'project management', 'agile', 'scrum', 'kanban',
    'mentoring', 'collaboration', 'time management', 'critical thinking',
    'decision making', 'strategic planning', 'negotiation', 'presentation'
];

// ============= LOCATION BLACKLIST (tech terms that look like locations) =============
const LOCATION_BLACKLIST = [
    'mongo', 'mongodb', 'node', 'nodejs', 'react', 'angular', 'vue', 'java', 'python',
    'ruby', 'rails', 'django', 'flask', 'spring', 'boot', 'aws', 'azure', 'gcp',
    'docker', 'kubernetes', 'postgres', 'mysql', 'redis', 'git', 'github', 'api',
    'rest', 'graphql', 'html', 'css', 'sass', 'less', 'npm', 'yarn', 'webpack',
    'babel', 'eslint', 'jest', 'mocha', 'chai', 'cypress', 'selenium', 'sql', 'nosql',
    'db', 'database', 'server', 'client', 'frontend', 'backend', 'fullstack', 'devops',
    'ci', 'cd', 'agile', 'scrum', 'kanban', 'ai', 'ml', 'deep', 'learning'
];

// ============= INDIAN CITIES AND STATES =============
const INDIAN_CITIES = [
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata',
    'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane',
    'bhopal', 'visakhapatnam', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra',
    'nashik', 'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar', 'aurangabad',
    'dhanbad', 'amritsar', 'allahabad', 'ranchi', 'howrah', 'coimbatore', 'gwalior',
    'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati',
    'solapur', 'noida', 'gurugram', 'gurgaon', 'new delhi', 'navi mumbai', 'greater noida'
];

const INDIAN_STATES = [
    'maharashtra', 'karnataka', 'tamil nadu', 'telangana', 'uttar pradesh', 'gujarat',
    'rajasthan', 'west bengal', 'madhya pradesh', 'kerala', 'bihar', 'andhra pradesh',
    'punjab', 'haryana', 'odisha', 'jharkhand', 'assam', 'delhi', 'uttarakhand',
    'himachal pradesh', 'chhattisgarh', 'goa', 'tripura', 'meghalaya', 'manipur'
];

// ============= US STATES =============
const US_STATES: { [key: string]: string } = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire',
    'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina',
    'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania',
    'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee',
    'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington',
    'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'Washington DC'
};

// ============= COMMON NAME PATTERNS =============
const NAME_PREFIXES = ['mr', 'mrs', 'ms', 'dr', 'prof', 'sir'];
const NAME_SUFFIXES = ['jr', 'sr', 'ii', 'iii', 'iv', 'phd', 'md', 'mba'];

// ============= PDF TEXT EXTRACTION =============
export async function extractTextFromPDF(file: File): Promise<string> {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

    try {
        const arrayBuffer = await file.arrayBuffer();

        let pdf;
        try {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            pdf = await loadingTask.promise;
        } catch (workerError) {
            console.warn('Worker loading failed, trying with disabled worker:', workerError);
            pdfjsLib.GlobalWorkerOptions.workerSrc = '';
            const loadingTask = pdfjsLib.getDocument({
                data: arrayBuffer,
                useWorkerFetch: false,
                isEvalSupported: false,
            });
            pdf = await loadingTask.promise;
        }

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: unknown) => {
                    const textItem = item as { str?: string };
                    return textItem.str || '';
                })
                .join(' ');
            fullText += pageText + '\n';
        }

        return fullText;
    } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF document.');
    }
}

// ============= MAIN PARSING FUNCTION =============
export function parseResumeDetails(text: string): ResumeDetails {
    const lowerText = text.toLowerCase();
    const cleanText = cleanResumeText(text);

    return {
        personalInfo: extractPersonalInfo(cleanText, text),
        summary: extractSummary(cleanText),
        skills: extractSkills(lowerText),
        experience: extractExperience(cleanText),
        education: extractEducation(cleanText),
        certifications: extractCertifications(text),
        rawText: text
    };
}

// ============= TEXT CLEANING =============
function cleanResumeText(text: string): string {
    return text
        .replace(/\s+/g, ' ')  // Normalize whitespace
        .replace(/\|/g, ' ')   // Replace pipe separators
        .replace(/•/g, ' ')    // Replace bullet points
        .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, ' ')  // Unicode bullets
        .trim();
}

// ============= ENHANCED PERSONAL INFO EXTRACTION =============
function extractPersonalInfo(cleanText: string, originalText: string): PersonalInfo {
    return {
        name: extractName(cleanText, originalText),
        email: extractEmail(cleanText),
        phone: extractPhone(cleanText, originalText),
        location: extractLocation(cleanText, originalText),
        linkedin: extractLinkedIn(cleanText),
        github: extractGitHub(cleanText)
    };
}

// Enhanced name extraction with multiple strategies
function extractName(text: string, originalText: string): string {
    // Strategy 1: First look for clear name patterns in the first few lines
    const lines = originalText.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 0);

    for (let i = 0; i < Math.min(8, lines.length); i++) {
        const line = lines[i];

        // Skip lines with emails, URLs, phones, or common headers
        if (line.includes('@') || line.includes('http') ||
            line.match(/^\+?\d{5,}/) || line.includes('linkedin') ||
            line.toLowerCase().match(/^(resume|cv|curriculum|objective|summary|profile)/)) {
            continue;
        }

        // Clean special characters but preserve the structure
        const cleanLine = line
            .replace(/[|•●○▪→]/g, ' ')  // Common separators
            .replace(/[^\w\s.-]/g, '')   // Remove other special chars
            .replace(/\s+/g, ' ')         // Normalize spaces
            .trim();

        if (cleanLine.length < 3 || cleanLine.length > 50) continue;

        const words = cleanLine.split(/\s+/).filter(w => w.length >= 2);

        // Allow 2-4 words that start with capital letters
        if (words.length >= 2 && words.length <= 4) {
            const allCapitalized = words.every(w => /^[A-Z][a-zA-Z]*$/.test(w));

            // Check it's not a common header
            const lowerLine = cleanLine.toLowerCase();
            const notHeader = !['professional summary', 'work experience', 'education',
                'skills', 'projects', 'objective', 'career summary', 'profile',
                'contact information', 'curriculum vitae', 'personal details',
                'technical skills', 'work history', 'career objective'].includes(lowerLine);

            if (allCapitalized && notHeader) {
                const finalWords = words.filter(w =>
                    !NAME_PREFIXES.includes(w.toLowerCase()) &&
                    !NAME_SUFFIXES.includes(w.toLowerCase().replace('.', ''))
                );
                if (finalWords.length >= 2) {
                    return finalWords.join(' ');
                }
            }
        }
    }

    // Strategy 2: Look for "Name:" or "Full Name:" patterns
    const namePatterns = [
        /(?:full\s+)?name[:\s]+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3})/i,
        /(?:candidate|applicant)[:\s]+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3})/i
    ];

    for (const pattern of namePatterns) {
        const match = text.match(pattern);
        if (match) {
            return match[1].trim();
        }
    }

    // Strategy 3: Extract from email username
    const email = extractEmail(text);
    if (email && email !== 'Email not found') {
        const emailName = email.split('@')[0];
        // Handle formats like: firstname.lastname, first_last, first-last
        const nameParts = emailName.split(/[._-]/).filter(p => p.length > 1 && /^[a-zA-Z]+$/.test(p));
        if (nameParts.length >= 2) {
            return nameParts
                .slice(0, 2)  // Just first and last name
                .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
                .join(' ');
        }
        // Single name in email
        if (nameParts.length === 1 && nameParts[0].length >= 3) {
            return nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
        }
    }

    // Strategy 4: Try to find any capitalized sequence at the start
    const firstFewWords = text.substring(0, 200);
    const capitalizedNames = firstFewWords.match(/\b([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/);
    if (capitalizedNames) {
        const candidate = capitalizedNames[1];
        const lower = candidate.toLowerCase();
        if (!['professional summary', 'work experience', 'education', 'skills'].includes(lower)) {
            return candidate;
        }
    }

    return 'Name not detected';
}

// Enhanced email extraction
function extractEmail(text: string): string {
    // More robust email regex
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);

    if (matches && matches.length > 0) {
        // Filter out common false positives
        const validEmails = matches.filter(email => {
            const lower = email.toLowerCase();
            return !lower.includes('example') &&
                !lower.includes('test@') &&
                !lower.includes('@domain') &&
                email.length < 50;
        });

        return validEmails[0] || matches[0];
    }

    return 'Email not found';
}

// Enhanced phone extraction with international support
function extractPhone(text: string, originalText: string): string {
    const phonePatterns = [
        // Indian format: +91 XXXXX XXXXX or +91-XXXXX-XXXXX
        /\+91[\s-]?\d{5}[\s-]?\d{5}/,
        // Indian format: 0XXXX-XXXXXX
        /0\d{4}[\s-]?\d{6}/,
        // Indian mobile: XXXXX XXXXX or XXXXXXXXXX
        /(?<!\d)[6-9]\d{4}[\s-]?\d{5}(?!\d)/,
        // US format: (XXX) XXX-XXXX or XXX-XXX-XXXX
        /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/,
        // International: +X XXX XXX XXXX or +XX XXX XXX XXXX
        /\+\d{1,3}[\s.-]?\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/,
        // With country code
        /\+\d{1,3}[\s.-]?\(?\d{2,5}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}/
    ];

    for (const pattern of phonePatterns) {
        const match = originalText.match(pattern);
        if (match) {
            // Clean up the phone number
            return match[0].trim();
        }
    }

    // Fallback: look for "Phone:" or "Mobile:" pattern
    const phoneLabel = /(?:phone|mobile|tel|contact)[:\s]+([+\d\s().-]{10,20})/i;
    const labelMatch = text.match(phoneLabel);
    if (labelMatch) {
        return labelMatch[1].trim();
    }

    return 'Phone not found';
}

// Enhanced location extraction
function extractLocation(text: string, originalText: string): string {
    const lowerText = text.toLowerCase();

    // Strategy 1: Look for explicit location labels
    const locationPatterns = [
        /(?:location|address|city|based in|residing at)[:\s]+([A-Za-z\s,]+?)(?:[|\n•]|$)/i,
        /(?:location|address)[:\s]*([A-Za-z\s]+,\s*[A-Za-z\s]+)/i
    ];

    for (const pattern of locationPatterns) {
        const match = text.match(pattern);
        if (match) {
            const location = match[1].trim();
            // Verify it's not a tech term
            if (!isBlacklistedLocation(location)) {
                return formatLocation(location);
            }
        }
    }

    // Strategy 2: Look for Indian cities with precise extraction
    for (const city of INDIAN_CITIES) {
        const cityIndex = lowerText.indexOf(city);
        if (cityIndex !== -1) {
            // Extract just the city name and optionally state
            let result = city.charAt(0).toUpperCase() + city.slice(1);

            // Check for state after the city
            for (const state of INDIAN_STATES) {
                const stateRegex = new RegExp(`${city}[,\\s]+(${state})`, 'i');
                const stateMatch = lowerText.match(stateRegex);
                if (stateMatch) {
                    result += ', ' + state.charAt(0).toUpperCase() + state.slice(1);
                    break;
                }
            }

            // Check for "India" after
            if (lowerText.includes('india') && !result.toLowerCase().includes('india')) {
                result += ', India';
            }

            return result;
        }
    }

    // Strategy 3: Look for City, STATE pattern (US format)
    const usPattern = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s*([A-Z]{2})(?:\s|,|$)/;
    const usMatch = originalText.match(usPattern);
    if (usMatch) {
        const [, city, state] = usMatch;
        // Verify it's not a tech term
        if (!isBlacklistedLocation(city) && US_STATES[state]) {
            return `${city}, ${state}`;
        }
    }

    // Strategy 4: Look for "India" with nearby city
    if (lowerText.includes('india')) {
        const indiaContext = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)[,\s]+(?:India|INDIA)/;
        const indiaMatch = text.match(indiaContext);
        if (indiaMatch && !isBlacklistedLocation(indiaMatch[1])) {
            return `${indiaMatch[1]}, India`;
        }
        return 'India';
    }

    return 'Location not detected';
}

// Check if a word is a tech term being mistaken for location
function isBlacklistedLocation(loc: string): boolean {
    const lower = loc.toLowerCase().trim();
    return LOCATION_BLACKLIST.some(term =>
        lower === term ||
        lower.startsWith(term + ' ') ||
        lower.endsWith(' ' + term) ||
        lower.includes(term)
    );
}

// Format location nicely and limit length
function formatLocation(loc: string): string {
    // Clean and format
    const cleaned = loc
        .split(/[\s,]+/)
        .filter(word => word.length > 0 && word.length < 20)  // Filter out very long words
        .slice(0, 4)  // Max 4 words for location
        .map(word => {
            // Keep abbreviations like "USA" uppercase
            if (word.length <= 3 && word === word.toUpperCase()) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');

    // Limit total length
    return cleaned.substring(0, 40).trim();
}

// Extract LinkedIn URL - enhanced patterns
function extractLinkedIn(text: string): string | undefined {
    // Clean up the text for better matching
    const cleanText = text.replace(/\s+/g, ' ');

    const linkedinPatterns = [
        // Full URL patterns
        /https?:\/\/(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
        /linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
        /in\.linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
        // With label
        /linkedin[:\s]+(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i,
        // Just the profile path
        /\/in\/([a-zA-Z0-9_-]+)/,
        // Username after linkedin mention
        /linkedin[:\s]+@?([a-zA-Z0-9_-]{3,})/i
    ];

    for (const pattern of linkedinPatterns) {
        const match = cleanText.match(pattern);
        if (match && match[1]) {
            const username = match[1];
            // Validate username looks reasonable
            if (username.length >= 3 && username.length <= 50 && /^[a-zA-Z]/.test(username)) {
                return `https://linkedin.com/in/${username}`;
            }
        }
    }

    return undefined;
}

// Extract GitHub URL
function extractGitHub(text: string): string | undefined {
    const githubPatterns = [
        /github\.com\/([a-zA-Z0-9_-]+)/i,
        /github:\s*(https?:\/\/[^\s]+)/i
    ];

    for (const pattern of githubPatterns) {
        const match = text.match(pattern);
        if (match) {
            if (match[0].startsWith('http')) {
                return match[0];
            }
            return `https://github.com/${match[1]}`;
        }
    }

    return undefined;
}

// ============= SUMMARY EXTRACTION =============
function extractSummary(text: string): string {
    const summaryPatterns = [
        /(?:professional\s+)?summary[:\s]*\n?([\s\S]*?)(?=\n\s*(?:experience|education|skills|work|employment|projects|technical))/i,
        /(?:career\s+)?objective[:\s]*\n?([\s\S]*?)(?=\n\s*(?:experience|education|skills|work|employment|projects))/i,
        /profile[:\s]*\n?([\s\S]*?)(?=\n\s*(?:experience|education|skills|work|employment|projects))/i,
        /about\s+me[:\s]*\n?([\s\S]*?)(?=\n\s*(?:experience|education|skills|work|employment|projects))/i
    ];

    for (const pattern of summaryPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            const summary = match[1]
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 500);

            if (summary.length > 30) {
                return summary;
            }
        }
    }

    return 'Summary not detected';
}

// ============= SKILLS EXTRACTION =============
function extractSkills(lowerText: string): SkillCategory[] {
    const categories: SkillCategory[] = [];

    const foundLanguages = PROGRAMMING_LANGUAGES.filter(skill => {
        const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i');
        return regex.test(lowerText);
    });
    if (foundLanguages.length > 0) {
        categories.push({ category: 'Programming Languages', skills: [...new Set(foundLanguages)] });
    }

    const foundFrameworks = FRAMEWORKS_LIBRARIES.filter(skill => {
        const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i');
        return regex.test(lowerText);
    });
    if (foundFrameworks.length > 0) {
        categories.push({ category: 'Frameworks & Libraries', skills: [...new Set(foundFrameworks)] });
    }

    const foundDatabases = DATABASES.filter(skill => {
        const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i');
        return regex.test(lowerText);
    });
    if (foundDatabases.length > 0) {
        categories.push({ category: 'Databases', skills: [...new Set(foundDatabases)] });
    }

    const foundCloud = CLOUD_DEVOPS.filter(skill => {
        const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i');
        return regex.test(lowerText);
    });
    if (foundCloud.length > 0) {
        categories.push({ category: 'Cloud & DevOps', skills: [...new Set(foundCloud)] });
    }

    const foundSoft = SOFT_SKILLS.filter(skill => {
        const regex = new RegExp(`\\b${escapeRegex(skill)}\\b`, 'i');
        return regex.test(lowerText);
    });
    if (foundSoft.length > 0) {
        categories.push({ category: 'Soft Skills', skills: [...new Set(foundSoft)] });
    }

    return categories;
}

function escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============= EXPERIENCE EXTRACTION =============
function extractExperience(text: string): Experience[] {
    const experiences: Experience[] = [];

    // Look for experience section
    const expPatterns = [
        /(?:work\s+)?experience[:\s]*\n([\s\S]*?)(?=\n\s*(?:education|skills|projects|certifications|achievements|$))/i,
        /employment\s+history[:\s]*\n([\s\S]*?)(?=\n\s*(?:education|skills|projects|$))/i,
        /professional\s+experience[:\s]*\n([\s\S]*?)(?=\n\s*(?:education|skills|projects|$))/i
    ];

    let expSection = '';
    for (const pattern of expPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
            expSection = match[1];
            break;
        }
    }

    if (expSection) {
        // Look for date ranges to identify job entries
        const datePattern = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:19|20)\d{2}\s*[-–to]+\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:(?:19|20)\d{2}|Present|Current|Now|Ongoing)/gi;

        const dateMatches = [...expSection.matchAll(datePattern)];

        for (let i = 0; i < Math.min(dateMatches.length, 5); i++) {
            const dateMatch = dateMatches[i];
            const startIdx = Math.max(0, dateMatch.index! - 200);
            const endIdx = dateMatches[i + 1]?.index || dateMatch.index! + 300;
            const jobText = expSection.substring(startIdx, endIdx);

            experiences.push({
                company: extractCompanyFromText(jobText),
                position: extractPositionFromText(jobText),
                duration: dateMatch[0].trim(),
                description: extractJobDescription(jobText)
            });
        }
    }

    // Fallback: just detect if there are date ranges
    if (experiences.length === 0) {
        const yearPatterns = text.match(/20\d{2}\s*[-–]\s*(?:20\d{2}|present|current)/gi);
        if (yearPatterns && yearPatterns.length > 0) {
            experiences.push({
                company: 'Experience detected in resume',
                position: 'View resume for details',
                duration: yearPatterns[0],
                description: ['Experience details available in the resume document']
            });
        }
    }

    return experiences;
}

function extractCompanyFromText(text: string): string {
    // Look for company indicators
    const companyPatterns = [
        /(?:at|@)\s+([A-Z][A-Za-z0-9\s&.,]+?)(?:\s*[-–|]|\s*$)/,
        /([A-Z][A-Za-z0-9\s&.,]+?)\s*(?:Pvt\.?\s*Ltd\.?|Private\s+Limited|Inc\.?|LLC|Corp\.?|Corporation)/i
    ];

    for (const pattern of companyPatterns) {
        const match = text.match(pattern);
        if (match) {
            return match[1].trim().substring(0, 50);
        }
    }

    return 'Company name in resume';
}

function extractPositionFromText(text: string): string {
    const positionKeywords = [
        'engineer', 'developer', 'manager', 'analyst', 'designer', 'architect',
        'consultant', 'specialist', 'lead', 'director', 'associate', 'intern',
        'administrator', 'coordinator', 'executive', 'officer', 'scientist'
    ];

    for (const keyword of positionKeywords) {
        const pattern = new RegExp(`([A-Za-z\\s]+${keyword}[A-Za-z\\s]*)`, 'i');
        const match = text.match(pattern);
        if (match) {
            const position = match[1].trim();
            if (position.length > 5 && position.length < 60) {
                return position;
            }
        }
    }

    return 'Position details in resume';
}

function extractJobDescription(text: string): string[] {
    const bullets = text.split(/[•\-\*\n]/).filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 20 && trimmed.length < 200;
    });

    return bullets.slice(0, 3).map(b => b.trim());
}

// ============= EDUCATION EXTRACTION =============
function extractEducation(text: string): Education[] {
    const educations: Education[] = [];
    const lowerText = text.toLowerCase();

    // First, try to find and isolate the education section
    // Section should end at next section header
    const sectionHeaders = ['experience', 'skills', 'projects', 'work history', 'certifications',
        'achievements', 'awards', 'publications', 'interests', 'references', 'summary'];

    let eduSectionStart = -1;
    let eduSectionEnd = text.length;

    // Find education section start
    const eduHeaderMatch = lowerText.match(/\b(education|academic|qualifications?)\b/);
    if (eduHeaderMatch && eduHeaderMatch.index !== undefined) {
        eduSectionStart = eduHeaderMatch.index;

        // Find the next section header after education
        for (const header of sectionHeaders) {
            const headerRegex = new RegExp(`\\b${header}\\b`, 'i');
            const searchText = lowerText.substring(eduSectionStart + 15); // Skip past "education"
            const nextMatch = searchText.match(headerRegex);
            if (nextMatch && nextMatch.index !== undefined) {
                const potentialEnd = eduSectionStart + 15 + nextMatch.index;
                if (potentialEnd < eduSectionEnd) {
                    eduSectionEnd = potentialEnd;
                }
            }
        }
    }

    // Extract just the education section
    const eduSection = eduSectionStart >= 0
        ? text.substring(eduSectionStart, eduSectionEnd)
        : '';

    // Known universities and institutions
    const knownInstitutions = [
        'university', 'institute', 'college', 'school', 'academy',
        'iit', 'nit', 'bits', 'vit', 'srm', 'manipal'
    ];

    // Degree patterns - more specific to avoid capturing too much
    const degreeTypes = [
        { pattern: /B\.?Tech\.?(?:\s+in)?/gi, type: 'B.Tech' },
        { pattern: /B\.?E\.?(?:\s+in)?/gi, type: 'B.E.' },
        { pattern: /B\.?Sc\.?(?:\s+in)?/gi, type: 'B.Sc.' },
        { pattern: /B\.?A\.?(?:\s+in)?/gi, type: 'B.A.' },
        { pattern: /B\.?Com\.?/gi, type: 'B.Com' },
        { pattern: /Bachelor(?:'s)?(?:\s+of)?/gi, type: 'Bachelor' },
        { pattern: /M\.?Tech\.?(?:\s+in)?/gi, type: 'M.Tech' },
        { pattern: /M\.?E\.?(?:\s+in)?/gi, type: 'M.E.' },
        { pattern: /M\.?Sc\.?(?:\s+in)?/gi, type: 'M.Sc.' },
        { pattern: /M\.?A\.?(?:\s+in)?/gi, type: 'M.A.' },
        { pattern: /MBA/gi, type: 'MBA' },
        { pattern: /Master(?:'s)?(?:\s+of)?/gi, type: 'Master' },
        { pattern: /Ph\.?D\.?/gi, type: 'Ph.D.' },
        { pattern: /Diploma(?:\s+in)?/gi, type: 'Diploma' },
        { pattern: /Higher Secondary|12th|HSC/gi, type: '12th Grade' },
        { pattern: /Secondary|10th|SSC|ICSE|CBSE/gi, type: '10th Grade' }
    ];

    const searchText = eduSection || text;

    // Find institutions in the section
    const institutionMatches: string[] = [];
    for (const keyword of knownInstitutions) {
        const instPattern = new RegExp(`([A-Z][A-Za-z\\s]{2,40}${keyword}[A-Za-z\\s]{0,20})`, 'gi');
        const matches = searchText.match(instPattern);
        if (matches) {
            institutionMatches.push(...matches.map(m => m.trim().substring(0, 60)));
        }
    }

    // Find degrees
    for (const degreeType of degreeTypes) {
        if (degreeType.pattern.test(searchText)) {
            // Find year near this degree
            const yearMatch = searchText.match(/(?:19|20)\d{2}/);

            // Find field of study
            const fieldPatterns = [
                /(?:in|of)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})/,
                /(?:Computer Science|Information Technology|Electronics|Mechanical|Civil|Electrical)/i
            ];

            let field = 'See resume for details';
            for (const fp of fieldPatterns) {
                const fm = searchText.match(fp);
                if (fm) {
                    field = fm[1] || fm[0];
                    break;
                }
            }

            educations.push({
                institution: institutionMatches[educations.length] || extractInstitutionClean(searchText),
                degree: degreeType.type,
                field: field.substring(0, 50),
                year: yearMatch?.[0] || 'Year not specified'
            });

            if (educations.length >= 3) break; // Max 3 education entries
        }
        // Reset regex lastIndex
        degreeType.pattern.lastIndex = 0;
    }

    return educations;
}

// Clean institution extraction
function extractInstitutionClean(text: string): string {
    const universityKeywords = ['university', 'institute', 'college', 'school', 'academy'];

    for (const keyword of universityKeywords) {
        // Look for institution name containing the keyword
        const pattern = new RegExp(`([A-Z][A-Za-z\\s]{3,30}${keyword}(?:\\s+of\\s+[A-Z][A-Za-z]+)?)`, 'i');
        const match = text.match(pattern);
        if (match) {
            // Clean up the match
            const clean = match[1]
                .replace(/\s+/g, ' ')
                .trim()
                .substring(0, 60);
            return clean;
        }
    }

    return 'Institution in resume';
}

// ============= CERTIFICATIONS EXTRACTION =============
function extractCertifications(text: string): string[] {
    const certifications: string[] = [];

    const certPatterns = [
        /aws\s+certified\s+[\w\s-]+/gi,
        /google\s+cloud\s+certified\s+[\w\s-]+/gi,
        /azure\s+(?:certified|administrator|developer)[\w\s-]*/gi,
        /professional\s+scrum\s+master/gi,
        /certified\s+kubernetes\s+[\w\s-]+/gi,
        /pmp\b/gi,
        /cissp\b/gi,
        /comptia\s+[\w+]+/gi,
        /oracle\s+certified[\w\s-]+/gi,
        /microsoft\s+certified[\w\s-]+/gi
    ];

    for (const pattern of certPatterns) {
        const matches = text.match(pattern);
        if (matches) {
            certifications.push(...matches.map(m => m.trim()));
        }
    }

    return [...new Set(certifications)].slice(0, 10);
}

// ============= ATS SCORE CALCULATION =============
export function calculateATSScore(details: ResumeDetails): ATSScore {
    const suggestions: string[] = [];

    // Keywords score - based on technical skills
    const totalSkills = details.skills.reduce((sum, cat) => sum + cat.skills.length, 0);
    let keywordsScore = Math.min(100, totalSkills * 4 + 20);

    if (totalSkills < 5) {
        suggestions.push('📝 Add more technical skills (programming languages, frameworks, tools) to improve ATS keyword matching');
    }
    if (totalSkills >= 5 && totalSkills < 10) {
        suggestions.push('💡 Consider adding more skills in Cloud/DevOps and soft skills categories');
    }

    // Check skill category distribution
    const hasLanguages = details.skills.some(c => c.category === 'Programming Languages');
    const hasFrameworks = details.skills.some(c => c.category === 'Frameworks & Libraries');
    const hasDatabases = details.skills.some(c => c.category === 'Databases');
    const hasCloud = details.skills.some(c => c.category === 'Cloud & DevOps');

    if (!hasLanguages) {
        suggestions.push('🔧 Add programming languages (Python, JavaScript, Java, etc.) to your skills section');
    }
    if (!hasFrameworks) {
        suggestions.push('⚡ Include frameworks and libraries you\'ve worked with (React, Django, Spring, etc.)');
    }
    if (!hasDatabases && !hasCloud) {
        suggestions.push('☁️ Add database and cloud technologies (MySQL, AWS, Docker) to appear more well-rounded');
    }

    // Formatting score - contact info and structure
    let formattingScore = 55;
    if (details.personalInfo.email !== 'Email not found') formattingScore += 15;
    if (details.personalInfo.phone !== 'Phone not found') formattingScore += 10;
    if (details.personalInfo.name !== 'Name not detected') formattingScore += 10;
    if (details.personalInfo.location !== 'Location not detected') formattingScore += 5;
    if (details.summary !== 'Summary not detected') formattingScore += 5;
    formattingScore = Math.min(100, formattingScore);

    if (details.personalInfo.email === 'Email not found') {
        suggestions.push('📧 Add a professional email address at the top of your resume');
    }
    if (details.personalInfo.phone === 'Phone not found') {
        suggestions.push('📱 Include a contact phone number for recruiter callbacks');
    }
    if (details.personalInfo.location === 'Location not detected') {
        suggestions.push('📍 Add your city and state/region for location-based job matching');
    }

    // Completeness score - all sections present
    let completenessScore = 10;
    if (details.personalInfo.name !== 'Name not detected') completenessScore += 12;
    if (details.personalInfo.email !== 'Email not found') completenessScore += 12;
    if (details.personalInfo.phone !== 'Phone not found') completenessScore += 8;
    if (details.summary !== 'Summary not detected') completenessScore += 15;
    if (details.experience.length > 0) completenessScore += 20;
    if (details.education.length > 0) completenessScore += 13;
    if (details.skills.length > 0) completenessScore += 5;
    if (details.certifications.length > 0) completenessScore += 5;

    if (details.summary === 'Summary not detected') {
        suggestions.push('📄 Add a Professional Summary section (2-3 sentences) highlighting your key strengths');
    }

    // Experience score
    let experienceScore = 30;
    if (details.experience.length >= 1) experienceScore = 60;
    if (details.experience.length >= 2) experienceScore = 80;
    if (details.experience.length >= 3) experienceScore = 100;

    if (details.experience.length === 0) {
        suggestions.push('💼 Add a Work Experience section with company names, job titles, dates, and achievements');
    } else if (details.experience.length === 1) {
        suggestions.push('📈 Consider adding more work experience entries, including internships or part-time roles');
    }

    // Education score
    let educationScore = 40;
    if (details.education.length >= 1) educationScore = 80;
    if (details.education.length >= 2) educationScore = 100;

    if (details.education.length === 0) {
        suggestions.push('🎓 Add an Education section with your degree, institution, and graduation year');
    }

    // LinkedIn and online presence
    if (!details.personalInfo.linkedin) {
        suggestions.push('🔗 Add your LinkedIn profile URL to increase professional credibility');
    }
    if (!details.personalInfo.github) {
        suggestions.push('💻 Include your GitHub profile to showcase your coding projects');
    }

    // Certifications
    if (details.certifications.length === 0) {
        suggestions.push('🏆 Consider adding relevant certifications (AWS, Google Cloud, Scrum) to stand out');
    }

    const overall = Math.round(
        keywordsScore * 0.25 +
        formattingScore * 0.15 +
        completenessScore * 0.25 +
        experienceScore * 0.20 +
        educationScore * 0.15
    );

    return {
        overall,
        keywordsScore: Math.round(keywordsScore),
        formattingScore: Math.round(formattingScore),
        completenessScore: Math.round(completenessScore),
        experienceScore: Math.round(experienceScore),
        educationScore: Math.round(educationScore),
        suggestions: suggestions.slice(0, 8) // Show up to 8 suggestions
    };
}

// ============= MAIN ANALYZE FUNCTION =============
export async function analyzeResume(file: File): Promise<{
    details: ResumeDetails;
    score: ATSScore;
}> {
    const text = await extractTextFromPDF(file);
    const details = parseResumeDetails(text);
    const score = calculateATSScore(details);

    return { details, score };
}
