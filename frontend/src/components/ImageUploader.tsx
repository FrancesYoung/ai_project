import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import { ImageState } from '../types';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const ImageUploader: React.FC = () => {
  const [state, setState] = useState<ImageState>({
    file: null,
    preview: null,
    processed: null,
    isLoading: false,
    error: null,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setState(prev => ({
        ...prev,
        file,
        preview: URL.createObjectURL(file),
        processed: null,
        error: null,
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
  });

  const handleRemoveBackground = async () => {
    if (!state.file) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    const formData = new FormData();
    formData.append('file', state.file);

    try {
      // 打印请求前的信息
      console.log('发送请求前:');
      console.log('FormData对象:', formData);
      console.log('FormData内容:', Array.from(formData.entries()));
      console.log('请求配置:', {
        url: `${API_URL}/remove-bg`,
        method: 'post',
        responseType: 'blob'
      });

      // 尝试两种方式处理响应
      let response;
      try {
        // 首先尝试作为blob处理
        response = await axios.post(`${API_URL}/remove-bg`, formData, {
          responseType: 'blob',
        });
        
        // 打印完整响应信息
        console.log('完整响应对象:', response);
        console.log('收到响应:');
        console.log('响应状态:', response.status, response.statusText);
        console.log('响应头:', response.headers);
        console.log('响应数据:', response.data);
        console.log('响应数据类型:', response.data.type, response.data.size + ' bytes');
        
        // 检查内容类型
        const contentType = response.headers['content-type'];
        console.log('内容类型:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
          // 如果是JSON，读取内容并解析
          console.log('检测到JSON响应，尝试解析...');
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const jsonData = JSON.parse(reader.result as string);
              console.log('解析的JSON数据:', jsonData);
              
              // 如果JSON包含base64图片数据
              if (jsonData && jsonData.image_data) {
                // 检查是否已经包含base64头
                let imgSrc = jsonData.image_data;
                console.log('原始图片数据前缀:', imgSrc.substring(0, 30));
                
                // 如果不是以data:开头，则添加base64头
                if (!imgSrc.startsWith('data:')) {
                  imgSrc = `data:image/png;base64,${imgSrc}`;
                }
                
                console.log('最终图片URL:', imgSrc.substring(0, 50) + '...');
                setState(prev => ({
                  ...prev,
                  processed: imgSrc,
                  isLoading: false,
                }));
                return; // 提前返回，避免执行后续代码
              }
            } catch (e) {
              console.error('JSON解析失败:', e);
            }
          };
          reader.readAsText(response.data);
        }
      } catch (error) {
        console.error('Blob处理失败，尝试JSON处理:', error);
        // 如果blob处理失败，尝试作为JSON处理
        response = await axios.post(`${API_URL}/remove-bg`, formData);
        console.log('JSON响应:', response.data);
        
        if (response.data && response.data.image_data) {
          const imgSrc = `data:image/png;base64,${response.data.image_data}`;
          console.log('从JSON响应提取的图片URL:', imgSrc.substring(0, 50) + '...');
          setState(prev => ({
            ...prev,
            processed: imgSrc,
            isLoading: false,
          }));
          return; // 提前返回
        }
      }

      // 如果上面的特殊处理没有提前返回，则使用默认的blob处理
      const url = URL.createObjectURL(response.data);
      console.log('生成的图片URL:', url);
      
      setState(prev => ({
        ...prev,
        processed: url,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: '处理图片时出错，请重试',
      }));
    }
  };

  const handleReset = () => {
    // 清理现有的 Blob URLs
    if (state.preview) {
      URL.revokeObjectURL(state.preview);
    }
    if (state.processed) {
      URL.revokeObjectURL(state.processed);
    }
    
    setState({
      file: null,
      preview: null,
      processed: null,
      isLoading: false,
      error: null,
    });
  };

  // 组件卸载时清理 Blob URLs
  React.useEffect(() => {
    return () => {
      if (state.preview) {
        URL.revokeObjectURL(state.preview);
      }
      if (state.processed) {
        URL.revokeObjectURL(state.processed);
      }
    };
  }, [state.preview, state.processed]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? '放开以上传图片'
            : '拖放图片到此处，或点击选择图片'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          支持 PNG, JPG 格式
        </Typography>
      </Paper>

      {state.error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {state.error}
        </Typography>
      )}

      {(state.preview || state.processed) && (
        <Stack spacing={2} sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {state.preview && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  原始图片
                </Typography>
                <img
                  src={state.preview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}
            {state.processed && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  处理后的图片
                </Typography>
                <img
                  src={state.processed}
                  alt="Processed"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center">
            {!state.processed && (
              <Button
                variant="contained"
                onClick={handleRemoveBackground}
                disabled={state.isLoading}
                startIcon={
                  state.isLoading && <CircularProgress size={20} color="inherit" />
                }
              >
                {state.isLoading ? '处理中...' : '移除背景'}
              </Button>
            )}
            <Button variant="outlined" onClick={handleReset}>
              重置
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};