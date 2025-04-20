import { createContext, useContext } from "react";

type FontsContextType = {
  heading: string;
  body: string;
};

const FontsContext = createContext<FontsContextType>({
  heading: "font-heading",
  body: "font-body",
});

export function FontsProvider({ children }: { children: React.ReactNode }) {
  return (
    <FontsContext.Provider
      value={{
        heading: "font-heading",
        body: "font-body",
      }}
    >
      {children}
    </FontsContext.Provider>
  );
}

export function useFonts() {
  return useContext(FontsContext);
}
