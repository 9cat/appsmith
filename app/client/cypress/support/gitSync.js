/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/no-assigning-return-values */

require("cy-verify-downloads").addCustomCommand();
require("cypress-file-upload");

const dayjs = require("dayjs");
const {
  addMatchImageSnapshotCommand,
} = require("cypress-image-snapshot/command");
const loginPage = require("../locators/LoginPage.json");
const signupPage = require("../locators/SignupPage.json");
import homePage from "../locators/HomePage";
const pages = require("../locators/Pages.json");
const datasourceEditor = require("../locators/DatasourcesEditor.json");
const datasourceFormData = require("../fixtures/datasources.json");
const commonlocators = require("../locators/commonlocators.json");
const queryEditor = require("../locators/QueryEditor.json");
const modalWidgetPage = require("../locators/ModalWidget.json");
const widgetsPage = require("../locators/Widgets.json");
const LayoutPage = require("../locators/Layout.json");
const formWidgetsPage = require("../locators/FormWidgets.json");
import ApiEditor from "../locators/ApiEditor";
const apiwidget = require("../locators/apiWidgetslocator.json");
const dynamicInputLocators = require("../locators/DynamicInput.json");
const explorer = require("../locators/explorerlocators.json");
const datasource = require("../locators/DatasourcesEditor.json");
const viewWidgetsPage = require("../locators/ViewWidgets.json");
const generatePage = require("../locators/GeneratePage.json");
const jsEditorLocators = require("../locators/JSEditor.json");
const commonLocators = require("../locators/commonlocators.json");
import commentsLocators from "../locators/CommentsLocators";
const queryLocators = require("../locators/QueryEditor.json");
const welcomePage = require("../locators/welcomePage.json");
const publishWidgetspage = require("../locators/publishWidgetspage.json");
import gitSyncLocators from "../locators/gitSyncLocators";

let pageidcopy = " ";
const GITHUB_API_BASE = "https://api.github.com";
const chainStart = Symbol();

Cypress.Commands.add("revokeAccessGit", (appName) => {
  cy.xpath("//span[text()= `${appName}`]")
    .parent()
    .next()
    .click();
  cy.get(gitSyncLocators.disconnectAppNameInput).type(appName);
  cy.get(gitSyncLocators.disconnectButton).click();
  cy.route("POST", "api/v1/git/disconnect/*").as("disconnect");
  cy.get(gitSyncLocators.disconnectButton).click();
  cy.wait("@disconnect").should(
    "have.nested.property",
    "response.body.responseMeta.status",
    200,
  );
  cy.window()
    .its("store")
    .invoke("getState")
    .then((state) => {
      const { id, name } = state.ui.gitSync.disconnectingGitApp;
      expect(name).to.eq("");
      expect(id).to.eq("");
    });
});
Cypress.Commands.add(
  "connectToGitRepo",
  (repo, shouldCommit = true, assertConnectFailure) => {
    const testEmail = "test@test.com";
    const testUsername = "testusername";
    const owner = Cypress.env("TEST_GITHUB_USER_NAME");

    let generatedKey;
    // open gitSync modal
    cy.get(homePage.deployPopupOptionTrigger).click();
    cy.get(homePage.connectToGitBtn).click({ force: true });

    cy.intercept(
      {
        url: "api/v1/git/connect/*",
        hostname: window.location.host,
      },
      (req) => {
        req.headers["origin"] = "Cypress";
      },
    );
    cy.intercept("POST", "/api/v1/applications/ssh-keypair/*").as(
      `generateKey-${repo}`,
    );
    cy.get(gitSyncLocators.gitRepoInput).type(
      `git@github.com:${owner}/${repo}.git`,
    );
    cy.get(gitSyncLocators.generateDeployKeyBtn).click();
    cy.wait(`@generateKey-${repo}`).then((result) => {
      generatedKey = result.response.body.data.publicKey;
      generatedKey = generatedKey.slice(0, generatedKey.length - 1);
      // fetch the generated key and post to the github repo
      cy.request({
        method: "POST",
        url: `${GITHUB_API_BASE}/repos/${Cypress.env(
          "TEST_GITHUB_USER_NAME",
        )}/${repo}/keys`,
        headers: {
          Authorization: `token ${Cypress.env("GITHUB_PERSONAL_ACCESS_TOKEN")}`,
        },
        body: {
          title: "key0",
          key: generatedKey,
        },
      });

      cy.get(gitSyncLocators.useGlobalGitConfig).click();

      cy.get(gitSyncLocators.gitConfigNameInput).type(
        `{selectall}${testUsername}`,
      );
      cy.get(gitSyncLocators.gitConfigEmailInput).type(
        `{selectall}${testEmail}`,
      );
      // click on the connect button and verify
      cy.get(gitSyncLocators.connectSubmitBtn).click();

      if (!assertConnectFailure) {
        // check for connect success
        cy.wait("@connectGitRepo").should(
          "have.nested.property",
          "response.body.responseMeta.status",
          200,
        );

        // click commit button
        if (shouldCommit) {
          cy.get(gitSyncLocators.commitCommentInput).type("Initial Commit");
          cy.get(gitSyncLocators.commitButton).click();
          // check for commit success
          cy.wait("@commit").should(
            "have.nested.property",
            "response.body.responseMeta.status",
            201,
          );

          cy.get(gitSyncLocators.closeGitSyncModal).click();
        }
      } else {
        cy.wait("@connectGitRepo").then((interception) => {
          const status = interception.response.body.responseMeta.status;
          expect(status).to.be.gte(400);
        });
      }
    });
  },
);

Cypress.Commands.add("createGitBranch", (branch) => {
  cy.get(gitSyncLocators.branchButton).click({ force: true });
  cy.get(gitSyncLocators.branchSearchInput).type(`{selectall}${branch}{enter}`);
  // increasing timeout to reduce flakyness
  cy.get(".bp3-spinner", { timeout: 30000 }).should("exist");
  cy.get(".bp3-spinner", { timeout: 30000 }).should("not.exist");
});

Cypress.Commands.add("switchGitBranch", (branch, expectError) => {
  cy.get(gitSyncLocators.branchButton).click({ force: true });
  cy.get(gitSyncLocators.branchSearchInput).type(`{selectall}${branch}`);
  cy.get(gitSyncLocators.branchListItem)
    .contains(branch)
    .click();
  if (!expectError) {
    // increasing timeout to reduce flakyness
    cy.get(".bp3-spinner", { timeout: 30000 }).should("exist");
    cy.get(".bp3-spinner", { timeout: 30000 }).should("not.exist");
  }
});

Cypress.Commands.add("createTestGithubRepo", (repo, privateFlag = false) => {
  cy.request({
    method: "POST",
    url: `${GITHUB_API_BASE}/user/repos`,
    headers: {
      Authorization: `token ${Cypress.env("GITHUB_PERSONAL_ACCESS_TOKEN")}`,
    },
    body: {
      name: repo,
      private: privateFlag,
    },
  });
});

Cypress.Commands.add("mergeViaGithubApi", ({ base, head, repo }) => {
  const owner = Cypress.env("TEST_GITHUB_USER_NAME");
  cy.request({
    method: "POST",
    url: `${GITHUB_API_BASE}/repos/${owner}/${repo}/merges`,
    headers: {
      Authorization: `token ${Cypress.env("GITHUB_PERSONAL_ACCESS_TOKEN")}`,
    },
    body: {
      base,
      head,
    },
  });
});

Cypress.Commands.add("deleteTestGithubRepo", (repo) => {
  cy.request({
    method: "DELETE",
    url: `${GITHUB_API_BASE}/repos/${Cypress.env(
      "TEST_GITHUB_USER_NAME",
    )}/${repo}`,
    headers: {
      Authorization: `token ${Cypress.env("GITHUB_PERSONAL_ACCESS_TOKEN")}`,
    },
  });
});

Cypress.Commands.add(
  "renameBranchViaGithubApi",
  (repo, currentName, newName) => {
    cy.request({
      method: "POST",
      url: `${GITHUB_API_BASE}/repos/${Cypress.env(
        "TEST_GITHUB_USER_NAME",
      )}/${repo}/branches/${currentName}/rename`,
      headers: {
        Authorization: `token ${Cypress.env("GITHUB_PERSONAL_ACCESS_TOKEN")}`,
      },
      body: {
        new_name: newName,
      },
    });
  },
);

Cypress.Commands.add("commitAndPush", (assertFailure) => {
  cy.get(homePage.publishButton).click();
  cy.get(gitSyncLocators.commitCommentInput).type("Initial Commit");
  cy.get(gitSyncLocators.commitButton).click();

  if (!assertFailure) {
    // check for commit success
    cy.wait("@commit").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      201,
    );
  } else {
    cy.wait("@commit").then((interception) => {
      const status = interception.response.body.responseMeta.status;
      expect(status).to.be.gte(400);
    });
  }

  cy.get(gitSyncLocators.closeGitSyncModal).click();
});

// todo rishabh s: refactor
Cypress.Commands.add(
  "createAppAndConnectGit",
  (appname, shouldConnect = true, assertConnectFailure) => {
    cy.get(homePage.homeIcon).click({ force: true });
    cy.get(homePage.createNew)
      .first()
      .click({ force: true });
    cy.wait("@createNewApplication").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      201,
    );
    cy.get("#loading").should("not.exist");
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000);

    cy.AppSetupForRename();
    cy.get(homePage.applicationName).type(appname + "{enter}");
    cy.wait("@updateApplication").should(
      "have.nested.property",
      "response.body.responseMeta.status",
      200,
    );

    cy.createTestGithubRepo(appname, true);
    cy.connectToGitRepo(appname, false, assertConnectFailure);
    cy.get(gitSyncLocators.closeGitSyncModal).click({ force: true });
  },
);

Cypress.Commands.add("merge", (destinationBranch) => {
  cy.get(gitSyncLocators.bottomBarMergeButton).click();
  cy.get(gitSyncLocators.mergeBranchDropdownDestination).click();
  cy.get(commonLocators.dropdownmenu)
    .contains(destinationBranch)
    .click();
  cy.contains(Cypress.env("MESSAGES").NO_MERGE_CONFLICT());
  cy.get(gitSyncLocators.mergeCTA).click();
});
