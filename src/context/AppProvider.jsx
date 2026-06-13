import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { NoticeProvider } from './NoticeContext';

export function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NoticeProvider>
          {children}
        </NoticeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
