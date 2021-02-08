function renderLicenseBadge(license) {
  let badge = `![${license.licenseName}](https://img.shields.io/badge/${license.licenseKey}-brightgreen)`;
  return badge;
}
function renderLicenseLink(license) {
  let url = license.licenseUrl.replace(/['"]+/g, "");
  return `<a href="${url}" target="_blank">${license.licenseName}</a>`;
}

function renderLicenseSection(license) {
  return `
  ${renderLicenseLink(license)} ${renderLicenseBadge(license)} 
  <details close>
  <summary>Expand to get full license details</summary>
  <p>${license.licenseTxt}</p>
  </details> `;
}

// Generate markdown for README
function generateMarkdown(dataInput) {
  ({
    title,
    description,
    installation,
    usage,
    contribution,
    test,
    username,
    email,
    link,
    ...license
  } = dataInput);

  return `
# ${title} ${renderLicenseBadge(
    license
  )} ![Javascript](https://img.shields.io/github/languages/top/nielsenjared/badmath)


## Description 🤓
${description}
  
## Table of Contents 🗒️
* 🔧 [Installation](#installation)
* 🗒️ [Usage](#usage)
* ❤️  [Contributing](#contributing)
* ⚖️  [License](#license)
* 🧐 [Tests](#tests)
* 📩 [Questions](#questions)

## Installation
\`\`\`typescript
${installation}
\`\`\`
  
## Usage 
\`\`\`typescript
${usage}
\`\`\`
  
##  License
${renderLicenseSection(license)}
    
  
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

${contribution}
  
## Tests
\`\`\`typescript
${test}
\`\`\`

## Questions
For any questions on this project, or if you want to learn more about me, don't hesitate to:
- View and give your feedback to my GitHub projects:  https://github.com/${username}
- Visit my portofolio page: ${link}
- Send an email to: ${email}
`;
}

module.exports = { generateMarkdown };
