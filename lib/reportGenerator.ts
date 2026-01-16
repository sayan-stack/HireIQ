'use client';

import { ResumeDetails, ATSScore } from './resumeAnalyzer';

/**
 * Generate a downloadable HTML report for resume analysis
 */
export function generateHTMLReport(
    details: ResumeDetails,
    score: ATSScore,
    fileName: string
): string {
    const allSkills = details.skills.flatMap(cat => cat.skills);
    const skillsHTML = details.skills.map(cat => `
        <div class="skill-category">
            <h4>${cat.category}</h4>
            <div class="skill-tags">
                ${cat.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `).join('');

    const experienceHTML = details.experience.map(exp => `
        <div class="experience-item">
            <div class="exp-header">
                <strong>${exp.company}</strong>
                <span class="duration">${exp.duration}</span>
            </div>
            <div class="position">${exp.position}</div>
            ${exp.description.length > 0 ? `
                <ul class="exp-description">
                    ${exp.description.map(d => `<li>${d}</li>`).join('')}
                </ul>
            ` : ''}
        </div>
    `).join('');

    const educationHTML = details.education.map(edu => `
        <div class="education-item">
            <strong>${edu.institution}</strong>
            <div>${edu.degree}</div>
            <div class="year">${edu.year}</div>
        </div>
    `).join('');

    const suggestionsHTML = score.suggestions.map(s => `
        <li class="suggestion-item">
            <span class="suggestion-icon">💡</span>
            ${s}
        </li>
    `).join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Analysis Report - ${details.personalInfo.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #e0e0e0;
            padding: 40px;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(135deg, #14b8a6, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        .report-title {
            font-size: 24px;
            color: #ffffff;
            margin-bottom: 5px;
        }
        .report-date {
            color: #888;
            font-size: 14px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 18px;
            color: #14b8a6;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section-title::before {
            content: '';
            display: block;
            width: 4px;
            height: 20px;
            background: linear-gradient(135deg, #14b8a6, #3b82f6);
            border-radius: 2px;
        }
        .score-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .score-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .score-card.main {
            grid-column: span 3;
            background: linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(59, 130, 246, 0.2));
        }
        .score-value {
            font-size: 48px;
            font-weight: bold;
            color: #14b8a6;
        }
        .score-value.main {
            font-size: 72px;
            background: linear-gradient(135deg, #14b8a6, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .score-label {
            color: #888;
            font-size: 14px;
            margin-top: 5px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .info-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .info-label {
            font-size: 12px;
            color: #888;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .info-value {
            color: #fff;
            font-size: 16px;
        }
        .skill-category {
            margin-bottom: 15px;
        }
        .skill-category h4 {
            color: #888;
            font-size: 14px;
            margin-bottom: 10px;
        }
        .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .skill-tag {
            background: linear-gradient(135deg, rgba(20, 184, 166, 0.3), rgba(59, 130, 246, 0.3));
            color: #fff;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            border: 1px solid rgba(20, 184, 166, 0.3);
        }
        .experience-item, .education-item {
            background: rgba(255, 255, 255, 0.03);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 15px;
            border-left: 3px solid #14b8a6;
        }
        .exp-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        .duration, .year {
            color: #888;
            font-size: 13px;
        }
        .position {
            color: #3b82f6;
            margin-bottom: 10px;
        }
        .exp-description {
            color: #aaa;
            font-size: 14px;
            padding-left: 20px;
        }
        .exp-description li {
            margin-bottom: 5px;
        }
        .suggestions-list {
            list-style: none;
        }
        .suggestion-item {
            background: rgba(245, 158, 11, 0.1);
            border: 1px solid rgba(245, 158, 11, 0.3);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 10px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .suggestion-icon {
            font-size: 18px;
        }
        .summary-text {
            background: rgba(255, 255, 255, 0.03);
            padding: 20px;
            border-radius: 12px;
            font-style: italic;
            color: #bbb;
            border-left: 3px solid #3b82f6;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            color: #666;
            font-size: 13px;
        }
        @media print {
            body {
                background: white;
                color: #333;
            }
            .container {
                background: white;
                box-shadow: none;
            }
            .score-value, .section-title {
                color: #14b8a6 !important;
                -webkit-text-fill-color: #14b8a6 !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">HireIQ</div>
            <h1 class="report-title">Resume Analysis Report</h1>
            <p class="report-date">Generated on ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</p>
        </div>

        <div class="section">
            <h2 class="section-title">Overall ATS Score</h2>
            <div class="score-grid">
                <div class="score-card main">
                    <div class="score-value main">${score.overall}</div>
                    <div class="score-label">Overall Score (out of 100)</div>
                </div>
                <div class="score-card">
                    <div class="score-value">${score.keywordsScore}</div>
                    <div class="score-label">Keywords</div>
                </div>
                <div class="score-card">
                    <div class="score-value">${score.formattingScore}</div>
                    <div class="score-label">Formatting</div>
                </div>
                <div class="score-card">
                    <div class="score-value">${score.completenessScore}</div>
                    <div class="score-label">Completeness</div>
                </div>
                <div class="score-card">
                    <div class="score-value">${score.experienceScore}</div>
                    <div class="score-label">Experience</div>
                </div>
                <div class="score-card">
                    <div class="score-value">${score.educationScore}</div>
                    <div class="score-label">Education</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Personal Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Name</div>
                    <div class="info-value">${details.personalInfo.name}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${details.personalInfo.email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Phone</div>
                    <div class="info-value">${details.personalInfo.phone}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Location</div>
                    <div class="info-value">${details.personalInfo.location}</div>
                </div>
                ${details.personalInfo.linkedin ? `
                <div class="info-item">
                    <div class="info-label">LinkedIn</div>
                    <div class="info-value">${details.personalInfo.linkedin}</div>
                </div>
                ` : ''}
                ${details.personalInfo.github ? `
                <div class="info-item">
                    <div class="info-label">GitHub</div>
                    <div class="info-value">${details.personalInfo.github}</div>
                </div>
                ` : ''}
            </div>
        </div>

        ${details.summary !== 'Summary not detected' ? `
        <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <p class="summary-text">${details.summary}</p>
        </div>
        ` : ''}

        <div class="section">
            <h2 class="section-title">Skills Detected (${allSkills.length} total)</h2>
            ${skillsHTML || '<p style="color: #888;">No skills detected. Consider adding a dedicated skills section.</p>'}
        </div>

        ${details.experience.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Work Experience</h2>
            ${experienceHTML}
        </div>
        ` : ''}

        ${details.education.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Education</h2>
            ${educationHTML}
        </div>
        ` : ''}

        ${details.certifications.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Certifications</h2>
            <div class="skill-tags">
                ${details.certifications.map(cert => `<span class="skill-tag">${cert}</span>`).join('')}
            </div>
        </div>
        ` : ''}

        ${score.suggestions.length > 0 ? `
        <div class="section">
            <h2 class="section-title">Improvement Suggestions</h2>
            <ul class="suggestions-list">
                ${suggestionsHTML}
            </ul>
        </div>
        ` : ''}

        <div class="footer">
            <p>Generated by HireIQ Resume Analyzer</p>
            <p>Original file: ${fileName}</p>
        </div>
    </div>
</body>
</html>
    `;

    return html;
}

/**
 * Download the report as HTML file
 */
export function downloadReport(
    details: ResumeDetails,
    score: ATSScore,
    fileName: string
): void {
    const html = generateHTMLReport(details, score, fileName);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Resume_Analysis_Report_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Print the report directly
 */
export function printReport(
    details: ResumeDetails,
    score: ATSScore,
    fileName: string
): void {
    const html = generateHTMLReport(details, score, fileName);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }
}
