
# Sauce Demo Test Plan

*Planner-style test plan for https://www.saucedemo.com, prepared October 28, 2026*

## Application Overview

Swag Labs (https://www.saucedemo.com) is a demo e-commerce site. It has a login page, a product inventory page (6 products with sorting), a shopping cart, and a 3-step checkout. Public test credentials: users `standard_user` and `locked_out_user`, password `secret_sauce`.

**Note:** the site is a JavaScript app, so this plan was written from knowledge of Sauce Demo, not from inspecting the live page. Locators and message texts are unverified until the generator agent checks them in a real browser.

## Test Scenarios

### 1. Login

**Seed:** `tests/seed.spec.ts`

#### 1.1 Successful login with a valid user

**Steps:**

1. Navigate to https://www.saucedemo.com
2. Enter `standard_user` in the Username field
3. Enter `secret_sauce` in the Password field
4. Click **Login**

**Expected results:**

- The URL contains `/inventory.html`
- The "Products" title is visible
- 6 products are displayed

#### 1.2 Locked-out user sees an error

**Steps:**

1. Navigate to https://www.saucedemo.com
2. Enter `locked_out_user` and `secret_sauce`
3. Click **Login**

**Expected results:**

- The user stays on the login page
- The error "Epic sadface: Sorry, this user has been locked out." is shown

### 2. Shopping Cart

#### 2.1 Add a product to the cart

**Steps:**

1. Log in as `standard_user`
2. Click **Add to cart** on "Sauce Labs Backpack"
3. Click the cart icon

**Expected results:**

- The button changes to **Remove**
- The cart badge shows `1`
- The cart page shows "Your Cart" with "Sauce Labs Backpack" at $29.99

### 3. Product Sorting

#### 3.1 Sort products by price, low to high

**Steps:**

1. Log in as `standard_user`
2. Select **Price (low to high)** in the sort dropdown

**Expected results:**

- The first product is "Sauce Labs Onesie" ($7.99)
- The last product is "Sauce Labs Fleece Jacket" ($49.99)
- Prices appear in ascending order

### 4. Checkout

#### 4.1 Complete a purchase end to end

**Steps:**

1. Log in as `standard_user`
2. Add "Sauce Labs Backpack" to the cart and open the cart
3. Click **Checkout**
4. Enter First Name `Salma`, Last Name `Test`, Zip/Postal Code `500001`
5. Click **Continue**
6. On the overview page, click **Finish**

**Expected results:**

- The overview page ("Checkout: Overview") lists the Backpack
- The confirmation page shows "Thank you for your order!"
- The cart badge disappears

## What the Generator Should Verify on the Live Site

- Field placeholders and button names
- The exact error message text
- The sort option label
- The confirmation message

If any of these differ, fix the plan before generating tests, because the generator trusts the plan as written.

## Possible Follow-up Scenarios

- Empty username error
- Removing an item from the cart
- Logout through the menu