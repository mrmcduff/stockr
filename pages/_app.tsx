import { SessionProvider } from 'next-auth/react';
import { AppProps } from "next/app";
import { MantineProvider, createTheme } from '@mantine/core';

// core styles are required for all packages
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/dates/styles.css';
// import '@mantine/modals/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/spotlight/styles.css';

const theme = createTheme({
  /** Put your mantine theme override here */
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <MantineProvider theme={theme}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
};

export default App;
