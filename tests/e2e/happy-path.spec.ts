import { test, expect } from '@playwright/test';

test.describe('My Will - Happy Path Journey', () => {
  test('Complete broker journey from login to signed will', async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Verify landing page loads
    await expect(page.locator('h1')).toContainText('Streamline Your Will Creation Process');
    
    // Click login
    await page.click('text=Sign In');
    await expect(page).toHaveURL('/login');
    
    // Login as broker
    await page.fill('input[name="email"]', 'broker@alder.co.uk');
    await page.fill('input[name="password"]', 'test1234');
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Verify broker name is displayed
    await expect(page.locator('text=Welcome')).toBeVisible();
    
    // Navigate to clients
    await page.click('text=Clients');
    await expect(page).toHaveURL('/clients');
    
    // Create a new client
    await page.click('text=New Client');
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="phone"]', '07123456789');
    await page.fill('input[name="addressLine1"]', '123 Test Street');
    await page.fill('input[name="city"]', 'London');
    await page.fill('input[name="postcode"]', 'SW1A 1AA');
    await page.click('button:has-text("Create Client")');
    
    // Verify client was created and we're on client detail page
    await expect(page.locator('h1')).toContainText('John Doe');
    
    // Create a new will
    await page.click('text=New Will');
    await expect(page).toHaveURL(/\/wills\/new/);
    
    // Search and select the client
    await page.fill('input[placeholder*="search"]', 'John Doe');
    await page.click('text=John Doe');
    await page.click('text=Start Will Wizard');
    
    // Verify we're in the will wizard
    await expect(page.locator('h1')).toContainText('Will Creation Wizard');
    
    // Step 1: Personal Information
    await expect(page.locator('text=Personal Information')).toBeVisible();
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="dob"]', '1980-01-01');
    await page.selectOption('select[name="maritalStatus"]', 'married');
    await page.click('text=Next');
    
    // Step 2: Executors
    await expect(page.locator('text=Executors')).toBeVisible();
    await page.fill('input[name="executors.0.fullName"]', 'Jane Doe');
    await page.fill('input[name="executors.0.relationship"]', 'Spouse');
    await page.fill('input[name="executors.0.address"]', '123 Test Street, London, SW1A 1AA');
    await page.click('text=Next');
    
    // Step 3: Beneficiaries
    await expect(page.locator('text=Beneficiaries')).toBeVisible();
    await page.fill('input[name="residue.beneficiaries.0.name"]', 'Jane Doe');
    await page.fill('input[name="residue.beneficiaries.0.relationship"]', 'Spouse');
    await page.fill('input[name="residue.beneficiaries.0.percentage"]', '100');
    await page.click('text=Next');
    
    // Step 4: Residue
    await expect(page.locator('text=Residue of Estate')).toBeVisible();
    await page.selectOption('select[name="residue.distributionType"]', 'equal');
    await page.click('text=Next');
    
    // Step 5: Review
    await expect(page.locator('text=Review')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Jane Doe')).toBeVisible();
    
    // Save the will
    await page.click('text=Save Draft');
    await expect(page.locator('text=Draft saved successfully')).toBeVisible();
    
    // Generate preview
    await page.click('text=Generate Preview');
    await expect(page.locator('text=Preview generated successfully')).toBeVisible();
    
    // Send for approval
    await page.click('text=Send for Approval');
    await expect(page.locator('text=Will sent for approval')).toBeVisible();
    
    // Navigate to storage to verify will is there
    await page.click('text=Storage');
    await expect(page).toHaveURL('/storage');
    await expect(page.locator('text=John Doe')).toBeVisible();
    await expect(page.locator('text=Sent for Approval')).toBeVisible();
    
    // Complete attestation (simulate the process)
    await page.click('text=Complete Attestation');
    await expect(page.locator('text=Attestation completed successfully')).toBeVisible();
    
    // Verify will is now signed
    await expect(page.locator('text=Signed')).toBeVisible();
    
    // Navigate to pricing
    await page.click('text=Pricing');
    await expect(page).toHaveURL('/pricing');
    
    // Verify pricing is editable
    await expect(page.locator('input[name="singleWillPrice"]')).toBeVisible();
    
    // Navigate to admin (if platform admin)
    await page.click('text=Admin');
    await expect(page).toHaveURL('/admin');
    
    // Verify audit logs are visible
    await expect(page.locator('text=Audit Logs')).toBeVisible();
    
    // Test tenant isolation - verify we can't see other tenant data
    await page.goto('/clients');
    const clientNames = await page.locator('td:first-child').allTextContents();
    // Should only see clients from our tenant
    expect(clientNames.every(name => name.includes('John') || name.includes('Test'))).toBeTruthy();
  });
  
  test('Authentication and authorization', async ({ page }) => {
    // Test unauthorized access
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
    
    // Test invalid login
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
    
    // Test valid login
    await page.fill('input[name="email"]', 'broker@alder.co.uk');
    await page.fill('input[name="password"]', 'test1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('Client management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'broker@alder.co.uk');
    await page.fill('input[name="password"]', 'test1234');
    await page.click('button[type="submit"]');
    
    // Test client creation
    await page.goto('/clients');
    await page.click('text=New Client');
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Client');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button:has-text("Create Client")');
    
    // Verify client was created
    await expect(page.locator('text=Test Client')).toBeVisible();
    
    // Test client editing
    await page.click('text=Test Client');
    await page.click('text=Edit');
    await page.fill('input[name="firstName"]', 'Updated');
    await page.click('text=Save Changes');
    await expect(page.locator('text=Updated Client')).toBeVisible();
  });
  
  test('Task management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'broker@alder.co.uk');
    await page.fill('input[name="password"]', 'test1234');
    await page.click('button[type="submit"]');
    
    // Test task creation
    await page.goto('/tasks');
    await page.click('text=New Task');
    await page.fill('input[name="title"]', 'Test Task');
    await page.fill('input[name="description"]', 'Test task description');
    await page.selectOption('select[name="clientId"]', 'John Doe');
    await page.selectOption('select[name="priority"]', 'high');
    await page.fill('input[name="dueDate"]', '2024-12-31');
    await page.click('button:has-text("Create Task")');
    
    // Verify task was created
    await expect(page.locator('text=Test Task')).toBeVisible();
    
    // Test task status update
    await page.selectOption('select[value="pending"]', 'in_progress');
    await expect(page.locator('text=In Progress')).toBeVisible();
  });
  
  test('Document storage', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'broker@alder.co.uk');
    await page.fill('input[name="password"]', 'test1234');
    await page.click('button[type="submit"]');
    
    // Test storage page
    await page.goto('/storage');
    await expect(page.locator('h1')).toContainText('Storage');
    
    // Verify document filtering works
    await page.selectOption('select[name="kind"]', 'draft');
    await expect(page.locator('text=Draft')).toBeVisible();
  });
  
  test('Pricing management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'broker@alder.co.uk');
    await page.fill('input[name="password"]', 'test1234');
    await page.click('button[type="submit"]');
    
    // Test pricing page
    await page.goto('/pricing');
    await expect(page.locator('h1')).toContainText('Pricing');
    
    // Test pricing update
    await page.fill('input[name="singleWillPrice"]', '25000');
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=£250.00')).toBeVisible();
  });
  
  test('Policy pages', async ({ page }) => {
    // Test public policy pages
    await page.goto('/policies/privacy');
    await expect(page.locator('h1')).toContainText('Privacy Policy');
    
    await page.goto('/policies/terms');
    await expect(page.locator('h1')).toContainText('Terms and Conditions');
    
    await page.goto('/policies/refund');
    await expect(page.locator('h1')).toContainText('Refund Policy');
  });
});