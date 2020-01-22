import React from "react";
export const gap = 0.02;
export const WindowSizeContext = React.createContext({
  pdGap: gap,
  height: window.innerHeight - window.innerWidth * 2 * gap
});
