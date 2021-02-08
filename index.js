const inquirer = require("inquirer");
const { Octokit } = require("@octokit/rest");
const { generateMarkdown } = require("./utils/generate-markdown");
const fs = require("fs");
const shell = require("shelljs");

const octokit = new Octokit();

let availableLicenses = [];

const promptUser = () => {
  return octokit
    .request("GET https://api.github.com/licenses")
    .then((response) => {
      availableLicenses = response.data;
      licenses = response.data.map((x) => x.name);
      return inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Enter project title: (Required)",
          validate: (titleInput) => {
            if (titleInput) {
              return true;
            } else {
              console.log("Please enter your project title!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "description",
          message: "Enter project description",
          validate: (descriptionInput) => {
            if (descriptionInput) {
              return true;
            } else {
              console.log("Please enter your project description!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "installation",
          message: "Enter project installation instructions",
          validate: (installationInput) => {
            if (installationInput) {
              return true;
            } else {
              console.log(
                "Please enter your project installation instructions!"
              );
              return false;
            }
          },
        },
        {
          type: "input",
          name: "usage",
          message: "Enter project usage details",
          validate: (usageInput) => {
            if (usageInput) {
              return true;
            } else {
              console.log("Please enter your project usage details!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "contribution",
          message: "Enter project contribution guidelines",
          validate: (contributionInput) => {
            if (contributionInput) {
              return true;
            } else {
              console.log("Please enter your project contribution guidelines!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "test",
          message: "Enter project test instructions",
          validate: (testInput) => {
            if (testInput) {
              return true;
            } else {
              console.log("Please enter your test instructions!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "username",
          message: "Enter your GitHub username",
          validate: (usernameInput) => {
            if (usernameInput) {
              return true;
            } else {
              console.log("Please enter your GitHub username!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "email",
          message: "Enter your email",
          validate: (emailInput) => {
            if (emailInput) {
              return true;
            } else {
              console.log("Please enter your email!");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "link",
          message: "Enter your GitHub profile link",
          validate: (linkInput) => {
            if (linkInput) {
              return true;
            } else {
              console.log("Please enter your GitHub profile link!");
              return false;
            }
          },
        },
        {
          type: "list",
          name: "licenseName",
          message: "Choose a license",
          choices: licenses,
          validate: (licenseInput) => {
            if (licenseInput) {
              return true;
            } else {
              console.log("Please choose a license!");
              return false;
            }
          },
        },
      ]);
    });
};
const writeFile = (fileContent) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("./dist/README.md", fileContent, (err) => {
      // if there's an error, reject the Promise and send the error to the Promise's `.catch()` method
      if (err) {
        reject(err);
        // return out of the function here to make sure the Promise doesn't accidentally execute the resolve() function as well
        return;
      }

      // if everything went well, resolve the Promise and send the successful data to the `.then()` method
      resolve({
        ok: true,
        message: "File created!",
      });
    });
  });
};
const selectedLicense = (selectedLicense) => {
  return availableLicenses.find(
    (license) => license.name === selectedLicense.licenseName
  );
};

const licenseDetails = (licenseObject) => {
  return octokit.request(`GET ${licenseObject.url}`);
};

// Initialize app
function init() {
  promptUser().then((data) => {
    let updatedInputDataObject = data;

    licenseDetails(selectedLicense(data))
      .then((response) => {
        updatedInputDataObject.licenseKey = response.data.key;
        updatedInputDataObject.licenseUrl = response.data.html_url;
        updatedInputDataObject.licenseTxt = response.data.body;
        return updatedInputDataObject;
      })
      .then((updatedData) => {
        return generateMarkdown(updatedData);
      })
      .then((generatedHTML) => {
        writeFile(generatedHTML).then(() => {
          shell.exec("./utils/open-readme.sh");
        });
      });
  });
}

// Function call to initialize app
init();
