# Budget Management App

This budget management app is a personal practice project developed using **React**, **TypeScript**, and **Material-UI**. It provides users with a comprehensive tool for tracking their finances.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Redux Setup](#redux-setup)
- [TailwindCSS Setup](#tailwindcss-setup)
- [Supabase Setup](#supabase-setup)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Dashboard**: View an overview of your financial health at a glance.
- **Wallet**: Manage and track different accounts and balances.
- **Budget**: Set and monitor budgets to stay on track with spending.
- **Goals**: Set financial goals and track your progress towards achieving them.
- **Analytics Page**: Gain insights into spending habits and trends to make informed financial decisions.

## Local Storage

All financial data is saved using local storage, ensuring that your information is accessible even after closing the browser.

## Demo

### Sign in page
![sign in](https://github.com/user-attachments/assets/135c1c04-ea44-48e5-a14f-e757d89f7cd0)

### Dashboard page
![1](https://github.com/user-attachments/assets/67572bca-1211-4ac3-b58d-2b70cd1b09b4)


### Wallet page
![2](https://github.com/user-attachments/assets/2d3909d2-ae27-40ca-ac51-12f8cc720c2d)

### Budget page

### Goal page
![4](https://github.com/user-attachments/assets/976dea3b-062a-4b15-8695-009d23c43dc4)

### Analytics page
![5](https://github.com/user-attachments/assets/c11ad628-2a80-4240-965b-5372ff6b447a)



## Features

- User-friendly shopping interface
- Product listings with detailed views
- Filter products by color, price range, size, and availability
- Shopping cart functionality
- User authentication and account management
- Responsive design with TailwindCSS
- State management using Redux
- Backend services and authentication handled by Supabase
- Skeleton loader for product loading

## Getting Started

To get started with this project, follow these steps:

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yasibena/redux-react-ecommerce.git
   cd ecommerce

### Usage
1. Start project
   ```sh
   npm install
   or
   yarn install

### Redux Setup

Our Redux setup is organized into a `redux` folder. Within this folder, you'll find `store.js` which sets up the Redux store. Additionally, there is a `feature` folder that contains different slices for handling various parts of the state.

#### Store Configuration

The `store.js` file is responsible for configuring the Redux store. Here’s a snippet of how it’s set up:

```js
import { configureStore } from "@reduxjs/toolkit";
import productReducer from './feature/ProductSlice';
import modalReducer from "./feature/modalSlice";
import { apiSlice } from "./feature/apiSlice";
import cartSlice from "./feature/cartSlice";
import authReducer from './feature/authSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    modal: modalReducer,
    auth: authReducer,
    cart: cartSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});
```

Inside the redux folder, there is a feature folder that contains the following slices:

*   ProductSlice.js: Manages the state related to products.
*   ModalSlice.js: Manages the state related to modal visibility and interactions.
*   apiSlice.js: Handles API calls and state management related to data fetching.
*   cartSlice.js: Manages the state of the shopping cart.
*   authSlice.js: Manages user authentication and related state.
    
By organizing our Redux state management this way, we keep our code modular and easier to maintain.

### TailwindCSS Setup
TailwindCSS is already set up. You can start using it by adding classes to your components. For example:

```js
function ProductCard({ product }) {
  return (
    <div className="p-4 m-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p className="text-gray-700">{product.description}</p>
      <p className="text-green-500">${product.price}</p>
    </div>
  );
}
```

### Supabase Setup 
Make sure to configure Supabase for backend services and authentication. You can sign up for a free account and create a new project at Supabase.
1. Install Supabase dependencies:
  ```sh
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```
  ```sh
npm run dev
```
this start project on http://localhost:5173/

2. Initialize Supabase in your project:

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);
```
3. Use Supabase for authentication and backend services throughout your app.


