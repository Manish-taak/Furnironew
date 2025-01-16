// 'use client'

// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// // Define the shape of the context value
// interface ThemeContextType {
//   togglemode: () => void;
//   themstate: string;
// }

// // Create a context with a default value of null
// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// interface ThemeProviderProps {
//   children: ReactNode;
// }

// export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
//   const [themstate, setThemstate] = useState<string>('light');

//   useEffect(() => {
//     document.body.className = themstate;
//   }, [themstate]);

//   const togglemode = () => {
//     setThemstate((pre) => (pre === 'light' ? 'dark' : 'light'));
//   };

//   return (
//     <ThemeContext.Provider value={{ togglemode, themstate }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = (): ThemeContextType => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };

// // import React, { createContext, useContext, useEffect, useState } from 'react'
// const ThemeContext = createContext()



// export const ThemeProvider = ({ children }) => {
//     // const [themstate, setThemstate] = useState('light')
//     // useEffect(() => {
//     //     document.body.className = themstate
//     // }, [themstate])
//     // const togglemode = () => {
//     //     setThemstate((pre) => (pre === "light" ? "dark" : "light"))
//     // }
//     return (
//         <ThemeContext.Provider value={{ togglemode, themstate }}  >
//             {children}
//         </ThemeContext.Provider>
//     )
// }

// export const useTheme = () => useContext(ThemeContext)



// <ThemeProvider>
// <App></App>
// </ThemeProvider>






// import './App.css';
// import { useTheme } from './contaxt/ThemeContext';
// function App() {
//   const { themstate, togglemode } = useTheme();
//   return (
//     <>
//       <div className={`app-container ${themstate}`}>
//         <div className="content">
//           <h1>The current theme is {themstate}</h1>
//           <button onClick={togglemode}>Toggle Theme</button>
//         </div>
//       </div>
//       <Animation />
//     </>
//   );
// }
// export default App;