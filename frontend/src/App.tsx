import React from 'react';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Container, 
  Typography, 
  Box, 
  AppBar, 
  Toolbar 
} from '@mui/material';
import { ImageUploader } from './components/ImageUploader';

// 创建主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              图片背景移除工具
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            一键移除图片背景
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph>
            上传图片，我们将自动移除背景，生成透明背景的PNG图片
          </Typography>
        </Box>
        <ImageUploader />
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} 图片背景移除工具 - 基于AI技术
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;