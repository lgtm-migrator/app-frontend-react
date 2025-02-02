/// <reference types='cypress' />
/// <reference types="../../support" />

import AppFrontend from '../../pageobjects/app-frontend';
import Common from '../../pageobjects/common';
import * as texts from '../../fixtures/texts.json';

const appFrontend = new AppFrontend();
const mui = new Common();

describe('Calculate Page Order', () => {
  it('Testing combinations of old and new hidden pages functionalities', () => {
    cy.interceptLayout('group', () => {}, (layoutSet) => {
      layoutSet.prefill.data.hidden = ['equals', ['component', 'sendersName'], 'hidePrefill'];
      layoutSet.repeating.data.hidden = ['and',
        ['equals', ['component', 'sendersName'], 'hideRepeating'],
        ['or',
          ['equals', ['component', 'choose-group-prefills'], ''],
          ['equals', ['component', 'choose-group-prefills'], null]
        ]
      ];
    });
    cy.intercept('POST', '**/pages/order*').as('getPageOrder');

    cy.goto('group');
    cy.contains(mui.button, texts.next).click();
    cy.get(appFrontend.group.showGroupToContinue).then((checkbox) => {
      cy.get(checkbox).should('be.visible').find('input').check();
    });

    cy.get(appFrontend.navMenuButtons).should('have.length', 4);

    cy.addItemToGroup(1, 11, 'automation');
    cy.contains(mui.button, texts.next).click();
    cy.wait('@getPageOrder');

    cy.get(appFrontend.navMenuButtons).should('have.length', 3);
    cy.get(appFrontend.group.sendersName).should('not.exist');
    cy.get(appFrontend.group.summaryText).should('be.visible');
    cy.get(appFrontend.navMenuCurrent).should('have.text', '3. summary');

    cy.get(appFrontend.navMenu).find('li > button').eq(1).click();
    cy.get(appFrontend.group.rows[0].editBtn).click();
    cy.get(appFrontend.group.newValue).clear().type('2');

    cy.get(appFrontend.navButtons).contains(mui.button, texts.next).click();
    cy.wait('@getPageOrder');
    cy.get(appFrontend.navMenuButtons).should('have.length', 4);
    cy.get(appFrontend.group.sendersName).should('exist');
    cy.get(appFrontend.navMenuCurrent).should('have.text', '3. hide');

    cy.get(appFrontend.navMenuButtons).should('contain.text', '1. prefill');
    cy.get(appFrontend.group.sendersName).type('hidePrefill');
    cy.get(appFrontend.navButtons).contains(mui.button, texts.prev).click();
    cy.get(appFrontend.navMenuButtons).should('have.length', 3);
    cy.get(appFrontend.navMenuCurrent).should('have.text', '1. repeating');

    cy.get(appFrontend.navButtons).contains(mui.button, texts.next).click();

    // Clicking previous here is expected to not have any effect, because the triggered action is rejected when
    // the 'repeating' page is supposed to be hidden by the change. Clicking too fast leads to a failure...
    cy.get(appFrontend.group.sendersName).clear().type('hideRepeating');
    cy.get(appFrontend.navButtons).contains(mui.button, texts.prev).click();

    // ...but clicking 'previous' after this point will have updated the components to know that the previous page
    // now is the 'prefill' page
    cy.get(appFrontend.navMenuButtons).should('have.length', 3);
    cy.get(appFrontend.navButtons).contains(mui.button, texts.prev).click();

    cy.get(appFrontend.navMenuCurrent).should('have.text', '1. prefill');
    cy.get(appFrontend.navMenuButtons).should('contain.text', '2. hide');

    cy.get(appFrontend.group.prefill.liten).click();
    cy.get(appFrontend.navButtons).contains(mui.button, texts.next).click();

    // And this is, in essence, a bug. Navigating to the next page should consider what the next page is, even if
    // just-made-changes affects which page is the next one. Right now the component re-render loop needs to run
    // for NavigationButtons to know what the next layout is in order to navigate to the correct one.
    // TODO: Fix this by triggering a 'navigate to the next page' action instead of 'navigate to this exact page'
    cy.get(appFrontend.navMenuCurrent).should('have.text', '3. hide');
    cy.get(appFrontend.navMenuButtons).should('contain.text', '2. repeating');

    // TODO: Comment this in and delete the lines above when the bug is fixed:
    // cy.get(appFrontend.navMenuCurrent).should('have.text', '2. repeating');
    // cy.get(appFrontend.navMenuButtons).should('contain.text', '3. hide');
  });
});
