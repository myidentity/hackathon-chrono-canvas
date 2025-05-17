/**
 * End-to-end tests for ChronoCanvas
 * 
 * This file contains Cypress tests for the main user flows in ChronoCanvas.
 */

describe('ChronoCanvas Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the application successfully', () => {
    // Check that the main components are rendered
    cy.get('[data-testid="app-header"]').should('exist');
    cy.get('[data-testid="canvas-container"]').should('exist');
    cy.get('[data-testid="timeline-container"]').should('exist');
    cy.get('[data-testid="element-library"]').should('exist');
    cy.get('[data-testid="property-panel"]').should('exist');
  });

  it('should add an element to the canvas', () => {
    // Open element library
    cy.get('[data-testid="element-library"]').should('be.visible');
    
    // Add a text element
    cy.get('[data-testid="add-text-element"]').click();
    
    // Verify element was added to canvas
    cy.get('[data-testid="canvas-container"]')
      .find('[data-element-type="text"]')
      .should('exist');
  });

  it('should select and modify an element', () => {
    // Add an element first
    cy.get('[data-testid="add-text-element"]').click();
    
    // Select the element
    cy.get('[data-testid="canvas-container"]')
      .find('[data-element-type="text"]')
      .click();
    
    // Verify property panel shows element properties
    cy.get('[data-testid="property-panel"]')
      .should('contain.text', 'Text Element');
    
    // Change text content
    cy.get('[data-testid="text-content-input"]')
      .clear()
      .type('Modified Text');
    
    // Verify element text was updated
    cy.get('[data-testid="canvas-container"]')
      .find('[data-element-type="text"]')
      .should('contain.text', 'Modified Text');
  });

  it('should control timeline playback', () => {
    // Add an element first
    cy.get('[data-testid="add-text-element"]').click();
    
    // Click play button
    cy.get('[data-testid="play-button"]').click();
    
    // Verify timeline is playing
    cy.get('[data-testid="timeline-scrubber"]')
      .should('have.attr', 'style')
      .and('include', 'left:');
    
    // Wait a moment and check that scrubber has moved
    cy.wait(1000);
    cy.get('[data-testid="timeline-scrubber"]')
      .should('have.attr', 'style')
      .and('include', 'left:')
      .and('not.equal', '0%');
    
    // Pause playback
    cy.get('[data-testid="pause-button"]').click();
  });

  it('should switch between view modes', () => {
    // Default should be editor mode
    cy.get('[data-testid="view-mode-indicator"]')
      .should('contain.text', 'Editor Mode');
    
    // Switch to timeline mode
    cy.get('[data-testid="timeline-mode-button"]').click();
    cy.get('[data-testid="view-mode-indicator"]')
      .should('contain.text', 'Timeline Mode');
    
    // Switch to presentation mode
    cy.get('[data-testid="presentation-mode-button"]').click();
    cy.get('[data-testid="view-mode-indicator"]')
      .should('contain.text', 'Presentation Mode');
    
    // Switch to zine mode
    cy.get('[data-testid="zine-mode-button"]').click();
    cy.get('[data-testid="view-mode-indicator"]')
      .should('contain.text', 'Zine Mode');
  });

  it('should add and use timeline markers', () => {
    // Click add marker button
    cy.get('[data-testid="add-marker-button"]').click();
    
    // Fill in marker details
    cy.get('[data-testid="marker-name-input"]')
      .type('Test Marker');
    
    // Save marker
    cy.get('[data-testid="save-marker-button"]').click();
    
    // Verify marker was added
    cy.get('[data-testid="timeline-marker"]')
      .should('exist')
      .and('contain.text', 'Test Marker');
    
    // Click on marker to seek to its position
    cy.get('[data-testid="timeline-marker"]').click();
    
    // Verify timeline position was updated
    cy.get('[data-testid="current-position"]')
      .invoke('text')
      .should('not.equal', '00:00');
  });

  it('should handle canvas zoom and pan', () => {
    // Get initial transform state
    cy.get('[data-testid="canvas-content"]')
      .invoke('attr', 'style')
      .as('initialTransform');
    
    // Zoom in
    cy.get('[data-testid="zoom-in-button"]').click();
    
    // Verify transform has changed
    cy.get('[data-testid="canvas-content"]')
      .invoke('attr', 'style')
      .should('not.eq', '@initialTransform');
    
    // Pan canvas
    cy.get('[data-testid="canvas-container"]')
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: 100, clientY: 100 })
      .trigger('mouseup');
    
    // Verify transform has changed again
    cy.get('[data-testid="canvas-content"]')
      .invoke('attr', 'style')
      .should('not.eq', '@initialTransform');
  });
});
