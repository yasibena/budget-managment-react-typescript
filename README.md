# Budget Management App

This budget management app is a personal practice project developed using **React**, **TypeScript**, and **Material-UI**. It provides users with a comprehensive tool for tracking their finances.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage and Setup](#usage-and-setup)
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



## Getting Started

To get started with this project, follow these steps:

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

To set up a React project with TypeScript using Vite and Material-UI (MUI), follow these steps:

▎Step 1: Create a new Vite project

1. Open your terminal.

2. Run the following command to create a new Vite project with TypeScript:


   npm create vite@latest my-budget-app --template react-ts
   

   Replace my-budget-app with your desired project name.

3. Navigate into your project directory:

   
   cd my-budget-app
   

▎Step 2: Install dependencies

1. Install the required dependencies for Material-UI:

   
   npm install @mui/material @emotion/react @emotion/styled
   

   • @mui/material: The core Material-UI components.

   • @emotion/react and @emotion/styled: Required for styling with Material-UI.

▎Step 3: Start the development server

1. Start the development server to see your app in action:

   
   npm run dev
   

2. Open your browser and navigate to http://localhost:5173 (or the port indicated in your terminal) to view your application.

▎Step 4: Set up Material-UI

1. You can now start using Material-UI components in your React app. For example, open src/App.tsx and modify it as follows:
```js
   import React from 'react';
   import { Button, Container, Typography } from '@mui/material';

   const App: React.FC = () => {
     return (
       <Container>
         <Typography variant="h4" component="h1" gutterBottom>
           Budget Management App
         </Typography>
         <Button variant="contained" color="primary">
           Add Expense
         </Button>
       </Container>
     );
   };

   export default App;
   ```

▎Step 5: Customize your theme (optional)

If you want to customize the Material-UI theme, you can do so by wrapping your application with a ThemeProvider. Here’s how to set it up:

1. Create a new file called theme.ts in the src directory:

   
   // src/theme.ts
   import { createTheme } from '@mui/material/styles';

   const theme = createTheme({
     palette: {
       primary: {
         main: '#1976d2',
       },
       secondary: {
         main: '#dc004e',
       },
     },
   });

   export default theme;
   

2. Update src/main.tsx to include the ThemeProvider:

   
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import { ThemeProvider } from '@mui/material/styles';
   import theme from './theme';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <ThemeProvider theme={theme}>
         <App />
       </ThemeProvider>
     </React.StrictMode>,
   );
   

▎Conclusion

You now have a React application set up with TypeScript using Vite and Material-UI. You can start building your budget management app by adding more components and functionality as needed! If you need further assistance or have specific features in mind, feel free to ask!
